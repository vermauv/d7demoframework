/**
 * @file
 * Overrides default behaviors for the Contextual module.
 */

(function ($) {

"use strict";

Drupal.contextualLinks = Drupal.contextualLinks || {};

/**
 * Attaches outline behavior for regions associated with contextual links.
 */
Drupal.behaviors.contextualLinks = {
  attach: function (context) {
    $('div.contextual-links-wrapper', context).once('contextual-links', function () {
      var $wrapper = $(this);
      var $region = $wrapper.closest('.contextual-links-region');
      var $links = $wrapper.find('ul.contextual-links');
      var $trigger = $('<a class="contextual-links-trigger" href="#" />').text(Drupal.t('Configure')).click(
        function () {
          $links.stop(true, true).slideToggle(100);
          $wrapper.toggleClass('contextual-links-active');
          return false;
        }
      );
      // Attach hover behavior to trigger and ul.contextual-links.
      $trigger.add($links).hover(
        function () { $region.addClass('contextual-links-region-active'); },
        function () { $region.removeClass('contextual-links-region-active'); }
      );
      // Hide the contextual links when user clicks a link or rolls out of the .contextual-links-region.
      $region.bind('mouseleave click', Drupal.contextualLinks.mouseleave);
      $region.hover(
        function() { $trigger.addClass('contextual-links-trigger-active'); },
        // Check for the Quick edit highlight.
        function() { 
          if (!$trigger.hasClass('quickedit-contextual-link')) { 
            $trigger.removeClass('contextual-links-trigger-active'); 
          } 
        }
      );
      // Prepend the trigger.
      $wrapper.prepend($trigger);
    });
  }
};

/**
 * Disables outline for the region contextual links are associated with.
 */
Drupal.contextualLinks.mouseleave = function () {
  $(this)
    .find('.contextual-links-active').removeClass('contextual-links-active')
    .find('ul.contextual-links').hide();
};

})(jQuery);
;
/**
 * @file
 * Attaches behavior for the Quick Edit module.
 *
 * Everything happens asynchronously, to allow for:
 *   - dynamically rendered contextual links
 *   - asynchronously retrieved (and cached) per-field in-place editing metadata
 *   - asynchronous setup of in-place editable field and "Quick edit" link
 *
 * To achieve this, there are several queues:
 *   - fieldsMetadataQueue: fields whose metadata still needs to be fetched.
 *   - fieldsAvailableQueue: queue of fields whose metadata is known, and for
 *     which it has been confirmed that the user has permission to edit them.
 *     However, FieldModels will only be created for them once there's a
 *     contextual link for their entity: when it's possible to initiate editing.
 *   - contextualLinksQueue: queue of contextual links on entities for which it
 *     is not yet known whether the user has permission to edit at >=1 of them.
 */

(function ($, _, Backbone, Drupal, drupalSettings, JSON, storage) {

  "use strict";

  var options = $.extend(drupalSettings.quickedit,
    // Merge strings on top of drupalSettings so that they are not mutable.
    {
      strings: {
        quickEdit: Drupal.t('Quick edit')
      }
    }
  );

  /**
   * Tracks fields without metadata. Contains objects with the following keys:
   *   - DOM el
   *   - String fieldID
   *   - String entityID
   */
  var fieldsMetadataQueue = [];

  /**
   * Tracks fields ready for use. Contains objects with the following keys:
   *   - DOM el
   *   - String fieldID
   *   - String entityID
   */
  var fieldsAvailableQueue = [];

  /**
   * Tracks contextual links on entities. Contains objects with the following
   * keys:
   *   - String entityID
   *   - DOM el
   *   - DOM region
   */
  var contextualLinksQueue = [];

  /**
   * Tracks how many instances exist for each unique entity. Contains key-value
   * pairs:
   * - String entityID
   * - Number count
   */
  var entityInstancesTracker = {};

  Drupal.behaviors.quickedit = {
    attach: function (context) {
      // Initialize the Quick Edit app once per page load.
      $('body').once('quickedit-init', initQuickEdit);

      // Find all in-place editable fields, if any.
      var $fields = $(context).find('[data-quickedit-field-id]').once('quickedit');
      if ($fields.length === 0) {
        return;
      }

      // Process each entity element: identical entities that appear multiple
      // times will get a numeric identifier, starting at 0.
      $(context).find('[data-quickedit-entity-id]').once('quickedit').each(function (index, entityElement) {
        var entityID = entityElement.getAttribute('data-quickedit-entity-id');
        if (!entityInstancesTracker.hasOwnProperty(entityID)) {
          entityInstancesTracker[entityID] = 0;
        }
        else {
          entityInstancesTracker[entityID]++;
        }

        // Set the p entity instance ID for this element.
        var entityInstanceID = entityInstancesTracker[entityID];
        entityElement.setAttribute('data-quickedit-entity-instance-id', entityInstanceID);
      });

      // Detect contextual links on entities annotated by Quick Edit; queue
      // these to be processed.
      $(context).find('.contextual-links').once('quickedit-contextual').each(function (index, contextualLinkElement) {
        var $region = $(contextualLinkElement).closest('.contextual-links-region');
        // Either the contextual link is set directly on the entity DOM element,
        // or it is set on a container of the entity DOM element that is its
        // contextual region.
        if ($region.is('[data-quickedit-entity-id]') || $region.is('[data-quickedit-is-contextual-region-for-entity]')) {
          var entityElement;
          if ($region.is('[data-quickedit-entity-id]')) {
            entityElement = $region.get(0);
          }
          else {
            entityElement = $region.find('[data-quickedit-entity-id]').get(0);
          }
          var contextualLink = {
            entityID: entityElement.getAttribute('data-quickedit-entity-id'),
            entityInstanceID: entityElement.getAttribute('data-quickedit-entity-instance-id'),
            el: contextualLinkElement,
            region: $region[0]
          };
          // Queue contextual link to be set up later.
          contextualLinksQueue.push(contextualLink);
        }
      });

      // Process each field element: queue to be used or to fetch metadata.
      // When a field is being rerendered after editing, it will be processed
      // immediately. New fields will be unable to be processed immediately, but
      // will instead be queued to have their metadata fetched, which occurs below
      // in fetchMissingMetaData().
      $fields.each(function (index, fieldElement) {
        processField(fieldElement);
      });

      // Entities and fields on the page have been detected, try to set up the
      // contextual links for those entities that already have the necessary meta-
      // data in the client-side cache.
      contextualLinksQueue = _.filter(contextualLinksQueue, function (contextualLink) {
        return !initializeEntityContextualLink(contextualLink);
      });

      // Fetch metadata for any fields that are queued to retrieve it.
      fetchMissingMetadata(function (fieldElementsWithFreshMetadata) {
        // Metadata has been fetched, reprocess fields whose metadata was missing.
        _.each(fieldElementsWithFreshMetadata, processField);

        // Metadata has been fetched, try to set up more contextual links now.
        contextualLinksQueue = _.filter(contextualLinksQueue, function (contextualLink) {
          return !initializeEntityContextualLink(contextualLink);
        });
      });
    },
    detach: function (context, settings, trigger) {
      if (trigger === 'unload') {
        deleteContainedModelsAndQueues($(context));
      }
    }
  };

  Drupal.quickedit = {
    // A Drupal.quickedit.AppView instance.
    app: null,

    collections: {
      // All in-place editable entities (Drupal.quickedit.EntityModel) on the
      // page.
      entities: null,
      // All in-place editable fields (Drupal.quickedit.FieldModel) on the page.
      fields: null
    },

    // In-place editors will register themselves in this object.
    editors: {},

    // Per-field metadata that indicates whether in-place editing is allowed,
    // which in-place editor should be used, etc.
    metadata: {
      has: function (fieldID) {
        return storage.getItem(this._prefixFieldID(fieldID)) !== null;
      },
      add: function (fieldID, metadata) {
        storage.setItem(this._prefixFieldID(fieldID), JSON.stringify(metadata));
      },
      get: function (fieldID, key) {
        var metadata = JSON.parse(storage.getItem(this._prefixFieldID(fieldID)));
        return (key === undefined) ? metadata : metadata[key];
      },
      _prefixFieldID: function (fieldID) {
        return 'Drupal.quickedit.metadata.' + fieldID;
      },
      _unprefixFieldID: function (fieldID) {
        // Strip "Drupal.quickedit.metadata.", which is 21 characters long.
        return fieldID.substring(26);
      },
      intersection: function (fieldIDs) {
        var prefixedFieldIDs = _.map(fieldIDs, this._prefixFieldID);
        var intersection = _.intersection(prefixedFieldIDs, _.keys(sessionStorage));
        return _.map(intersection, this._unprefixFieldID);
      }
    }
  };

  // Clear the Quick Edit metadata cache whenever the current user's set of
  // permissions changes.
  var permissionsHashKey = Drupal.quickedit.metadata._prefixFieldID('permissionsHash');
  var permissionsHashValue = storage.getItem(permissionsHashKey);
  var permissionsHash = drupalSettings.quickedit.user.permissionsHash;
  if (permissionsHashValue !== permissionsHash) {
    if (typeof permissionsHash === 'string') {
      _.chain(storage).keys().each(function (key) {
        if (key.substring(0, 26) === 'Drupal.quickedit.metadata.') {
          storage.removeItem(key);
        }
      });
    }
    storage.setItem(permissionsHashKey, permissionsHash);
  }

  /**
   * Extracts the entity ID from a field ID.
   *
   * @param String fieldID
   *   A field ID: a string of the format
   *   `<entity type>/<id>/<field name>/<language>/<view mode>`.
   * @return String
   *   An entity ID: a string of the format `<entity type>/<id>`.
   */
  function extractEntityID (fieldID) {
    return fieldID.split('/').slice(0, 2).join('/');
  }

  /**
   * Initialize the Quick Edit app.
   *
   * @param DOM bodyElement
   *   This document's body element.
   */
  function initQuickEdit (bodyElement) {
    Drupal.quickedit.collections.entities = new Drupal.quickedit.EntityCollection();
    Drupal.quickedit.collections.fields = new Drupal.quickedit.FieldCollection();

    // Instantiate AppModel (application state) and AppView, which is the
    // controller of the whole in-place editing experience.
    Drupal.quickedit.app = new Drupal.quickedit.AppView({
      el: bodyElement,
      model: new Drupal.quickedit.AppModel(),
      entitiesCollection: Drupal.quickedit.collections.entities,
      fieldsCollection: Drupal.quickedit.collections.fields
    });
  }

  /**
   * Fetch the field's metadata; queue or initialize it (if EntityModel exists).
   *
   * @param DOM fieldElement
   *   A Drupal Field API field's DOM element with a data-quickedit-field-id
   *   attribute.
   */
  function processField (fieldElement) {
    var metadata = Drupal.quickedit.metadata;
    var fieldID = fieldElement.getAttribute('data-quickedit-field-id');
    var entityID = extractEntityID(fieldID);
    // Figure out the instance ID by looking at the ancestor
    // [data-quickedit-entity-id] element's data-quickedit-entity-instance-id
    // attribute.
    var entityElementSelector = '[data-quickedit-entity-id="' + entityID + '"]';
    var entityElement = $(fieldElement).closest(entityElementSelector);
    // In the case of a full entity view page, the entity title is rendered
    // outside of "the entity DOM node": it's rendered as the page title. So in
    // this case, we must find the entity in the mandatory "content" region.
    if (entityElement.length === 0) {
      entityElement = $('[data-quickedit-content-region-start]')
        .nextUntil('[data-quickedit-content-region-end]')
        .find(entityElementSelector)
        .addBack(entityElementSelector);
    }
    var entityInstanceID = entityElement
      .get(0)
      .getAttribute('data-quickedit-entity-instance-id');

    // Early-return if metadata for this field is missing.
    if (!metadata.has(fieldID)) {
      fieldsMetadataQueue.push({
        el: fieldElement,
        fieldID: fieldID,
        entityID: entityID,
        entityInstanceID: entityInstanceID
      });
      return;
    }
    // Early-return if the user is not allowed to in-place edit this field.
    if (metadata.get(fieldID, 'access') !== true) {
      return;
    }

    // If an EntityModel for this field already exists (and hence also a "Quick
    // edit" contextual link), then initialize it immediately.
    if (Drupal.quickedit.collections.entities.findWhere({ entityID: entityID, entityInstanceID: entityInstanceID })) {
      initializeField(fieldElement, fieldID, entityID, entityInstanceID);
    }
    // Otherwise: queue the field. It is now available to be set up when its
    // corresponding entity becomes in-place editable.
    else {
      fieldsAvailableQueue.push({ el: fieldElement, fieldID: fieldID, entityID: entityID, entityInstanceID: entityInstanceID });
    }
  }

  /**
   * Initialize a field; create FieldModel.
   *
   * @param DOM fieldElement
   *   The field's DOM element.
   * @param String fieldID
   *   The field's ID.
   * @param String entityID
   *   The field's entity's ID.
   * @param String entityInstanceID
   *   The field's entity's instance ID.
   */
  function initializeField (fieldElement, fieldID, entityID, entityInstanceID) {
    var entity = Drupal.quickedit.collections.entities.findWhere({
      entityID: entityID,
      entityInstanceID: entityInstanceID
    });

    $(fieldElement).addClass('quickedit-field');

    // The FieldModel stores the state of an in-place editable entity field.
    var field = new Drupal.quickedit.FieldModel({
      el: fieldElement,
      fieldID: fieldID,
      id: fieldID + '[' + entity.get('entityInstanceID') + ']',
      entity: entity,
      metadata: Drupal.quickedit.metadata.get(fieldID),
      acceptStateChange: _.bind(Drupal.quickedit.app.acceptEditorStateChange, Drupal.quickedit.app)
    });

    // Track all fields on the page.
    Drupal.quickedit.collections.fields.add(field);
  }

  /**
   * Fetches metadata for fields whose metadata is missing.
   *
   * Fields whose metadata is missing are tracked at fieldsMetadataQueue.
   *
   * @param Function callback
   *   A callback function that receives field elements whose metadata will just
   *   have been fetched.
   */
  function fetchMissingMetadata (callback) {
    if (fieldsMetadataQueue.length) {
      var fieldIDs = _.pluck(fieldsMetadataQueue, 'fieldID');
      var fieldElementsWithoutMetadata = _.pluck(fieldsMetadataQueue, 'el');
      var entityIDs = _.uniq(_.pluck(fieldsMetadataQueue, 'entityID'), true);
      // Ensure we only request entityIDs for which we don't have metadata yet.
      entityIDs = _.difference(entityIDs, Drupal.quickedit.metadata.intersection(entityIDs));
      fieldsMetadataQueue = [];

      $.ajax({
        url: drupalSettings.quickedit.metadataURL,
        type: 'POST',
        data: {
          'fields[]': fieldIDs,
          'entities[]': entityIDs
        },
        dataType: 'json',
        success: function(results) {
          // Store the metadata.
          _.each(results, function (fieldMetadata, fieldID) {
            Drupal.quickedit.metadata.add(fieldID, fieldMetadata);
          });

          callback(fieldElementsWithoutMetadata);
        }
      });
    }
  }

  /**
   * Loads missing in-place editor's attachments (JavaScript and CSS files).
   *
   * Missing in-place editors are those whose fields are actively being used on
   * the page but don't have
   *
   * @param Function callback
   *   Callback function to be called when the missing in-place editors (if any)
   *   have been inserted into the DOM. i.e. they may still be loading.
   */
  function loadMissingEditors (callback) {
    var loadedEditors = _.keys(Drupal.quickedit.editors);
    var missingEditors = [];
    Drupal.quickedit.collections.fields.each(function (fieldModel) {
      var metadata = Drupal.quickedit.metadata.get(fieldModel.get('fieldID'));
      if (metadata.access && _.indexOf(loadedEditors, metadata.editor) === -1) {
        missingEditors.push(metadata.editor);
        // Set a stub, to prevent subsequent calls to loadMissingEditors() from
        // loading the same in-place editor again. Loading an in-place editor
        // requires talking to a server, to download its JavaScript, then
        // executing its JavaScript, and only then its Drupal.quickedit.editors
        // entry will be set.
        Drupal.quickedit.editors[metadata.editor] = false;
      }
    });
    missingEditors = _.uniq(missingEditors);
    if (missingEditors.length === 0) {
      callback();
      return;
    }

    // @todo Simplify this once https://drupal.org/node/1533366 lands.
    // @see https://drupal.org/node/2029999.
    var id = 'quickedit-load-editors';
    // Create a temporary element to be able to use Drupal.ajax.
    var $el = $('<div id="' + id + '" class="element-hidden"></div>').appendTo('body');
    // Create a Drupal.ajax instance to load the form.
    var loadEditorsAjax = new Drupal.ajax(id, $el, {
      url: drupalSettings.quickedit.attachmentsURL,
      event: 'quickedit-internal.quickedit',
      submit: { 'editors[]': missingEditors },
      // No progress indicator.
      progress: { type: null }
    });
    // Work-around for https://drupal.org/node/2019481 in Drupal 7.
    loadEditorsAjax.commands = {};
    // The above work-around prevents the prototype implementations from being
    // called, so we must alias any and all of the commands that might be called.
    loadEditorsAjax.commands.settings = Drupal.ajax.prototype.commands.settings;
    // Implement a scoped insert AJAX command: calls the callback after all AJAX
    // command functions have been executed (hence the deferred calling).
    var realInsert = Drupal.ajax.prototype.commands.insert;
    loadEditorsAjax.commands.insert = function (ajax, response, status) {
      _.defer(callback);
      realInsert(ajax, response, status);
      $el.off('quickedit-internal.quickedit');
      $el.remove();
    };
    // Trigger the AJAX request, which will should return AJAX commands to insert
    // any missing attachments.
    $el.trigger('quickedit-internal.quickedit');
  }

  /**
   * Attempts to set up a "Quick edit" link and corresponding EntityModel.
   *
   * @param Object contextualLink
   *   An object with the following properties:
   *     - String entityID: a Quick Edit entity identifier, e.g. "node/1" or
   *       "custom_block/5".
   *     - String entityInstanceID: a Quick Edit entity instance identifier,
   *       e.g. 0, 1 or n (depending on whether it's the first, second, or n+1st
   *       instance of this entity).
   *     - DOM el: element pointing to the contextual links placeholder for this
   *       entity.
   *     - DOM region: element pointing to the contextual region for this entity.
   * @return Boolean
   *   Returns true when a contextual the given contextual link metadata can be
   *   removed from the queue (either because the contextual link has been set up
   *   or because it is certain that in-place editing is not allowed for any of
   *   its fields).
   *   Returns false otherwise.
   */
  function initializeEntityContextualLink (contextualLink) {
    var metadata = Drupal.quickedit.metadata;
    // Check if the user has permission to edit at least one of them.
    function hasFieldWithPermission (fieldIDs) {
      for (var i = 0; i < fieldIDs.length; i++) {
        var fieldID = fieldIDs[i];
        if (metadata.get(fieldID, 'access') === true) {
          return true;
        }
      }
      return false;
    }

    // Checks if the metadata for all given field IDs exists.
    function allMetadataExists (fieldIDs) {
      return fieldIDs.length === metadata.intersection(fieldIDs).length;
    }

    // Find all fields for this entity instance and collect their field IDs.
    var fields = _.where(fieldsAvailableQueue, {
      entityID: contextualLink.entityID,
      entityInstanceID: contextualLink.entityInstanceID
    });
    var fieldIDs = _.pluck(fields, 'fieldID');

    // No fields found yet.
    if (fieldIDs.length === 0) {
      return false;
    }
    // The entity for the given contextual link contains at least one field that
    // the current user may edit in-place; instantiate EntityModel,
    // EntityDecorationView and ContextualLinkView.
    else if (hasFieldWithPermission(fieldIDs)) {
      var entityModel = new Drupal.quickedit.EntityModel({
        el: contextualLink.region,
        entityID: contextualLink.entityID,
        entityInstanceID: contextualLink.entityInstanceID,
        id: contextualLink.entityID + '[' + contextualLink.entityInstanceID + ']',
        label: Drupal.quickedit.metadata.get(contextualLink.entityID, 'label')
      });
      Drupal.quickedit.collections.entities.add(entityModel);
      // Create an EntityDecorationView associated with the root DOM node of the
      // entity.
      var entityDecorationView = new Drupal.quickedit.EntityDecorationView({
        el: contextualLink.region,
        model: entityModel
      });
      entityModel.set('entityDecorationView', entityDecorationView);

      // Initialize all queued fields within this entity (creates FieldModels).
      _.each(fields, function (field) {
        initializeField(field.el, field.fieldID, contextualLink.entityID, contextualLink.entityInstanceID);
      });
      fieldsAvailableQueue = _.difference(fieldsAvailableQueue, fields);

      // Initialization should only be called once. Use Underscore's once method
      // to get a one-time use version of the function.
      var initContextualLink = _.once(function () {
        var $links = $(contextualLink.el);
        var contextualLinkView = new Drupal.quickedit.ContextualLinkView($.extend({
          el: $('<li class="quick-quickedit"><a href="" role="button" aria-pressed="false"></a></li>').prependTo($links),
          model: entityModel,
          appModel: Drupal.quickedit.app.model
        }, options));
        entityModel.set('contextualLinkView', contextualLinkView);
      });

      // Set up ContextualLinkView after loading any missing in-place editors.
      loadMissingEditors(initContextualLink);

      return true;
    }
    // There was not at least one field that the current user may edit in-place,
    // even though the metadata for all fields within this entity is available.
    else if (allMetadataExists(fieldIDs)) {
      return true;
    }

    return false;
  }

  /**
   * Delete models and queue items that are contained within a given context.
   *
   * Deletes any contained EntityModels (plus their associated FieldModels and
   * ContextualLinkView) and FieldModels, as well as the corresponding queues.
   *
   * After EntityModels, FieldModels must also be deleted, because it is possible
   * in Drupal for a field DOM element to exist outside of the entity DOM element,
   * e.g. when viewing the full node, the title of the node is not rendered within
   * the node (the entity) but as the page title.
   *
   * Note: this will not delete an entity that is actively being in-place edited.
   *
   * @param jQuery $context
   *   The context within which to delete.
   */
  function deleteContainedModelsAndQueues($context) {
    $context.find('[data-quickedit-entity-id]').addBack('[data-quickedit-entity-id]').each(function (index, entityElement) {
      // Delete entity model.
      var entityModel = Drupal.quickedit.collections.entities.findWhere({el: entityElement});
      if (entityModel) {
        var contextualLinkView = entityModel.get('contextualLinkView');
        contextualLinkView.remove();
        // Remove the EntityDecorationView.
        entityModel.get('entityDecorationView').remove();
        // Destroy the EntityModel; this will also destroy its FieldModels.
        entityModel.destroy();
      }

      // Filter queue.
      function hasOtherRegion (contextualLink) {
        return contextualLink.region !== entityElement;
      }
      contextualLinksQueue = _.filter(contextualLinksQueue, hasOtherRegion);
    });

    $context.find('[data-quickedit-field-id]').addBack('[data-quickedit-field-id]').each(function (index, fieldElement) {
      // Delete field models.
      Drupal.quickedit.collections.fields.chain()
        .filter(function (fieldModel) { return fieldModel.get('el') === fieldElement; })
        .invoke('destroy');

      // Filter queues.
      function hasOtherFieldElement (field) {
        return field.el !== fieldElement;
      }
      fieldsMetadataQueue = _.filter(fieldsMetadataQueue, hasOtherFieldElement);
      fieldsAvailableQueue = _.filter(fieldsAvailableQueue, hasOtherFieldElement);
    });
  }

})(jQuery, _, Backbone, Drupal, Drupal.settings, window.JSON, window.sessionStorage);
;
/**
 * @file
 * Provides utility functions for Quick Edit.
 */

(function ($, Drupal, drupalSettings) {

  "use strict";

  Drupal.quickedit.util = Drupal.quickedit.util || {};

  Drupal.quickedit.util.constants = {};
  Drupal.quickedit.util.constants.transitionEnd = "transitionEnd.quickedit webkitTransitionEnd.quickedit transitionend.quickedit msTransitionEnd.quickedit oTransitionEnd.quickedit";

  /**
   * Converts a field id into a formatted url path.
   *
   * @param String id
   *   The id of an editable field. For example, 'node/1/body/und/full'.
   * @param String urlFormat
   *   The Controller route for field processing. For example,
   *   '/quickedit/form/%21entity_type/%21id/%21field_name/%21langcode/%21view_mode'.
   */
  Drupal.quickedit.util.buildUrl = function (id, urlFormat) {
    var parts = id.split('/');
    return Drupal.formatString(decodeURIComponent(urlFormat), {
      '!entity_type': parts[0],
      '!id'         : parts[1],
      '!field_name' : parts[2],
      '!langcode'   : parts[3],
      '!view_mode'  : parts[4]
    });
  };

  /**
   * Shows a network error modal dialog.
   *
   * @param String title
   *   The title to use in the modal dialog.
   * @param String message
   *   The message to use in the modal dialog.
   */
  Drupal.quickedit.util.networkErrorModal = function (title, message) {
    var networkErrorModal = new Drupal.quickedit.ModalView({
      title: title,
      dialogClass: 'quickedit-network-error',
      message: message,
      buttons: [
        {
          action: 'ok',
          type: 'submit',
          classes: 'action-save quickedit-button',
          label: Drupal.t('OK')
        }
      ],
      callback: function () { return; }
    });
    networkErrorModal.render();
  };

  Drupal.quickedit.util.form = {

    /**
     * Loads a form, calls a callback to insert.
     *
     * Leverages Drupal.ajax' ability to have scoped (per-instance) command
     * implementations to be able to call a callback.
     *
     * @param Object options
     *   An object with the following keys:
     *    - jQuery $el: (required) DOM element necessary for Drupal.ajax to
     *      perform AJAX commands.
     *    - String fieldID: (required) the field ID that uniquely identifies the
     *      field for which this form will be loaded.
     *    - Boolean nocssjs: (required) boolean indicating whether no CSS and JS
     *      should be returned (necessary when the form is invisible to the user).
     *    - Boolean reset: (required) boolean indicating whether the data stored
     *      for this field's entity in TempStore should be used or reset.
     * @param Function callback
     *   A callback function that will receive the form to be inserted, as well as
     *   the ajax object, necessary if the callback wants to perform other AJAX
     *   commands.
     */
    load: function (options, callback) {
      var $el = options.$el;
      var fieldID = options.fieldID;

      // Create a Drupal.ajax instance to load the form.
      var formLoaderAjax = new Drupal.ajax(fieldID, $el, {
        url: Drupal.quickedit.util.buildUrl(fieldID, drupalSettings.quickedit.fieldFormURL),
        event: 'quickedit-internal.quickedit',
        submit: {
          nocssjs : options.nocssjs,
          reset : options.reset
        },
        progress: { type : null }, // No progress indicator.
        error: function (xhr, url) {
          $el.off('quickedit-internal.quickedit');

          // Show a modal to inform the user of the network error.
          var fieldLabel = Drupal.quickedit.metadata.get(fieldID, 'label');
          var message = Drupal.t('Could not load the form for <q>@field-label</q>, either due to a website problem or a network connection problem.<br>Please try again.', { '@field-label' : fieldLabel });
          Drupal.quickedit.util.networkErrorModal(Drupal.t('Sorry!'), message);

          // Change the state back to "candidate", to allow the user to start
          // in-place editing of the field again.
          var fieldModel = Drupal.quickedit.app.model.get('activeField');
          fieldModel.set('state', 'candidate');
        }
      });
      // Work-around for https://drupal.org/node/2019481 in Drupal 7.
      formLoaderAjax.commands = {};
      // The above work-around prevents the prototype implementations from being
      // called, so we must alias any and all of the commands that might be called.
      formLoaderAjax.commands.settings = Drupal.ajax.prototype.commands.settings;
      formLoaderAjax.commands.insert = Drupal.ajax.prototype.commands.insert;
      // Implement a scoped quickeditFieldForm AJAX command: calls the callback.
      formLoaderAjax.commands.quickeditFieldForm = function (ajax, response, status) {
        callback(response.data, ajax);
        $el.off('quickedit-internal.quickedit');
        formLoaderAjax = null;
      };
      // This will ensure our scoped quickeditFieldForm AJAX command gets called.
      $el.trigger('quickedit-internal.quickedit');
    },

    /**
     * Creates a Drupal.ajax instance that is used to save a form.
     *
     * @param Object options
     *   An object with the following keys:
     *    - nocssjs: (required) boolean indicating whether no CSS and JS should be
     *      returned (necessary when the form is invisible to the user).
     *    - other_view_modes: (required) array containing view mode IDs (of other
     *      instances of this field on the page).
     * @return Drupal.ajax
     *   A Drupal.ajax instance.
     */
    ajaxifySaving: function (options, $submit) {
      // Re-wire the form to handle submit.
      var settings = {
        url: $submit.closest('form').attr('action'),
        setClick: true,
        event: 'click.quickedit',
        progress: { type: null },
        submit: {
          nocssjs : options.nocssjs,
          other_view_modes : options.other_view_modes
        },
        // Reimplement the success handler to ensure Drupal.attachBehaviors() does
        // not get called on the form.
        success: function (response, status) {
          for (var i in response) {
            if (response.hasOwnProperty(i) && response[i].command && this.commands[response[i].command]) {
              this.commands[response[i].command](this, response[i], status);
            }
          }
        }
      };

      return new Drupal.ajax($submit.attr('id'), $submit[0], settings);
    },

    /**
     * Cleans up the Drupal.ajax instance that is used to save the form.
     *
     * @param Drupal.ajax ajax
     *   A Drupal.ajax that was returned by Drupal.quickedit.form.ajaxifySaving().
     */
    unajaxifySaving: function (ajax) {
      $(ajax.element).off('click.quickedit');
    }

  };

  /**
   * Limits the invocations of a function in a given time frame.
   *
   * Adapted from underscore.js with the addition Drupal namespace.
   *
   * The debounce function wrapper should be used sparingly. One clear use case
   * is limiting the invocation of a callback attached to the window resize event.
   *
   * Before using the debounce function wrapper, consider first whether the
   * callback could be attache to an event that fires less frequently or if the
   * function can be written in such a way that it is only invoked under specific
   * conditions.
   *
   * @param {Function} callback
   *   The function to be invoked.
   *
   * @param {Number} wait
   *   The time period within which the callback function should only be
   *   invoked once. For example if the wait period is 250ms, then the callback
   *   will only be called at most 4 times per second.
   *
   * @see Drupal 8's core/misc/debounce.js.
   */
  Drupal.quickedit.util.debounce = function (func, wait, immediate) {
    var timeout, result;
    return function () {
      var context = this;
      var args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
      }
      return result;
    };
  };

})(jQuery, Drupal, Drupal.settings);
;
/**
 * @file
 * A Backbone Model subclass that enforces validation when calling set().
 */

(function (Backbone) {

  "use strict";

  Drupal.quickedit.BaseModel = Backbone.Model.extend({

    /**
     * {@inheritdoc}
     */
    initialize: function (options) {
      this.__initialized = true;
      return Backbone.Model.prototype.initialize.call(this, options);
    },

    /**
     * {@inheritdoc}
     */
    set: function (key, val, options) {
      if (this.__initialized) {
        // Deal with both the "key", value and {key:value}-style arguments.
        if (typeof key === 'object') {
          key.validate = true;
        }
        else {
          if (!options) {
            options = {};
          }
          options.validate = true;
        }
      }
      return Backbone.Model.prototype.set.call(this, key, val, options);
    }

  });

}(Backbone));
;
/**
 * @file
 * A Backbone Model for the state of the in-place editing application.
 *
 * @see Drupal.quickedit.AppView
 */

(function (Backbone, Drupal) {

  "use strict";

  Drupal.quickedit.AppModel = Backbone.Model.extend({

    defaults: {
      // The currently state = 'highlighted' Drupal.quickedit.FieldModel, if any.
      // @see Drupal.quickedit.FieldModel.states
      highlightedField: null,
      // The currently state = 'active' Drupal.quickedit.FieldModel, if any.
      // @see Drupal.quickedit.FieldModel.states
      activeField: null,
      // Reference to a Drupal.quickedit.ModalView instance if a state change
      // requires confirmation.
      activeModal: null
    }

  });

}(Backbone, Drupal));
;
(function (_, $, Backbone, Drupal, drupalSettings) {

  "use strict";

  /**
   * State of an in-place editable entity in the DOM.
   */
  Drupal.quickedit.EntityModel = Drupal.quickedit.BaseModel.extend({

    defaults: {
      // The DOM element that represents this entity. It may seem bizarre to
      // have a DOM element in a Backbone Model, but we need to be able to map
      // entities in the DOM to EntityModels in memory.
      el: null,
      // An entity ID, of the form "<entity type>/<entity ID>", e.g. "node/1".
      entityID: null,
      // An entity instance ID. The first intance of a specific entity (i.e. with
      // a given entity ID) is assigned 0, the second 1, and so on.
      entityInstanceID: null,
      // The unique ID of this entity instance on the page, of the form "<entity
      // type>/<entity ID>[entity instance ID]", e.g. "node/1[0]".
      id: null,
      // The label of the entity.
      label: null,
      // A Drupal.quickedit.FieldCollection for all fields of this entity.
      fields: null,

      // The attributes below are stateful. The ones above will never change
      // during the life of a EntityModel instance.

      // Indicates whether this instance of this entity is currently being
      // edited in-place.
      isActive: false,
      // Whether one or more fields have already been stored in TempStore.
      inTempStore: false,
      // Whether one or more fields have already been stored in TempStore *or*
      // the field that's currently being edited is in the 'changed' or a later
      // state. In other words, this boolean indicates whether a "Save" button is
      // necessary or not.
      isDirty: false,
      // Whether the request to the server has been made to commit this entity.
      // Used to prevent multiple such requests.
      isCommitting: false,
      // The current processing state of an entity.
      state: 'closed',
      // The IDs of the fields whose new values have been stored in TempStore. We
      // must store this on the EntityModel as well (even though it already is on
      // the FieldModel) because when a field is rerendered, its FieldModel is
      // destroyed and this allows us to transition it back to the proper state.
      fieldsInTempStore: [],
      // A flag the tells the application that this EntityModel must be reloaded
      // in order to restore the original values to its fields in the client.
      reload: false
    },

    /**
     * {@inheritdoc}
     */
    initialize: function () {
      this.set('fields', new Drupal.quickedit.FieldCollection());

      // Respond to entity state changes.
      this.listenTo(this, 'change:state', this.stateChange);

      // The state of the entity is largely dependent on the state of its
      // fields.
      this.listenTo(this.get('fields'), 'change:state', this.fieldStateChange);

      // Call Drupal.quickedit.BaseModel's initialize() method.
      Drupal.quickedit.BaseModel.prototype.initialize.call(this);
    },

    /**
     * Updates FieldModels' states when an EntityModel change occurs.
     *
     * @param Drupal.quickedit.EntityModel entityModel
     * @param String state
     *   The state of the associated entity. One of Drupal.quickedit.EntityModel.states.
     * @param Object options
     */
    stateChange: function (entityModel, state, options) {
      var to = state;
      switch (to) {
        case 'closed':
          this.set({
            'isActive': false,
            'inTempStore': false,
            'isDirty': false
          });
          break;

        case 'launching':
          break;

        case 'opening':
          // Set the fields to candidate state.
          entityModel.get('fields').each(function (fieldModel) {
            fieldModel.set('state', 'candidate', options);
          });
          break;

        case 'opened':
          // The entity is now ready for editing!
          this.set('isActive', true);
          break;

        case 'committing':
          // The user indicated they want to save the entity.
          var fields = this.get('fields');
          // For fields that are in an active state, transition them to candidate.
          fields.chain()
            .filter(function (fieldModel) {
              return _.intersection([fieldModel.get('state')], ['active']).length;
            })
            .each(function (fieldModel) {
              fieldModel.set('state', 'candidate');
            });
          // For fields that are in a changed state, field values must first be
          // stored in TempStore.
          fields.chain()
            .filter(function (fieldModel) {
              return _.intersection([fieldModel.get('state')], Drupal.quickedit.app.changedFieldStates).length;
            })
            .each(function (fieldModel) {
              fieldModel.set('state', 'saving');
            });
          break;

        case 'deactivating':
          var changedFields = this.get('fields')
            .filter(function (fieldModel) {
              return _.intersection([fieldModel.get('state')], ['changed', 'invalid']).length;
            });
          // If the entity contains unconfirmed or unsaved changes, return the
          // entity to an opened state and ask the user if they would like to save
          // the changes or discard the changes.
          //   1. One of the fields is in a changed state. The changed field might
          //   just be a change in the client or it might have been saved to
          //   tempstore.
          //   2. The saved flag is empty and the confirmed flag is empty. If the
          //   entity has been saved to the server, the fields changed in the
          //   client are irrelevant. If the changes are confirmed, then proceed
          //   to set the fields to candidate state.
          if ((changedFields.length || this.get('fieldsInTempStore').length) && (!options.saved && !options.confirmed)) {
            // Cancel deactivation until the user confirms save or discard.
            this.set('state', 'opened', {confirming: true});
            // An action in reaction to state change must be deferred.
            _.defer(function () {
              Drupal.quickedit.app.confirmEntityDeactivation(entityModel);
            });
          }
          else {
            var invalidFields = this.get('fields')
            .filter(function (fieldModel) {
              return _.intersection([fieldModel.get('state')], ['invalid']).length;
            });
            // Indicate if this EntityModel needs to be reloaded in order to
            // restore the original values of its fields.
            entityModel.set('reload', (this.get('fieldsInTempStore').length || invalidFields.length));
            // Set all fields to the 'candidate' state. A changed field may have to
            // go through confirmation first.
            entityModel.get('fields').each(function (fieldModel) {
              // If the field is already in the candidate state, trigger a change
              // event so that the entityModel can move to the next state in
              // deactivation.
              if (_.intersection([fieldModel.get('state')], ['candidate', 'highlighted']).length) {
                fieldModel.trigger('change:state', fieldModel, fieldModel.get('state'), options);
              }
              else {
                fieldModel.set('state', 'candidate', options);
              }
            });
          }
          break;

        case 'closing':
          // Set all fields to the 'inactive' state.
          options.reason = 'stop';
          this.get('fields').each(function (fieldModel) {
            fieldModel.set({
              'inTempStore': false,
              'state': 'inactive'
            }, options);
          });
          break;
      }
    },

    /**
     * Updates a Field and Entity model's "inTempStore" when appropriate.
     *
     * Helper function.
     *
     * @param Drupal.quickedit.EntityModel entityModel
     *   The model of the entity for which a field's state attribute has changed.
     * @param Drupal.quickedit.FieldModel fieldModel
     *   The model of the field whose state attribute has changed.
     *
     * @see fieldStateChange()
     */
    _updateInTempStoreAttributes: function (entityModel, fieldModel) {
      var current = fieldModel.get('state');
      var previous = fieldModel.previous('state');
      var fieldsInTempStore = entityModel.get('fieldsInTempStore');
      // If the fieldModel changed to the 'saved' state: remember that this
      // field was saved to TempStore.
      if (current === 'saved') {
        // Mark the entity as saved in TempStore, so that we can pass the
        // proper "reset TempStore" boolean value when communicating with the
        // server.
        entityModel.set('inTempStore', true);
        // Mark the field as saved in TempStore, so that visual indicators
        // signifying just that may be rendered.
        fieldModel.set('inTempStore', true);
        // Remember that this field is in TempStore, restore when rerendered.
        fieldsInTempStore.push(fieldModel.get('fieldID'));
        fieldsInTempStore = _.uniq(fieldsInTempStore);
        entityModel.set('fieldsInTempStore', fieldsInTempStore);
      }
      // If the fieldModel changed to the 'candidate' state from the
      // 'inactive' state, then this is a field for this entity that got
      // rerendered. Restore its previous 'inTempStore' attribute value.
      else if (current === 'candidate' && previous === 'inactive') {
        fieldModel.set('inTempStore', _.intersection([fieldModel.get('fieldID')], fieldsInTempStore).length > 0);
      }
    },

    /**
     * Reacts to state changes in this entity's fields.
     *
     * @param Drupal.quickedit.FieldModel fieldModel
     *   The model of the field whose state attribute changed.
     * @param String state
     *   The state of the associated field. One of Drupal.quickedit.FieldModel.states.
     */
    fieldStateChange: function (fieldModel, state) {
      var entityModel = this;
      var fieldState = state;
      // Switch on the entityModel state.
      // The EntityModel responds to FieldModel state changes as a function of its
      // state. For example, a field switching back to 'candidate' state when its
      // entity is in the 'opened' state has no effect on the entity. But that
      // same switch back to 'candidate' state of a field when the entity is in
      // the 'committing' state might allow the entity to proceed with the commit
      // flow.
      switch (this.get('state')) {
        case 'closed':
        case 'launching':
          // It should be impossible to reach these: fields can't change state
          // while the entity is closed or still launching.
          break;

        case 'opening':
          // We must change the entity to the 'opened' state, but it must first be
          // confirmed that all of its fieldModels have transitioned to the
          // 'candidate' state.
          // We do this here, because this is called every time a fieldModel
          // changes state, hence each time this is called, we get closer to the
          // goal of having all fieldModels in the 'candidate' state.
          // A state change in reaction to another state change must be deferred.
          _.defer(function () {
            entityModel.set('state', 'opened', {
              'accept-field-states': Drupal.quickedit.app.readyFieldStates
            });
          });
          break;

        case 'opened':
          // Set the isDirty attribute when appropriate so that it is known when
          // to display the "Save" button in the entity toolbar.
          // Note that once a field has been changed, there's no way to discard
          // that change, hence it will have to be saved into TempStore, or the
          // in-place editing of this field will have to be stopped completely.
          // In other words: once any field enters the 'changed' field, then for
          // the remainder of the in-place editing session, the entity is by
          // definition dirty.
          if (fieldState === 'changed') {
            entityModel.set('isDirty', true);
          }
          else {
            this._updateInTempStoreAttributes(entityModel, fieldModel);
          }
          break;

        case 'committing':
          // If the field save returned a validation error, set the state of the
          // entity back to 'opened'.
          if (fieldState === 'invalid') {
            // A state change in reaction to another state change must be deferred.
            _.defer(function() {
              entityModel.set('state', 'opened', { reason: 'invalid' });
            });
          }
          else {
            this._updateInTempStoreAttributes(entityModel, fieldModel);
          }

          // Attempt to save the entity. If the entity's fields are not yet all in
          // a ready state, the save will not be processed.
          var options = {
            'accept-field-states': Drupal.quickedit.app.readyFieldStates
          };
          if (entityModel.set('isCommitting', true, options)) {
            entityModel.save({
              success: function () {
                entityModel.set({
                  'state': 'deactivating',
                  'isCommitting' : false
                }, {'saved': true});
              },
              error: function () {
                // Reset the "isCommitting" mutex.
                entityModel.set('isCommitting', false);
                // Change the state back to "opened", to allow the user to hit the
                // "Save" button again.
                entityModel.set('state', 'opened', { reason: 'networkerror' });
                // Show a modal to inform the user of the network error.
                var message = Drupal.t('Your changes to <q>@entity-title</q> could not be saved, either due to a website problem or a network connection problem.<br>Please try again.', { '@entity-title' : entityModel.get('label') });
                Drupal.quickedit.util.networkErrorModal(Drupal.t('Sorry!'), message);
              }
            });
          }
          break;

        case 'deactivating':
          // When setting the entity to 'closing', require that all fieldModels
          // are in either the 'candidate' or 'highlighted' state.
          // A state change in reaction to another state change must be deferred.
          _.defer(function() {
            entityModel.set('state', 'closing', {
              'accept-field-states': Drupal.quickedit.app.readyFieldStates
            });
          });
          break;

        case 'closing':
          // When setting the entity to 'closed', require that all fieldModels are
          // in the 'inactive' state.
          // A state change in reaction to another state change must be deferred.
          _.defer(function() {
            entityModel.set('state', 'closed', {
              'accept-field-states': ['inactive']
            });
          });
          break;
      }
    },

    /**
     * Fires an AJAX request to the REST save URL for an entity.
     *
     * @param options
     *   An object of options that contains:
     *     - success: (optional) A function to invoke if the entity is success-
     *     fully saved.
     */
    save: function (options) {
      var entityModel = this;

      // @todo Simplify this once https://drupal.org/node/1533366 lands.
      // @see https://drupal.org/node/2029999.
      var id = 'quickedit-save-entity';
      // Create a temporary element to be able to use Drupal.ajax.
      var $el = $('#quickedit-entity-toolbar').find('.action-save'); // This is the span element inside the button.
      // Create a Drupal.ajax instance to save the entity.
      var entitySaverAjax = new Drupal.ajax(id, $el, {
        url: Drupal.quickedit.util.buildUrl(entityModel.get('entityID'), drupalSettings.quickedit.entitySaveURL),
        event: 'quickedit-save.quickedit',
        progress: { type: 'none' },
        error: function () {
          $el.off('quickedit-save.quickedit');
          // Let the Drupal.quickedit.EntityModel Backbone model's error() method
          // handle errors.
          options.error.call(entityModel);
        }
      });
      // Work-around for https://drupal.org/node/2019481 in Drupal 7.
      entitySaverAjax.commands = {};
      // Entity saved successfully.
      entitySaverAjax.commands.quickeditEntitySaved = function(ajax, response, status) {
        // Clean up.
        $(ajax.element).off('quickedit-save.quickedit');
        // All fields have been moved from TempStore to permanent storage, update
        // the "inTempStore" attribute on FieldModels, on the EntityModel and
        // clear EntityModel's "fieldInTempStore" attribute.
        entityModel.get('fields').each(function (fieldModel) {
          fieldModel.set('inTempStore', false);
        });
        entityModel.set('inTempStore', false);
        entityModel.set('fieldsInTempStore', []);

        // Invoke the optional success callback.
        if (options.success) {
          options.success.call(entityModel);
        }
      };
      // Trigger the AJAX request, which will will return the quickeditEntitySaved AJAX
      // command to which we then react.
      $el.trigger('quickedit-save.quickedit');
    },

    /**
     * {@inheritdoc}
     *
     * @param Object attrs
     *   The attributes changes in the save or set call.
     * @param Object options
     *   An object with the following option:
     *     - String reason (optional): a string that conveys a particular reason
     *       to allow for an exceptional state change.
     *     - Array accept-field-states (optional) An array of strings that
     *     represent field states that the entities must be in to validate. For
     *     example, if accept-field-states is ['candidate', 'highlighted'], then
     *     all the fields of the entity must be in either of these two states
     *     for the save or set call to validate and proceed.
     */
    validate: function (attrs, options) {
      var acceptedFieldStates = options['accept-field-states'] || [];

      // Validate state change.
      var currentState = this.get('state');
      var nextState = attrs.state;
      if (currentState !== nextState) {
        // Ensure it's a valid state.
        if (_.indexOf(this.constructor.states, nextState) === -1) {
          return '"' + nextState + '" is an invalid state';
        }

        // Ensure it's a state change that is allowed.
        // Check if the acceptStateChange function accepts it.
        if (!this._acceptStateChange(currentState, nextState, options)) {
          return 'state change not accepted';
        }
        // If that function accepts it, then ensure all fields are also in an
        // acceptable state.
        else if (!this._fieldsHaveAcceptableStates(acceptedFieldStates)) {
          return 'state change not accepted because fields are not in acceptable state';
        }
      }

      // Validate setting isCommitting = true.
      var currentIsCommitting = this.get('isCommitting');
      var nextIsCommitting = attrs.isCommitting;
      if (currentIsCommitting === false && nextIsCommitting === true) {
        if (!this._fieldsHaveAcceptableStates(acceptedFieldStates)) {
          return 'isCommitting change not accepted because fields are not in acceptable state';
        }
      }
      else if (currentIsCommitting === true && nextIsCommitting === true) {
        return "isCommiting is a mutex, hence only changes are allowed";
      }
    },

    // Like @see AppView.acceptEditorStateChange()
    _acceptStateChange: function (from, to, context) {
      var accept = true;

      // In general, enforce the states sequence. Disallow going back from a
      // "later" state to an "earlier" state, except in explicitly allowed
      // cases.
      if (!this.constructor.followsStateSequence(from, to)) {
        accept = false;

        // Allow: closing -> closed.
        // Necessary to stop editing an entity.
        if (from === 'closing' && to === 'closed') {
          accept = true;
        }
        // Allow: committing -> opened.
        // Necessary to be able to correct an invalid field, or to hit the "Save"
        // button again after a server/network error.
        else if (from === 'committing' && to === 'opened' && context.reason && (context.reason === 'invalid' || context.reason === 'networkerror')) {
          accept = true;
        }
        // Allow: deactivating -> opened.
        // Necessary to be able to confirm changes with the user.
        else if (from === 'deactivating' && to === 'opened' && context.confirming) {
          accept = true;
        }
        // Allow: opened -> deactivating.
        // Necessary to be able to stop editing.
        else if (from === 'opened' && to === 'deactivating' && context.confirmed) {
          accept = true;
        }
      }

      return accept;
    },

    /**
     * @param Array acceptedFieldStates
     *   @see validate()
     * @return Boolean
     */
    _fieldsHaveAcceptableStates: function (acceptedFieldStates) {
      var accept = true;

      // If no acceptable field states are provided, assume all field states are
      // acceptable. We want to let validation pass as a default and only
      // check validity on calls to set that explicitly request it.
      if (acceptedFieldStates.length > 0) {
        var fieldStates = this.get('fields').pluck('state') || [];
        // If not all fields are in one of the accepted field states, then we
        // still can't allow this state change.
        if (_.difference(fieldStates, acceptedFieldStates).length) {
          accept = false;
        }
      }

      return accept;
    },

    /**
     * {@inheritdoc}
     */
    destroy: function (options) {
      Drupal.quickedit.BaseModel.prototype.destroy.call(this, options);

      this.stopListening();

      // Destroy all fields of this entity.
      this.get('fields').reset();
    },

    /**
     * {@inheritdoc}
     */
    sync: function () {
      // We don't use REST updates to sync.
      return;
    }

  }, {

    /**
     * A list (sequence) of all possible states an entity can be in during
     * in-place editing.
     */
    states: [
      // Initial state, like field's 'inactive' OR the user has just finished
      // in-place editing this entity.
      // - Trigger: none (initial) or EntityModel (finished).
      // - Expected behavior: (when not initial state): tear down
      //   EntityToolbarView, in-place editors and related views.
      'closed',
      // User has activated in-place editing of this entity.
      // - Trigger: user.
      // - Expected behavior: the EntityToolbarView is gets set up, in-place
      //   editors (EditorViews) and related views for this entity's fields are
      //   set up. Upon completion of those, the state is changed to 'opening'.
      'launching',
      // Launching has finished.
      // - Trigger: application.
      // - Guarantees: in-place editors ready for use, all entity and field views
      //   have been set up, all fields are in the 'inactive' state.
      // - Expected behavior: all fields are changed to the 'candidate' state and
      //   once this is completed, the entity state will be changed to 'opened'.
      'opening',
      // Opening has finished.
      // - Trigger: EntityModel.
      // - Guarantees: see 'opening', all fields are in the 'candidate' state.
      // - Expected behavior: the user is able to actually use in-place editing.
      'opened',
      // User has clicked the 'Save' button (and has thus changed at least one
      // field).
      // - Trigger: user.
      // - Guarantees: see 'opened', plus: either a changed field is in TempStore,
      //   or the user has just modified a field without activating (switching to)
      //   another field.
      // - Expected behavior: 1) if any of the fields are not yet in TempStore,
      //   save them to TempStore, 2) if then any of the fields has the 'invalid'
      //   state, then change the entity state back to 'opened', otherwise: save
      //   the entity by committing it from TempStore into permanent storage.
      'committing',
      // User has clicked the 'Close' button, or has clicked the 'Save' button and
      // that was successfully completed.
      // - Trigger: user or EntityModel.
      // - Guarantees: when having clicked 'Close' hardly any: fields may be in a
      //   variety of states; when having clicked 'Save': all fields are in the
      //   'candidate' state.
      // - Expected behavior: transition all fields to the 'candidate' state,
      //   possibly requiring confirmation in the case of having clicked 'Close'.
      'deactivating',
      // Deactivation has been completed.
      // - Trigger: EntityModel.
      // - Guarantees: all fields are in the 'candidate' state.
      // - Expected behavior: change all fields to the 'inactive' state.
      'closing'
    ],

    /**
     * Indicates whether the 'from' state comes before the 'to' state.
     *
     * @param String from
     *   One of Drupal.quickedit.EntityModel.states.
     * @param String to
     *   One of Drupal.quickedit.EntityModel.states.
     * @return Boolean
     */
    followsStateSequence: function (from, to) {
      return _.indexOf(this.states, from) < _.indexOf(this.states, to);
    }

  });

  Drupal.quickedit.EntityCollection = Backbone.Collection.extend({
    model: Drupal.quickedit.EntityModel
  });

}(_, jQuery, Backbone, Drupal, Drupal.settings));
;
/**
 * @file
 * A Backbone Model for the state of an in-place editable field in the DOM.
 */

(function (_, Backbone, Drupal) {

  "use strict";

  /**
   * State of an in-place editable field in the DOM.
   */
  Drupal.quickedit.FieldModel = Drupal.quickedit.BaseModel.extend({

    defaults: {
      // The DOM element that represents this field. It may seem bizarre to have
      // a DOM element in a Backbone Model, but we need to be able to map fields
      // in the DOM to FieldModels in memory.
      el: null,
      // A field ID, of the form
      // "<entity type>/<id>/<field name>/<language>/<view mode>", e.g.
      // "node/1/field_tags/und/full".
      fieldID: null,
      // The unique ID of this field within its entity instance on the page, of
      // the form "<entity type>/<id>/<field name>/<language>/<view mode>[entity instance ID]",
      // e.g. "node/1/field_tags/und/full[0]".
      id: null,
      // A Drupal.quickedit.EntityModel. Its "fields" attribute, which is a
      // FieldCollection, is automatically updated to include this FieldModel.
      entity: null,
      // This field's metadata as returned by the QuickEditController::metadata().
      metadata: null,
      // Callback function for validating changes between states. Receives the
      // previous state, new state, context, and a callback
      acceptStateChange: null,
      // A logical field ID, of the form
      // "<entity type>/<id>/<field name>/<language>", i.e. the fieldID without
      // the view mode, to be able to identify other instances of the same field
      // on the page but rendered in a different view mode. e.g. "node/1/field_tags/und".
      logicalFieldID: null,

      // The attributes below are stateful. The ones above will never change
      // during the life of a FieldModel instance.

      // In-place editing state of this field. Defaults to the initial state.
      // Possible values: @see Drupal.quickedit.FieldModel.states.
      state: 'inactive',
      // The field is currently in the 'changed' state or one of the following
      // states in which the field is still changed.
      isChanged: false,
      // Is tracked by the EntityModel, is mirrored here solely for decorative
      // purposes: so that FieldDecorationView.renderChanged() can react to it.
      inTempStore: false,
      // The full HTML representation of this field (with the element that has
      // the data-quickedit-field-id as the outer element). Used to propagate
      // changes from this field instance to other instances of the same field.
      html: null,
      // An object containing the full HTML representations (values) of other view
      // modes (keys) of this field, for other instances of this field displayed
      // in a different view mode.
      htmlForOtherViewModes: null
    },

    /**
     * {@inheritdoc}
     */
    initialize: function (options) {
      // Store the original full HTML representation of this field.
      this.set('html', options.el.outerHTML);

      // Enlist field automatically in the associated entity's field collection.
      this.get('entity').get('fields').add(this);

      // Automatically generate the logical field ID.
      this.set('logicalFieldID', this.get('fieldID').split('/').slice(0, 4).join('/'));

      // Call Drupal.quickedit.BaseModel's initialize() method.
      Drupal.quickedit.BaseModel.prototype.initialize.call(this, options);
    },

    /**
     * {@inheritdoc}
     */
    destroy: function (options) {
      if (this.get('state') !== 'inactive') {
        throw new Error("FieldModel cannot be destroyed if it is not inactive state.");
      }
      Drupal.quickedit.BaseModel.prototype.destroy.call(this, options);
    },

    /**
     * {@inheritdoc}
     */
    sync: function () {
      // We don't use REST updates to sync.
      return;
    },

    /**
     * {@inheritdoc}
     */
    validate: function (attrs, options) {
      var current = this.get('state');
      var next = attrs.state;
      if (current !== next) {
        // Ensure it's a valid state.
        if (_.indexOf(this.constructor.states, next) === -1) {
          return '"' + next + '" is an invalid state';
        }
        // Check if the acceptStateChange callback accepts it.
        if (!this.get('acceptStateChange')(current, next, options, this)) {
          return 'state change not accepted';
        }
      }
    },

    /**
     * Extracts the entity ID from this field's ID.
     *
     * @return String
     *   An entity ID: a string of the format `<entity type>/<id>`.
     */
    getEntityID: function () {
      return this.get('fieldID').split('/').slice(0, 2).join('/');
    },

    /**
     * Extracts the view mode ID from this field's ID.
     *
     * @return String
     *   A view mode ID.
     */
    getViewMode: function () {
      return this.get('fieldID').split('/').pop();
    },

    /**
     * Find other instances of this field with different view modes.
     *
     * @return Array
     *   An array containing view mode IDs.
     */
    findOtherViewModes: function () {
      var currentField = this;
      var otherViewModes = [];
      Drupal.quickedit.collections.fields
        // Find all instances of fields that display the same logical field (same
        // entity, same field, just a different instance and maybe a different
        // view mode).
        .where({ logicalFieldID: currentField.get('logicalFieldID') })
        .forEach(function (field) {
          // Ignore the current field.
          if (field === currentField) {
            return;
          }
          // Also ignore other fields with the same view mode.
          else if (field.get('fieldID') === currentField.get('fieldID')) {
            return;
          }
          else {
            otherViewModes.push(field.getViewMode());
          }
        });
      return otherViewModes;
    }

  }, {

    /**
     * A list (sequence) of all possible states a field can be in during in-place
     * editing.
     */
    states: [
      // The field associated with this FieldModel is linked to an EntityModel;
      // the user can choose to start in-place editing that entity (and
      // consequently this field). No in-place editor (EditorView) is associated
      // with this field, because this field is not being in-place edited.
      // This is both the initial (not yet in-place editing) and the end state (
      // finished in-place editing).
      'inactive',
      // The user is in-place editing this entity, and this field is a candidate
      // for in-place editing. In-place editor should not
      // - Trigger: user.
      // - Guarantees: entity is ready, in-place editor (EditorView) is associated
      //   with the field.
      // - Expected behavior: visual indicators around the field indicate it is
      //   available for in-place editing, no in-place editor presented yet.
      'candidate',
      // User is highlighting this field.
      // - Trigger: user.
      // - Guarantees: see 'candidate'.
      // - Expected behavior: visual indicators to convey highlighting, in-place
      //   editing toolbar shows field's label.
      'highlighted',
      // User has activated the in-place editing of this field; in-place editor is
      // activating.
      // - Trigger: user.
      // - Guarantees: see 'candidate'.
      // - Expected behavior: loading indicator, in-place editor is loading remote
      //   data (e.g. retrieve form from back-end). Upon retrieval of remote data,
      //   the in-place editor transitions the field's state to 'active'.
      'activating',
      // In-place editor has finished loading remote data; ready for use.
      // - Trigger: in-place editor.
      // - Guarantees: see 'candidate'.
      // - Expected behavior: in-place editor for the field is ready for use.
      'active',
      // User has modified values in the in-place editor.
      // - Trigger: user.
      // - Guarantees: see 'candidate', plus in-place editor is ready for use.
      // - Expected behavior: visual indicator of change.
      'changed',
      // User is saving changed field data in in-place editor to TempStore. The
      // save mechanism of the in-place editor is called.
      // - Trigger: user.
      // - Guarantees: see 'candidate' and 'active'.
      // - Expected behavior: saving indicator, in-place editor is saving field
      //   data into TempStore. Upon successful saving (without validation
      //   errors), the in-place editor transitions the field's state to 'saved',
      //   but to 'invalid' upon failed saving (with validation errors).
      'saving',
      // In-place editor has successfully saved the changed field.
      // - Trigger: in-place editor.
      // - Guarantees: see 'candidate' and 'active'.
      // - Expected behavior: transition back to 'candidate' state because the
      //   deed is done. Then: 1) transition to 'inactive' to allow the field to
      //   be rerendered, 2) destroy the FieldModel (which also destroys attached
      //   views like the EditorView), 3) replace the existing field HTML with the
      //   existing HTML and 4) attach behaviors again so that the field becomes
      //   available again for in-place editing.
      'saved',
      // In-place editor has failed to saved the changed field: there were
      // validation errors.
      // - Trigger: in-place editor.
      // - Guarantees: see 'candidate' and 'active'.
      // - Expected behavior: remain in 'invalid' state, let the user make more
      //   changes so that he can save it again, without validation errors.
      'invalid'
    ],

    /**
     * Indicates whether the 'from' state comes before the 'to' state.
     *
     * @param String from
     *   One of Drupal.quickedit.FieldModel.states.
     * @param String to
     *   One of Drupal.quickedit.FieldModel.states.
     * @return Boolean
     */
    followsStateSequence: function (from, to) {
      return _.indexOf(this.states, from) < _.indexOf(this.states, to);
    }

  });

  Drupal.quickedit.FieldCollection = Backbone.Collection.extend({
    model: Drupal.quickedit.FieldModel
  });

}(_, Backbone, Drupal));
;
/**
 * @file
 * A Backbone Model for the state of an in-place editor.
 *
 * @see Drupal.quickedit.EditorView
 */

(function (Backbone, Drupal) {

  "use strict";

  Drupal.quickedit.EditorModel = Backbone.Model.extend({

    defaults: {
      // Not the full HTML representation of this field, but the "actual"
      // original value of the field, stored by the used in-place editor, and
      // in a representation that can be chosen by the in-place editor.
      originalValue: null,
      // Analogous to originalValue, but the current value.
      currentValue: null,
      // Stores any validation errors to be rendered.
      validationErrors: null
    }

  });

}(Backbone, Drupal));
;
/**
 * @file
 * A Backbone View that controls the overall "in-place editing application".
 *
 * @see Drupal.quickedit.AppModel
 */

(function ($, _, Backbone, Drupal) {

  "use strict";

  // Indicates whether the page should be reloaded after in-place editing has
  // shut down. A page reload is necessary to re-instate the original HTML of the
  // edited fields if in-place editing has been canceled and one or more of the
  // entity's fields were saved to TempStore: one of them may have been changed to
  // the empty value and hencer may have been rerendered as the empty string, which
  // makes it impossible for Quick Edit to know where to restore the original HTML.
  var reload = false;

  Drupal.quickedit.AppView = Backbone.View.extend({

    /**
     * {@inheritdoc}
     *
     * @param Object options
     *   An object with the following keys:
     *   - Drupal.quickedit.AppModel model: the application state model
     *   - Drupal.quickedit.EntityCollection entitiesCollection: all on-page entities
     *   - Drupal.quickedit.FieldCollection fieldsCollection: all on-page fields
     */
    initialize: function (options) {
      // AppView's configuration for handling states.
      // @see Drupal.quickedit.FieldModel.states
      this.activeFieldStates = ['activating', 'active'];
      this.singleFieldStates = ['highlighted', 'activating', 'active'];
      this.changedFieldStates = ['changed', 'saving', 'saved', 'invalid'];
      this.readyFieldStates = ['candidate', 'highlighted'];

      this.listenTo(options.entitiesCollection, {
        // Track app state.
        'change:state': this.appStateChange,
        'change:isActive': this.enforceSingleActiveEntity
      });

      // Track app state.
      this.listenTo(options.fieldsCollection, 'change:state', this.editorStateChange);
      // Respond to field model HTML representation change events.
      this.listenTo(options.fieldsCollection, 'change:html', this.renderUpdatedField);
      this.listenTo(options.fieldsCollection, 'change:html', this.propagateUpdatedField);
      // Respond to addition.
      this.listenTo(options.fieldsCollection, 'add', this.rerenderedFieldToCandidate);
      // Respond to destruction.
      this.listenTo(options.fieldsCollection, 'destroy', this.teardownEditor);
    },

    /**
     * Handles setup/teardown and state changes when the active entity changes.
     *
     * @param Drupal.quickedit.EntityModel entityModel
     *   An instance of the EntityModel class.
     * @param String state
     *   The state of the associated field. One of Drupal.quickedit.EntityModel.states.
     */
    appStateChange: function (entityModel, state) {
      var app = this;
      var entityToolbarView;
      switch (state) {
        case 'launching':
          reload = false;
          // First, create an entity toolbar view.
          entityToolbarView = new Drupal.quickedit.EntityToolbarView({
            model: entityModel,
            appModel: this.model
          });
          entityModel.toolbarView = entityToolbarView;
          // Second, set up in-place editors.
          // They must be notified of state changes, hence this must happen while
          // the associated fields are still in the 'inactive' state.
          entityModel.get('fields').each(function (fieldModel) {
            app.setupEditor(fieldModel);
          });
          // Third, transition the entity to the 'opening' state, which will
          // transition all fields from 'inactive' to 'candidate'.
          _.defer(function () {
            entityModel.set('state', 'opening');
          });
          break;
        case 'closed':
          entityToolbarView = entityModel.toolbarView;
          // First, tear down the in-place editors.
          entityModel.get('fields').each(function (fieldModel) {
            app.teardownEditor(fieldModel);
          });
          // Second, tear down the entity toolbar view.
          if (entityToolbarView) {
            entityToolbarView.remove();
            delete entityModel.toolbarView;
          }
          // A page reload may be necessary to re-instate the original HTML of the
          // edited fields.
          if (reload) {
            reload = false;
            location.reload();
          }
          // If the workbench moderation block exists, attempt to refresh it
          if (Drupal.behaviors.workbenchModerationBlockRefresh && typeof Drupal.behaviors.workbenchModerationBlockRefresh.refreshBlock == 'function') {
            Drupal.behaviors.workbenchModerationBlockRefresh.refreshBlock();
          }
          break;
      }
    },

    /**
     * Accepts or reject editor (Editor) state changes.
     *
     * This is what ensures that the app is in control of what happens.
     *
     * @param String from
     *   The previous state.
     * @param String to
     *   The new state.
     * @param null|Object context
     *   The context that is trying to trigger the state change.
     * @param Drupal.quickedit.FieldModel fieldModel
     *   The fieldModel to which this change applies.
     */
    acceptEditorStateChange: function (from, to, context, fieldModel) {
      var accept = true;

      // If the app is in view mode, then reject all state changes except for
      // those to 'inactive'.
      if (context && (context.reason === 'stop' || context.reason === 'rerender')) {
        if (from === 'candidate' && to === 'inactive') {
          accept = true;
        }
      }
      // Handling of edit mode state changes is more granular.
      else {
        // In general, enforce the states sequence. Disallow going back from a
        // "later" state to an "earlier" state, except in explicitly allowed
        // cases.
        if (!Drupal.quickedit.FieldModel.followsStateSequence(from, to)) {
          accept = false;
          // Allow: activating/active -> candidate.
          // Necessary to stop editing a field.
          if (_.indexOf(this.activeFieldStates, from) !== -1 && to === 'candidate') {
            accept = true;
          }
          // Allow: changed/invalid -> candidate.
          // Necessary to stop editing a field when it is changed or invalid.
          else if ((from === 'changed' || from === 'invalid') && to === 'candidate') {
            accept = true;
          }
          // Allow: highlighted -> candidate.
          // Necessary to stop highlighting a field.
          else if (from === 'highlighted' && to === 'candidate') {
            accept = true;
          }
          // Allow: saved -> candidate.
          // Necessary when successfully saved a field.
          else if (from === 'saved' && to === 'candidate') {
            accept = true;
          }
          // Allow: invalid -> saving.
          // Necessary to be able to save a corrected, invalid field.
          else if (from === 'invalid' && to === 'saving') {
            accept = true;
          }
          // Allow: invalid -> activating.
          // Necessary to be able to correct a field that turned out to be invalid
          // after the user already had moved on to the next field (which we
          // explicitly allow to have a fluent UX).
          else if (from === 'invalid' && to === 'activating') {
            accept = true;
          }
        }

        // If it's not against the general principle, then here are more
        // disallowed cases to check.
        if (accept) {
          var activeField, activeFieldState;
          // Ensure only one field (editor) at a time is active … but allow a user
          // to hop from one field to the next, even if we still have to start
          // saving the field that is currently active: assume it will be valid,
          // to allow for a fluent UX. (If it turns out to be invalid, this block
          // of code also handles that.)
          if ((this.readyFieldStates.indexOf(from) !== -1 || from === 'invalid') && this.activeFieldStates.indexOf(to) !== -1) {
            activeField = this.model.get('activeField');
            if (activeField && activeField !== fieldModel) {
              activeFieldState = activeField.get('state');
              // Allow the state change. If the state of the active field is:
              // - 'activating' or 'active': change it to 'candidate'
              // - 'changed' or 'invalid': change it to 'saving'
              // - 'saving'or 'saved': don't do anything.
              if (this.activeFieldStates.indexOf(activeFieldState) !== -1) {
                activeField.set('state', 'candidate');
              }
              else if (activeFieldState === 'changed' || activeFieldState === 'invalid') {
                activeField.set('state', 'saving');
              }

              // If the field that's being activated is in fact already in the
              // invalid state (which can only happen because above we allowed the
              // user to move on to another field to allow for a fluent UX; we
              // assumed it would be saved successfully), then we shouldn't allow
              // the field to enter the 'activating' state, instead, we simply
              // change the active editor. All guarantees and assumptions for this
              // field still hold!
              if (from === 'invalid') {
                this.model.set('activeField', fieldModel);
                accept = false;
              }
              // Do not reject: the field is either in the 'candidate' or
              // 'highlighted' state and we allow it to enter the 'activating'
              // state!
            }
          }
          // Reject going from activating/active to candidate because of a
          // mouseleave.
          else if (_.indexOf(this.activeFieldStates, from) !== -1 && to === 'candidate') {
            if (context && context.reason === 'mouseleave') {
              accept = false;
            }
          }
          // When attempting to stop editing a changed/invalid property, ask for
          // confirmation.
          else if ((from === 'changed' || from === 'invalid') && to === 'candidate') {
            if (context && context.reason === 'mouseleave') {
              accept = false;
            }
            else {
              // Check whether the transition has been confirmed?
              if (context && context.confirmed) {
                accept = true;
              }
            }
          }
        }
      }

      return accept;
    },

    /**
     * Sets up the in-place editor for the given field.
     *
     * Must happen before the fieldModel's state is changed to 'candidate'.
     *
     * @param Drupal.quickedit.FieldModel fieldModel
     *   The field for which an in-place editor must be set up.
     */
    setupEditor: function (fieldModel) {
      // Get the corresponding entity toolbar.
      var entityModel = fieldModel.get('entity');
      var entityToolbarView = entityModel.toolbarView;
      // Get the field toolbar DOM root from the entity toolbar.
      var fieldToolbarRoot = entityToolbarView.getToolbarRoot();
      // Create in-place editor.
      var editorName = fieldModel.get('metadata').editor;
      var editorModel = new Drupal.quickedit.EditorModel();
      var editorView = new Drupal.quickedit.editors[editorName]({
        el: $(fieldModel.get('el')),
        model: editorModel,
        fieldModel: fieldModel
      });

      // Create in-place editor's toolbar for this field — stored inside the
      // entity toolbar, the entity toolbar will position itself appropriately
      // above (or below) the edited element.
      var toolbarView = new Drupal.quickedit.FieldToolbarView({
        el: fieldToolbarRoot,
        model: fieldModel,
        $editedElement: $(editorView.getEditedElement()),
        editorView: editorView,
        entityModel: entityModel
      });

      // Create decoration for edited element: padding if necessary, sets classes
      // on the element to style it according to the current state.
      var decorationView = new Drupal.quickedit.FieldDecorationView({
        el: $(editorView.getEditedElement()),
        model: fieldModel,
        editorView: editorView
      });

      // Track these three views in FieldModel so that we can tear them down
      // correctly.
      fieldModel.editorView = editorView;
      fieldModel.toolbarView = toolbarView;
      fieldModel.decorationView = decorationView;
    },

    /**
     * Tears down the in-place editor for the given field.
     *
     * Must happen after the fieldModel's state is changed to 'inactive'.
     *
     * @param Drupal.quickedit.FieldModel fieldModel
     *   The field for which an in-place editor must be torn down.
     */
    teardownEditor: function (fieldModel) {
      // Early-return if this field was not yet decorated.
      if (fieldModel.editorView === undefined) {
        return;
      }

      // Unbind event handlers; remove toolbar element; delete toolbar view.
      fieldModel.toolbarView.remove();
      delete fieldModel.toolbarView;

      // Unbind event handlers; delete decoration view. Don't remove the element
      // because that would remove the field itself.
      fieldModel.decorationView.remove();
      delete fieldModel.decorationView;

      // Unbind event handlers; delete editor view. Don't remove the element
      // because that would remove the field itself.
      fieldModel.editorView.remove();
      delete fieldModel.editorView;
    },

    /**
     * Asks the user to confirm whether he wants to stop editing via a modal.
     *
     * @see acceptEditorStateChange()
     */
    confirmEntityDeactivation: function (entityModel) {
      var that = this;
      var discardDialog;

      function closeDiscardDialog (action) {
        // The active modal has been removed.
        that.model.set('activeModal', null);

        // If the targetState is saving, the field must be saved, then the
        // entity must be saved.
        if (action === 'save') {
          entityModel.set('state', 'committing', {confirmed : true});
        }
        else {
          entityModel.set('state', 'deactivating', {confirmed : true});
          // Editing has been canceled and the changes will not be saved. Mark
          // the page for reload if the entityModel declares that it requires
          // a reload.
          if (entityModel.get('reload')) {
            reload = true;
            entityModel.set('reload', false);
          }
        }
      }

      // Only instantiate if there isn't a modal instance visible yet.
      if (!this.model.get('activeModal')) {
        discardDialog = new Drupal.quickedit.ModalView({
          title: Drupal.t('Discard changes?'),
          dialogClass: 'quickedit-discard-modal',
          message: Drupal.t('You have unsaved changes'),
          buttons: [
            {
              action: 'save',
              type: 'submit',
              classes: 'action-save quickedit-button',
              label: Drupal.t('Save'),
            },
            {
              action: 'discard',
              classes: 'action-cancel quickedit-button',
              label: Drupal.t('Discard changes'),
            }
          ],
          callback: closeDiscardDialog,
        });
        this.model.set('activeModal', discardDialog);

        discardDialog.render();
      }
    },

    /**
     * Reacts to field state changes; tracks global state.
     *
     * @param Drupal.quickedit.FieldModel fieldModel
     * @param String state
     *   The state of the associated field. One of Drupal.quickedit.FieldModel.states.
     */
    editorStateChange: function (fieldModel, state) {
      var from = fieldModel.previous('state');
      var to = state;

      // Keep track of the highlighted field in the global state.
      if (_.indexOf(this.singleFieldStates, to) !== -1 && this.model.get('highlightedField') !== fieldModel) {
        this.model.set('highlightedField', fieldModel);
      }
      else if (this.model.get('highlightedField') === fieldModel && to === 'candidate') {
        this.model.set('highlightedField', null);
      }

      // Keep track of the active field in the global state.
      if (_.indexOf(this.activeFieldStates, to) !== -1 && this.model.get('activeField') !== fieldModel) {
        this.model.set('activeField', fieldModel);
      }
      else if (this.model.get('activeField') === fieldModel && to === 'candidate') {
        // Discarded if it transitions from a changed state to 'candidate'.
        if (from === 'changed' || from === 'invalid') {
          fieldModel.editorView.revert();
        }
        this.model.set('activeField', null);
      }
    },

    /**
     * Render an updated field (a field whose 'html' attribute changed).
     *
     * @param Drupal.quickedit.FieldModel fieldModel
     *   The FieldModel whose 'html' attribute changed.
     * @param String html
     *   The updated 'html' attribute.
     * @param Object options
     *   An object with the following keys:
     *   - Boolean propagation: whether this change to the 'html' attribute
     *     occurred because of the propagation of changes to another instance of
     *     this field.
     */
    renderUpdatedField: function (fieldModel, html, options) {
      // Deferred because renderUpdatedField is reacting to a field model change
      // event, and we want to make sure that event fully propagates before making
      // another change to the same model.
      _.defer(function () {
        // Get data necessary to rerender property before it is unavailable.
        var $fieldWrapper = $(fieldModel.get('el'));
        var $context = $fieldWrapper.parent();

        // When propagating the changes of another instance of this field, this
        // field is not being actively edited and hence no state changes are
        // necessary. So: only update the state of this field when the rerendering
        // of this field happens not because of propagation, but because it is being
        // edited itself.
        if (!options.propagation) {
          // First set the state to 'candidate', to allow all attached views to
          // clean up all their "active state"-related changes.
          fieldModel.set('state', 'candidate');

          // Similarly, the above .set() call's change event must fully propagate
          // before calling it again.
          _.defer(function () {
            // Set the field's state to 'inactive', to enable the updating of its DOM
            // value.
            fieldModel.set('state', 'inactive', { reason: 'rerender' });

            // Destroy the field model; this will cause all attached views to be
            // destroyed too, and removal from all collections in which it exists.
            fieldModel.destroy();

            // Replace the old content with the new content.
            $fieldWrapper.replaceWith(html);

            // Attach behaviors again to the modified piece of HTML; this will create
            // a new field model and call rerenderedFieldToCandidate() with it.
            Drupal.attachBehaviors($context.get(0));
          });
        }
      });
    },

    /**
     * Propagates the changes to an updated field to all instances of that field.
     *
     * @param Drupal.quickedit.FieldModel updatedField
     *   The FieldModel whose 'html' attribute changed.
     * @param String html
     *   The updated 'html' attribute.
     * @param Object options
     *   An object with the following keys:
     *   - Boolean propagation: whether this change to the 'html' attribute
     *     occurred because of the propagation of changes to another instance of
     *     this field.
     *
     * @see Drupal.quickedit.AppView.renderUpdatedField()
     */
    propagateUpdatedField: function (updatedField, html, options) {
      // Don't propagate field updates that themselves were caused by propagation.
      if (options.propagation) {
        return;
      }

      var htmlForOtherViewModes = updatedField.get('htmlForOtherViewModes');
      Drupal.quickedit.collections.fields
        // Find all instances of fields that display the same logical field (same
        // entity, same field, just a different instance and maybe a different
        // view mode).
        .where({ logicalFieldID: updatedField.get('logicalFieldID') })
        .forEach(function (field) {
          // Ignore the field that was already updated.
          if (field === updatedField) {
            return;
          }
          // If this other instance of the field has the same view mode, we can
          // update it easily.
          else if (field.getViewMode() === updatedField.getViewMode()) {
            field.set('html', updatedField.get('html'));
          }
          // If this other instance of the field has a different view mode, and
          // that is one of the view modes for which a re-rendered version is
          // available (and that should be the case unless this field was only
          // added to the page after editing of the updated field began), then use
          // that view mode's re-rendered version.
          else {
            if (field.getViewMode() in htmlForOtherViewModes) {
              field.set('html', htmlForOtherViewModes[field.getViewMode()], { propagation: true });
            }
          }
        });
    },

    /**
     * If the new in-place editable field is for the entity that's currently
     * being edited, then transition it to the 'candidate' state.
     *
     * This happens when a field was modified, saved and hence rerendered.
     *
     * @param Drupal.quickedit.FieldModel fieldModel
     *   A field that was just added to the collection of fields.
     */
    rerenderedFieldToCandidate: function (fieldModel) {
      var activeEntity = Drupal.quickedit.collections.entities.findWhere({isActive: true});

      // Early-return if there is no active entity.
      if (!activeEntity) {
        return;
      }

      // If the field's entity is the active entity, make it a candidate.
      if (fieldModel.get('entity') === activeEntity) {
        this.setupEditor(fieldModel);
        fieldModel.set('state', 'candidate');
      }
    },

    /**
     * EntityModel Collection change handler, called on change:isActive, enforces
     * a single active entity.
     *
     * @param Drupal.quickedit.EntityModel
     *   The entityModel instance whose active state has changed.
     */
    enforceSingleActiveEntity: function (changedEntityModel) {
      // When an entity is deactivated, we don't need to enforce anything.
      if (changedEntityModel.get('isActive') === false) {
        return;
      }

      // This entity was activated; deactivate all other entities.
      changedEntityModel.collection.chain()
        .filter(function (entityModel) {
          return entityModel.get('isActive') === true && entityModel !== changedEntityModel;
        })
        .each(function (entityModel) {
          entityModel.set('state', 'deactivating');
        });
    }

  });

}(jQuery, _, Backbone, Drupal));
;
/**
 * @file
 * A Backbone View that decorates the in-place edited element.
 */

(function ($, Backbone, Drupal) {

  "use strict";

  Drupal.quickedit.FieldDecorationView = Backbone.View.extend({

    _widthAttributeIsEmpty: null,

    events: {
      'mouseenter.quickedit' : 'onMouseEnter',
      'mouseleave.quickedit' : 'onMouseLeave',
      'click': 'onClick',
      'tabIn.quickedit': 'onMouseEnter',
      'tabOut.quickedit': 'onMouseLeave'
    },

    /**
     * {@inheritdoc}
     *
     * @param Object options
     *   An object with the following keys:
     *   - Drupal.quickedit.EditorView editorView: the editor object view.
     */
    initialize: function (options) {
      this.editorView = options.editorView;

      this.listenTo(this.model, 'change:state', this.stateChange);
      this.listenTo(this.model, 'change:isChanged change:inTempStore', this.renderChanged);
    },

    /**
     * {@inheritdoc}
     */
    remove: function () {
      // The el property is the field, which should not be removed. Remove the
      // pointer to it, then call Backbone.View.prototype.remove().
      this.setElement();
      Backbone.View.prototype.remove.call(this);
    },

    /**
     * Determines the actions to take given a change of state.
     *
     * @param Drupal.quickedit.FieldModel model
     * @param String state
     *   The state of the associated field. One of
     *   Drupal.quickedit.FieldModel.states.
     */
    stateChange: function (model, state) {
      var from = model.previous('state');
      var to = state;
      switch (to) {
        case 'inactive':
          this.undecorate();
          break;
        case 'candidate':
          this.decorate();
          if (from !== 'inactive') {
            this.stopHighlight();
            if (from !== 'highlighted') {
              this.model.set('isChanged', false);
              this.stopEdit();
            }
          }
          this._unpad();
          break;
        case 'highlighted':
          this.startHighlight();
          break;
        case 'activating':
          // NOTE: this state is not used by every editor! It's only used by those
          // that need to interact with the server.
          this.prepareEdit();
          break;
        case 'active':
          if (from !== 'activating') {
            this.prepareEdit();
          }
          if (this.editorView.getQuickEditUISettings().padding) {
            this._pad();
          }
          break;
        case 'changed':
          this.model.set('isChanged', true);
          break;
        case 'saving':
          break;
        case 'saved':
          break;
        case 'invalid':
          break;
      }
    },

    /**
     * Adds a class to the edited element that indicates whether the field has
     * been changed by the user (i.e. locally) or the field has already been
     * changed and stored before by the user (i.e. remotely, stored in TempStore).
     */
    renderChanged: function () {
      this.$el.toggleClass('quickedit-changed', this.model.get('isChanged') || this.model.get('inTempStore'));
    },

    /**
     * Starts hover; transitions to 'highlight' state.
     *
     * @param jQuery event
     */
    onMouseEnter: function (event) {
      var that = this;
      that.model.set('state', 'highlighted');
      event.stopPropagation();
    },

    /**
     * Stops hover; transitions to 'candidate' state.
     *
     * @param jQuery event
     */
    onMouseLeave: function (event) {
      var that = this;
      that.model.set('state', 'candidate', { reason: 'mouseleave' });
      event.stopPropagation();
    },

    /**
     * Transition to 'activating' stage.
     *
     * @param jQuery event
     */
    onClick: function (event) {
      this.model.set('state', 'activating');
      event.preventDefault();
      event.stopPropagation();
    },

    /**
     * Adds classes used to indicate an elements editable state.
     */
    decorate: function () {
      this.$el.addClass('quickedit-candidate quickedit-editable');
    },

    /**
     * Removes classes used to indicate an elements editable state.
     */
    undecorate: function () {
      this.$el.removeClass('quickedit-candidate quickedit-editable quickedit-highlighted quickedit-editing');
    },

    /**
     * Adds that class that indicates that an element is highlighted.
     */
    startHighlight: function () {
      // Animations.
      var that = this;
      // Use a timeout to grab the next available animation frame.
      that.$el.addClass('quickedit-highlighted');
    },

    /**
     * Removes the class that indicates that an element is highlighted.
     */
    stopHighlight: function () {
      this.$el.removeClass('quickedit-highlighted');
    },

    /**
     * Removes the class that indicates that an element as editable.
     */
    prepareEdit: function () {
      this.$el.addClass('quickedit-editing');

      // Allow the field to be styled differently while editing in a pop-up
      // in-place editor.
      if (this.editorView.getQuickEditUISettings().popup) {
        this.$el.addClass('quickedit-editor-is-popup');
      }
    },

    /**
     * Removes the class that indicates that an element is being edited.
     *
     * Reapplies the class that indicates that a candidate editable element is
     * again available to be edited.
     */
    stopEdit: function () {
      this.$el.removeClass('quickedit-highlighted quickedit-editing');

      // Done editing in a pop-up in-place editor; remove the class.
      if (this.editorView.getQuickEditUISettings().popup) {
        this.$el.removeClass('quickedit-editor-is-popup');
      }

      // Make the other editors show up again.
      $('.quickedit-candidate').addClass('quickedit-editable');
    },

    /**
     * Adds padding around the editable element in order to make it pop visually.
     */
    _pad: function () {
      // Early return if the element has already been padded.
      if (this.$el.data('quickedit-padded')) {
        return;
      }
      var self = this;

      // Add 5px padding for readability. This means we'll freeze the current
      // width and *then* add 5px padding, hence ensuring the padding is added "on
      // the outside".
      // 1) Freeze the width (if it's not already set); don't use animations.
      if (this.$el[0].style.width === "") {
        this._widthAttributeIsEmpty = true;
        this.$el
          .addClass('quickedit-animate-disable-width')
          .css('width', this.$el.width());
      }

      // 2) Add padding; use animations.
      var posProp = this._getPositionProperties(this.$el);
      setTimeout(function () {
        // Re-enable width animations (padding changes affect width too!).
        self.$el.removeClass('quickedit-animate-disable-width');

        // Pad the editable.
        self.$el
        .css({
          'position': 'relative',
          'top':  posProp.top  - 5 + 'px',
          'left': posProp.left - 5 + 'px',
          'padding-top'   : posProp['padding-top']    + 5 + 'px',
          'padding-left'  : posProp['padding-left']   + 5 + 'px',
          'padding-right' : posProp['padding-right']  + 5 + 'px',
          'padding-bottom': posProp['padding-bottom'] + 5 + 'px',
          'margin-bottom':  posProp['margin-bottom'] - 10 + 'px'
        })
        .data('quickedit-padded', true);
      }, 0);
    },

    /**
     * Removes the padding around the element being edited when editing ceases.
     */
    _unpad: function () {
      // Early return if the element has not been padded.
      if (!this.$el.data('quickedit-padded')) {
        return;
      }
      var self = this;

      // 1) Set the empty width again.
      if (this._widthAttributeIsEmpty) {
        this.$el
          .addClass('quickedit-animate-disable-width')
          .css('width', '');
      }

      // 2) Remove padding; use animations (these will run simultaneously with)
      // the fading out of the toolbar as its gets removed).
      var posProp = this._getPositionProperties(this.$el);
      setTimeout(function () {
        // Re-enable width animations (padding changes affect width too!).
        self.$el.removeClass('quickedit-animate-disable-width');

        // Unpad the editable.
        self.$el
        .css({
          'position': 'relative',
          'top':  posProp.top  + 5 + 'px',
          'left': posProp.left + 5 + 'px',
          'padding-top'   : posProp['padding-top']    - 5 + 'px',
          'padding-left'  : posProp['padding-left']   - 5 + 'px',
          'padding-right' : posProp['padding-right']  - 5 + 'px',
          'padding-bottom': posProp['padding-bottom'] - 5 + 'px',
          'margin-bottom': posProp['margin-bottom'] + 10 + 'px'
        });
      }, 0);
      // Remove the marker that indicates that this field has padding. This is
      // done outside the timed out function above so that we don't get numerous
      // queued functions that will remove padding before the data marker has
      // been removed.
      this.$el.removeData('quickedit-padded');
    },

    /**
     * Gets the top and left properties of an element.
     *
     * Convert extraneous values and information into numbers ready for
     * subtraction.
     *
     * @param DOM $e
     */
    _getPositionProperties: function ($e) {
      var p,
          r = {},
          props = [
            'top', 'left', 'bottom', 'right',
            'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
            'margin-bottom'
          ];

      var propCount = props.length;
      for (var i = 0; i < propCount; i++) {
        p = props[i];
        r[p] = parseInt(this._replaceBlankPosition($e.css(p)), 10);
      }
      return r;
    },

    /**
     * Replaces blank or 'auto' CSS "position: <value>" values with "0px".
     *
     * @param String pos
     *   (optional) The value for a CSS position declaration.
     */
    _replaceBlankPosition: function (pos) {
      if (pos === 'auto' || !pos) {
        pos = '0px';
      }
      return pos;
    }

  });

})(jQuery, Backbone, Drupal);
;
/**
 * @file
 * A Backbone view that decorates the in-place editable entity.
 */

(function (Drupal, $, Backbone) {

  "use strict";

  Drupal.quickedit.EntityDecorationView = Backbone.View.extend({

    /**
     * {@inheritdoc}
     *
     * Associated with the DOM root node of an editable entity.
     */
    initialize: function () {
      this.listenTo(this.model, 'change', this.render);
    },

    /**
     * {@inheritdoc}
     */
    render: function () {
      this.$el.toggleClass('quickedit-entity-active', this.model.get('isActive'));
    },

    /**
     * {@inheritdoc}
     */
    remove: function () {
      this.setElement(null);
      Backbone.View.prototype.remove.call(this);
    }

  });

}(Drupal, jQuery, Backbone));
;
/**
 * @file
 * A Backbone View that provides an entity level toolbar.
 */
(function ($, _, Backbone, Drupal, debounce) {

  "use strict";

  Drupal.quickedit.EntityToolbarView = Backbone.View.extend({

    _fieldToolbarRoot: null,

    events: function () {
      var map = {
        'click button.action-save': 'onClickSave',
        'click button.action-cancel': 'onClickCancel',
        'mouseenter': 'onMouseenter'
      };
      return map;
    },

    /**
     * {@inheritdoc}
     */
    initialize: function (options) {
      var that = this;
      this.appModel = options.appModel;
      this.$entity = $(this.model.get('el'));

      // Rerender whenever the entity state changes.
      this.listenTo(this.model, 'change:isActive change:isDirty change:state', this.render);
      // Also rerender whenever a different field is highlighted or activated.
      this.listenTo(this.appModel, 'change:highlightedField change:activeField', this.render);
      // Rerender when a field of the entity changes state.
      this.listenTo(this.model.get('fields'), 'change:state', this.fieldStateChange);

      // Reposition the entity toolbar as the viewport and the position within the
      // viewport changes.
      $(window).on('resize.quickedit scroll.quickedit', debounce($.proxy(this.windowChangeHandler, this), 150));

      // Adjust the fence placement within which the entity toolbar may be
      // positioned.
      $(document).on('drupalViewportOffsetChange.quickedit', function (event, offsets) {
        if (that.$fence) {
          that.$fence.css(offsets);
        }
      });

      // Set the entity toolbar DOM element as the el for this view.
      var $toolbar = this.buildToolbarEl();
      this.setElement($toolbar);
      this._fieldToolbarRoot = $toolbar.find('.quickedit-toolbar-field').get(0);

      // Initial render.
      this.render();
    },

    /**
     * {@inheritdoc}
     */
    render: function () {
      if (this.model.get('isActive')) {
        // If the toolbar container doesn't exist, create it.
        var $body = $('body');
        if ($body.children('#quickedit-entity-toolbar').length === 0) {
          $body.append(this.$el);
        }
        // The fence will define a area on the screen that the entity toolbar
        // will be position within.
        if ($body.children('#quickedit-toolbar-fence').length === 0) {
          this.$fence = $(Drupal.theme('quickeditEntityToolbarFence'))
            // @todo: Figure out the Drupal 7 alternative for Drupal.displace()?
            //        See https://drupal.org/node/1956804.
            //.css(Drupal.displace())
            .appendTo($body);
        }
        // Adds the entity title to the toolbar.
        this.label();

        // Show the save and cancel buttons.
        this.show('ops');
        // If render is being called and the toolbar is already visible, just
        // reposition it.
        this.position();
      }

      // The save button text and state varies with the state of the entity model.
      var $button = this.$el.find('.quickedit-button.action-save');
      var isDirty = this.model.get('isDirty');
      // Adjust the save button according to the state of the model.
      switch (this.model.get('state')) {
        // Quick editing is active, but no field is being edited.
        case 'opened':
          // The saving throbber is not managed by AJAX system. The
          // EntityToolbarView manages this visual element.
          $button
            .removeClass('action-saving icon-throbber icon-end')
            .text(Drupal.t('Save'))
            .removeAttr('disabled')
            .attr('aria-hidden', !isDirty);
          break;
        // The changes to the fields of the entity are being committed.
        case 'committing':
          $button
            .addClass('action-saving icon-throbber icon-end')
            .text(Drupal.t('Saving'))
            .attr('disabled', 'disabled');
          break;
        default:
          $button.attr('aria-hidden', true);
          break;
      }

      return this;
    },

    /**
     * {@inheritdoc}
     */
    remove: function () {
      // Remove additional DOM elements controlled by this View.
      this.$fence.remove();

      // Stop listening to DOM events.
      $(window).off('resize.quickedit scroll.quickedit');
      $(document).off('drupalViewportOffsetChange.quickedit');

      Backbone.View.prototype.remove.call(this);
    },

    /**
     * Repositions the entity toolbar on window scroll and resize.
     *
     * @param jQuery.Eevent event
     */
    windowChangeHandler: function (event) {
      this.position();
    },

    /**
     * Determines the actions to take given a change of state.
     *
     * @param Drupal.quickedit.FieldModel model
     * @param String state
     *   The state of the associated field. One of Drupal.quickedit.FieldModel.states.
     */
    fieldStateChange: function (model, state) {
      switch (state) {
        case 'active':
          this.render();
          break;
        case 'invalid':
          this.render();
          break;
      }
    },

    /**
     * Uses the jQuery.ui.position() method to position the entity toolbar.
     *
     * @param jQuery|DOM element
     *   (optional) The element against which the entity toolbar is positioned.
     */
    position: function (element) {
      clearTimeout(this.timer);

      var that = this;
      // Vary the edge of the positioning according to the direction of language
      // in the document.
      var edge = (document.documentElement.dir === 'rtl') ? 'right' : 'left';
      // A time unit to wait until the entity toolbar is repositioned.
      var delay = 0;
      // Determines what check in the series of checks below should be evaluated
      var check = 0;
      // When positioned against an active field that has padding, we should
      // ignore that padding when positioning the toolbar, to not unnecessarily
      // move the toolbar horizontally, which feels annoying.
      var horizontalPadding = 0;
      var of, activeField, highlightedField;
      // There are several elements in the page that the entity toolbar might be
      // positioned against. They are considered below in a priority order.
      do {
        switch (check) {
          case 0:
            // Position against a specific element.
            of = element;
            break;
          case 1:
            // Position against a form container.
            activeField = Drupal.quickedit.app.model.get('activeField');
            of = activeField && activeField.editorView && activeField.editorView.$formContainer && activeField.editorView.$formContainer.find('.quickedit-form');
            break;
          case 2:
            // Position against an active field.
            of = activeField && activeField.editorView && activeField.editorView.getEditedElement();
            if (activeField && activeField.editorView && activeField.editorView.getQuickEditUISettings().padding) {
              horizontalPadding = 5;
            }
            break;
          case 3:
            // Position against a highlighted field.
            highlightedField = Drupal.quickedit.app.model.get('highlightedField');
            of = highlightedField && highlightedField.editorView && highlightedField.editorView.getEditedElement();
            delay = 250;
            break;
          default:
            var fieldModels = this.model.get('fields').models;
            var topMostPosition = 1000000;
            var topMostField = null;
            // Position against the topmost field.
            for (var i = 0; i < fieldModels.length; i++) {
              var pos = fieldModels[i].get('el').getBoundingClientRect().top;
              if (pos < topMostPosition) {
                topMostPosition = pos;
                topMostField = fieldModels[i];
              }
            }
            of = topMostField.get('el');
            delay = 50;
            break;
        }
        // Prepare to check the next possible element to position against.
        check++;
      } while (!of);

      /**
       * Refines the positioning algorithm of jquery.ui.position().
       *
       * Invoked as the 'using' callback of jquery.ui.position() in
       * positionToolbar().
       *
       * @param Object suggested
       *   A hash of top and left values for the position that should be set. It
       *   can be forwarded to .css() or .animate().
       * @param Object info
       *   The position and dimensions of both the 'my' element and the 'of'
       *   elements, as well as calculations to their relative position. This
       *   object contains the following properties:
       *     - Object element: A hash that contains information about the HTML
       *     element that will be positioned. Also known as the 'my' element.
       *     - Object target: A hash that contains information about the HTML
       *     element that the 'my' element will be positioned against. Also known
       *     as the 'of' element.
       */
      function refinePosition (view, suggested, info) {
        // Determine if the pointer should be on the top or bottom.
        var isBelow = suggested.top > info.target.top;
        info.element.element.toggleClass('quickedit-toolbar-pointer-top', isBelow);
        // Don't position the toolbar past the first or last editable field if
        // the entity is the target.
        if (view.$entity[0] === info.target.element[0]) {
          // Get the first or last field according to whether the toolbar is above
          // or below the entity.
          var $field = view.$entity.find('.quickedit-editable').eq((isBelow) ? -1 : 0);
          if ($field.length > 0) {
            suggested.top = (isBelow) ? ($field.offset().top + $field.outerHeight(true)) : $field.offset().top - info.element.element.outerHeight(true);
          }
        }
        // Don't let the toolbar go outside the fence.
        var fenceTop = view.$fence.offset().top;
        var fenceHeight = view.$fence.height();
        var toolbarHeight = info.element.element.outerHeight(true);
        if (suggested.top < fenceTop) {
          suggested.top = fenceTop;
        }
        else if ((suggested.top + toolbarHeight) > (fenceTop + fenceHeight)) {
          suggested.top = fenceTop + fenceHeight - toolbarHeight;
        }
        // Position the toolbar.
        info.element.element.css({
          left: Math.floor(suggested.left),
          top: Math.floor(suggested.top)
        });
      }

      /**
       * Calls the jquery.ui.position() method on the $el of this view.
       */
      function positionToolbar () {
        that.$el
          // @see js/ducktape.position.js: modified version of jQuery UI Position!
          .position_quickedit({
            my: edge + ' bottom',
            // Move the toolbar 1px towards the start edge of the 'of' element,
            // plus any horizontal padding that may have been added to the element
            // that is being added, to prevent unwanted horizontal movement.
            at: edge + '+' + (1 + horizontalPadding) + ' top',
            of: of,
            collision: 'flipfit',
            using: refinePosition.bind(null, that),
            within: that.$fence
          })
          // Resize the toolbar to match the dimensions of the field, up to a
          // maximum width that is equal to 90% of the field's width.
          .css({
            'max-width': (document.documentElement.clientWidth < 450) ? document.documentElement.clientWidth : 450,
            // Set a minimum width of 240px for the entity toolbar, or the width
            // of the client if it is less than 240px, so that the toolbar
            // never folds up into a squashed and jumbled mess.
            'min-width': (document.documentElement.clientWidth < 240) ? document.documentElement.clientWidth : 240,
            'width': '100%'
          });
      }

      // Uses the jQuery.ui.position() method. Use a timeout to move the toolbar
      // only after the user has focused on an editable for 250ms. This prevents
      // the toolbar from jumping around the screen.
      this.timer = setTimeout(function () {
        // Render the position in the next execution cycle, so that animations on
        // the field have time to process. This is not strictly speaking, a
        // guarantee that all animations will be finished, but it's a simple way
        // to get better positioning without too much additional code.
        _.defer(positionToolbar);
      }, delay);
    },

    /**
     * Set the model state to 'saving' when the save button is clicked.
     *
     * @param jQuery event
     */
    onClickSave: function (event) {
      event.stopPropagation();
      event.preventDefault();
      // Save the model.
      this.model.set('state', 'committing');
    },

    /**
     * Sets the model state to candidate when the cancel button is clicked.
     *
     * @param jQuery event
     */
    onClickCancel: function (event) {
      event.preventDefault();
      this.model.set('state', 'deactivating');
    },

    /**
     * Clears the timeout that will eventually reposition the entity toolbar.
     *
     * Without this, it may reposition itself, away from the user's cursor!
     *
     * @param jQuery event
     */
    onMouseenter: function (event) {
      clearTimeout(this.timer);
    },

    /**
     * Builds the entity toolbar HTML; attaches to DOM; sets starting position.
     */
    buildToolbarEl: function () {
      var $toolbar = $(Drupal.theme('quickeditEntityToolbar', {
        id: 'quickedit-entity-toolbar'
      }));

      $toolbar
        .find('.quickedit-toolbar-entity')
        // Append the "ops" toolgroup into the toolbar.
        .prepend(Drupal.theme('quickeditToolgroup', {
          classes: ['ops'],
          buttons: [
            {
              label: Drupal.t('Save'),
              type: 'submit',
              classes: 'action-save quickedit-button icon',
              attributes: {
                'aria-hidden': true
              }
            },
            {
              label: Drupal.t('Close'),
              classes: 'action-cancel quickedit-button icon icon-close icon-only'
            }
          ]
        }));

      // Give the toolbar a sensible starting position so that it doesn't animate
      // on to the screen from a far off corner.
      $toolbar
        .css({
          left: this.$entity.offset().left,
          top: this.$entity.offset().top
        });

      return $toolbar;
    },

    /**
     * Returns the DOM element that fields will attach their toolbars to.
     *
     * @return jQuery
     *   The DOM element that fields will attach their toolbars to.
     */
    getToolbarRoot: function () {
      return this._fieldToolbarRoot;
    },

    /**
     * Generates a state-dependent label for the entity toolbar.
     */
    label: function () {
      // The entity label.
      var label = '';
      var entityLabel = this.model.get('label');

      // Label of an active field, if it exists.
      var activeField = Drupal.quickedit.app.model.get('activeField');
      var activeFieldLabel = activeField && activeField.get('metadata').label;
      // Label of a highlighted field, if it exists.
      var highlightedField = Drupal.quickedit.app.model.get('highlightedField');
      var highlightedFieldLabel = highlightedField && highlightedField.get('metadata').label;
      // The label is constructed in a priority order.
      if (activeFieldLabel) {
        label = Drupal.theme('quickeditEntityToolbarLabel', {
          entityLabel: entityLabel,
          fieldLabel: activeFieldLabel
        });
      }
      else if (highlightedFieldLabel) {
        label = Drupal.theme('quickeditEntityToolbarLabel', {
          entityLabel: entityLabel,
          fieldLabel: highlightedFieldLabel
        });
      }
      else {
        label = entityLabel;
      }

      this.$el
        .find('.quickedit-toolbar-label')
        .html(label);
    },

    /**
     * Adds classes to a toolgroup.
     *
     * @param String toolgroup
     *   A toolgroup name.
     * @param String classes
     *   A string of space-delimited class names that will be applied to the
     *   wrapping element of the toolbar group.
     */
    addClass: function (toolgroup, classes) {
      this._find(toolgroup).addClass(classes);
    },

    /**
     * Removes classes from a toolgroup.
     *
     * @param String toolgroup
     *   A toolgroup name.
     * @param String classes
     *   A string of space-delimited class names that will be removed from the
     *   wrapping element of the toolbar group.
     */
    removeClass: function (toolgroup, classes) {
      this._find(toolgroup).removeClass(classes);
    },

    /**
     * Finds a toolgroup.
     *
     * @param String toolgroup
     *   A toolgroup name.
     * @return jQuery
     *   The toolgroup DOM element.
     */
    _find: function (toolgroup) {
      return this.$el.find('.quickedit-toolbar .quickedit-toolgroup.' + toolgroup);
    },

    /**
     * Shows a toolgroup.
     *
     * @param String toolgroup
     *   A toolgroup name.
     */
    show: function (toolgroup) {
      this.$el.removeClass('quickedit-animate-invisible');
    }

  });

})(jQuery, _, Backbone, Drupal, Drupal.quickedit.util.debounce);
;
/**
 * @file
 * A Backbone View that provides a dynamic contextual link.
 */

(function ($, Backbone, Drupal) {

  "use strict";

  Drupal.quickedit.ContextualLinkView = Backbone.View.extend({

     events: function () {
      // Prevents delay and simulated mouse events.
      function touchEndToClick (event) {
        event.preventDefault();
        event.target.click();
      }
      return {
        'click a': function (event) {
          event.preventDefault();
          this.model.set('state', 'launching');
        },
        'touchEnd a': touchEndToClick
      };
    },

    /**
     * {@inheritdoc}
     *
     * @param Object options
     *   An object with the following keys:
     *   - Drupal.quickedit.EntityModel model: the associated entity's model
     *   - Drupal.quickedit.AppModel appModel: the application state model
     *   - strings: the strings for the "Quick edit" link
     */
    initialize: function (options) {
      // Insert the text of the quick edit toggle.
      this.$el.find('a').text(options.strings.quickEdit);
      // Initial render.
      this.render();
      // Re-render whenever this entity's isActive attribute changes.
      this.listenTo(this.model, 'change:isActive', this.render);
    },

    /**
     * {@inheritdoc}
     */
    render: function (entityModel, isActive) {
      this.$el.find('a').attr('aria-pressed', isActive);

      // Hides the contextual links if an in-place editor is active.
      this.$el.closest('.contextual-links-wrapper').toggle(!isActive);

      return this;
    }

  });

})(jQuery, Backbone, Drupal);
;
/**
 * @file
 * A Backbone View that provides an interactive toolbar (1 per in-place editor).
 */

(function ($, _, Backbone, Drupal) {

  "use strict";

  Drupal.quickedit.FieldToolbarView = Backbone.View.extend({

    // The edited element, as indicated by EditorView.getEditedElement().
    $editedElement: null,

    // A reference to the in-place editor.
    editorView: null,

    _id: null,

    /**
     * {@inheritdoc}
     */
    initialize: function (options) {
      this.$editedElement = options.$editedElement;
      this.editorView = options.editorView;
      this.$root = this.$el;

      // Generate a DOM-compatible ID for the form container DOM element.
      this._id = 'quickedit-toolbar-for-' + this.model.id.replace(/[\/\[\]]/g, '_');

      this.listenTo(this.model, 'change:state', this.stateChange)
    },

    /**
     * {@inheritdoc}
     */
    render: function () {
      // Render toolbar and set it as the view's element.
      this.setElement($(Drupal.theme('quickeditFieldToolbar', {
        id: this._id
      })));

      // Attach to the field toolbar $root element in the entity toolbar.
      this.$el.prependTo(this.$root);

      return this;
    },

    /**
     * Determines the actions to take given a change of state.
     *
     * @param Drupal.quickedit.FieldModel model
     * @param String state
     *   The state of the associated field. One of
     *   Drupal.quickedit.FieldModel.states.
     */
    stateChange: function (model, state) {
      var from = model.previous('state');
      var to = state;
      switch (to) {
        case 'inactive':
          break;
        case 'candidate':
          // Remove the view's existing element if we went to the 'activating'
          // state or later, because it will be recreated. Not doing this would
          // result in memory leaks.
          if (from !== 'inactive' && from !== 'highlighted') {
            this.$el.remove();
            this.setElement();
          }
          break;
        case 'highlighted':
          break;
        case 'activating':
          this.render();

          if (this.editorView.getQuickEditUISettings().fullWidthToolbar) {
            this.$el.addClass('quickedit-toolbar-fullwidth');
          }

          if (this.editorView.getQuickEditUISettings().unifiedToolbar) {
            this.insertWYSIWYGToolGroups();
          }
          break;
        case 'active':
          break;
        case 'changed':
          break;
        case 'saving':
          break;
        case 'saved':
          break;
        case 'invalid':
          break;
      }
    },

    /**
     * Insert WYSIWYG markup into the associated toolbar.
     */
    insertWYSIWYGToolGroups: function () {
      this.$el
        .append(Drupal.theme('quickeditToolgroup', {
          id: this.getFloatedWysiwygToolgroupId(),
          classes: ['wysiwyg-floated', 'quickedit-animate-slow', 'quickedit-animate-invisible', 'quickedit-animate-delay-veryfast'],
          buttons: []
        }))
        .append(Drupal.theme('quickeditToolgroup', {
          id: this.getMainWysiwygToolgroupId(),
          classes: ['wysiwyg-main', 'quickedit-animate-slow', 'quickedit-animate-invisible', 'quickedit-animate-delay-veryfast'],
          buttons: []
        }));

      // Animate the toolgroups into visibility.
      this.show('wysiwyg-floated');
      this.show('wysiwyg-main');
    },

    /**
     * Retrieves the ID for this toolbar's container.
     *
     * Only used to make sane hovering behavior possible.
     *
     * @return String
     *   A string that can be used as the ID for this toolbar's container.
     */
    getId: function () {
      return 'quickedit-toolbar-for-' + this._id;
    },

    /**
     * Retrieves the ID for this toolbar's floating WYSIWYG toolgroup.
     *
     * Used to provide an abstraction for any WYSIWYG editor to plug in.
     *
     * @return String
     *   A string that can be used as the ID.
     */
    getFloatedWysiwygToolgroupId: function () {
      return 'quickedit-wysiwyg-floated-toolgroup-for-' + this._id;
    },

    /**
     * Retrieves the ID for this toolbar's main WYSIWYG toolgroup.
     *
     * Used to provide an abstraction for any WYSIWYG editor to plug in.
     *
     * @return String
     *   A string that can be used as the ID.
     */
    getMainWysiwygToolgroupId: function () {
      return 'quickedit-wysiwyg-main-toolgroup-for-' + this._id;
    },

    /**
     * Finds a toolgroup.
     *
     * @param String toolgroup
     *   A toolgroup name.
     * @return jQuery
     */
    _find: function (toolgroup) {
      return this.$el.find('.quickedit-toolgroup.' + toolgroup);
    },

    /**
     * Shows a toolgroup.
     *
     * @param String toolgroup
     *   A toolgroup name.
     */
    show: function (toolgroup) {
      var $group = this._find(toolgroup);
      // Attach a transitionEnd event handler to the toolbar group so that update
      // events can be triggered after the animations have ended.
      $group.on(Drupal.quickedit.util.constants.transitionEnd, function (event) {
        $group.off(Drupal.quickedit.util.constants.transitionEnd);
      });
      // The call to remove the class and start the animation must be started in
      // the next animation frame or the event handler attached above won't be
      // triggered.
      window.setTimeout(function () {
        $group.removeClass('quickedit-animate-invisible');
      }, 0);
     }

  });

})(jQuery, _, Backbone, Drupal);
;
/**
 * @file
 * An abstract Backbone View that controls an in-place editor.
 */

(function ($, Backbone, Drupal) {

  "use strict";

  /**
   * A base implementation that outlines the structure for in-place editors.
   *
   * Specific in-place editor implementations should subclass (extend) this View
   * and override whichever method they deem necessary to override.
   *
   * Look at Drupal.quickedit.editors.form and
   * Drupal.quickedit.editors.plain_text for examples.
   *
   * @see Drupal.quickedit.EditorModel
   */
  Drupal.quickedit.EditorView = Backbone.View.extend({

    /**
     * {@inheritdoc}
     *
     * Typically you would want to override this method to set the originalValue
     * attribute in the FieldModel to such a value that your in-place editor can
     * revert to the original value when necessary.
     *
     * If you override this method, you should call this method (the parent
     * class' initialize()) first, like this:
     *   Drupal.quickedit.EditorView.prototype.initialize.call(this, options);
     *
     * For an example, @see Drupal.quickedit.editors.plain_text.
     *
     * @param Object options
     *   An object with the following keys:
     *   - Drupal.quickedit.EditorModel model: the in-place editor state model
     *   - Drupal.quickedit.FieldModel fieldModel: the field model
     */
    initialize: function (options) {
      this.fieldModel = options.fieldModel;
      this.listenTo(this.fieldModel, 'change:state', this.stateChange);
    },

    /**
     * {@inheritdoc}
     */
    remove: function () {
      // The el property is the field, which should not be removed. Remove the
      // pointer to it, then call Backbone.View.prototype.remove().
      this.setElement();
      Backbone.View.prototype.remove.call(this);
    },

    /**
     * Returns the edited element.
     *
     * For some single cardinality fields, it may be necessary or useful to
     * not in-place edit (and hence decorate) the DOM element with the
     * data-quickedit-field-id attribute (which is the field's wrapper), but a
     * specific element within the field's wrapper.
     * e.g. using a WYSIWYG editor on a body field should happen on the DOM
     * element containing the text itself, not on the field wrapper.
     *
     * For example, @see Drupal.quickedit.editors.plain_text.
     *
     * @return jQuery
     *   A jQuery-wrapped DOM element.
     */
    getEditedElement: function () {
      return this.$el;
    },

    /**
     * Returns 3 Quick Edit UI settings that depend on the in-place editor:
     *  - Boolean padding: indicates whether padding should be applied to the
     *    edited element, to guarantee legibility of text.
     *  - Boolean unifiedToolbar: provides the in-place editor with the ability to
     *    insert its own toolbar UI into Quick Edit's tightly integrated =
     *    toolbar.
     *  - Boolean fullWidthToolbar: indicates whether Quick Edit's tightly
     *    integrated toolbar should consume the full width of the element,
     *    rather than being just long enough to accommodate a label.
     */
    getQuickEditUISettings: function () {
      return { padding: false, unifiedToolbar: false, fullWidthToolbar: false, popup: false };
    },

    /**
     * Determines the actions to take given a change of state.
     *
     * @param Drupal.quickedit.FieldModel fieldModel
     * @param String state
     *   The state of the associated field. One of
     *   Drupal.quickedit.FieldModel.states.
     */
    stateChange: function (fieldModel, state) {
      var from = fieldModel.previous('state');
      var to = state;
      switch (to) {
        case 'inactive':
          // An in-place editor view will not yet exist in this state, hence
          // this will never be reached. Listed for sake of completeness.
          break;
        case 'candidate':
          // Nothing to do for the typical in-place editor: it should not be
          // visible yet.

          // Except when we come from the 'invalid' state, then we clean up.
          if (from === 'invalid') {
            this.removeValidationErrors();
          }
          break;
        case 'highlighted':
          // Nothing to do for the typical in-place editor: it should not be
          // visible yet.
          break;
        case 'activating':
          // The user has indicated he wants to do in-place editing: if
          // something needs to be loaded (CSS/JavaScript/server data/…), then
          // do so at this stage, and once the in-place editor is ready,
          // set the 'active' state.
          // A "loading" indicator will be shown in the UI for as long as the
          // field remains in this state.
          var loadDependencies = function (callback) {
            // Do the loading here.
            callback();
          };
          loadDependencies(function () {
            fieldModel.set('state', 'active');
          });
          break;
        case 'active':
          // The user can now actually use the in-place editor.
          break;
        case 'changed':
          // Nothing to do for the typical in-place editor. The UI will show an
          // indicator that the field has changed.
          break;
        case 'saving':
          // When the user has indicated he wants to save his changes to this
          // field, this state will be entered.
          // If the previous saving attempt resulted in validation errors, the
          // previous state will be 'invalid'. Clean up those validation errors
          // while the user is saving.
          if (from === 'invalid') {
            this.removeValidationErrors();
          }
          this.save();
          break;
        case 'saved':
          // Nothing to do for the typical in-place editor. Immediately after
          // being saved, a field will go to the 'candidate' state, where it
          // should no longer be visible (after all, the field will then again
          // just be a *candidate* to be in-place edited).
          break;
        case 'invalid':
          // The modified field value was attempted to be saved, but there were
          // validation errors.
          this.showValidationErrors();
          break;
      }
    },

    /**
     * Reverts the modified value back to the original value (before editing
     * started).
     */
    revert: function () {
      // A no-op by default; each editor should implement reverting itself.

      // Note that if the in-place editor does not cause the FieldModel's
      // element to be modified, then nothing needs to happen.
    },

    /**
     * Saves the modified value in the in-place editor for this field.
     */
    save: function () {
      var fieldModel = this.fieldModel;
      var editorModel = this.model;
      var backstageId = 'quickedit_backstage-' + this.fieldModel.id.replace(/[\/\[\]\_\s]/g, '-');

      function fillAndSubmitForm (value) {
        var $form = $('#' + backstageId).find('form');
        // Fill in the value in any <input> that isn't hidden or a submit
        // button.
        $form.find(':input[type!="hidden"][type!="submit"]:not(select)')
          // Don't mess with the node summary.
          .not('[name$="\\[summary\\]"]').val(value);
        // Submit the form.
        $form.find('.quickedit-form-submit').trigger('click.quickedit');
      }

      var formOptions = {
        fieldID: this.fieldModel.get('fieldID'),
        $el: this.$el,
        nocssjs: true,
        other_view_modes: fieldModel.findOtherViewModes(),
        // Reset an existing entry for this entity in the TempStore (if any) when
        // saving the field. Logically speaking, this should happen in a separate
        // request because this is an entity-level operation, not a field-level
        // operation. But that would require an additional request, that might not
        // even be necessary: it is only when a user saves a first changed field
        // for an entity that this needs to happen: precisely now!
        reset: !this.fieldModel.get('entity').get('inTempStore')
      };

      var self = this;
      Drupal.quickedit.util.form.load(formOptions, function (form, ajax) {
        // Create a backstage area for storing forms that are hidden from view
        // (hence "backstage" — since the editing doesn't happen in the form, it
        // happens "directly" in the content, the form is only used for saving).
        var $backstage = $(Drupal.theme('quickeditBackstage', { id: backstageId })).appendTo('body');
        // Hidden forms are stuffed into the backstage container for this field.
        var $form = $(form).appendTo($backstage);
        // Disable the browser's HTML5 validation; we only care about server-
        // side validation. (Not disabling this will actually cause problems
        // because browsers don't like to set HTML5 validation errors on hidden
        // forms.)
        $form.prop('novalidate', true);
        var $submit = $form.find('.quickedit-form-submit');
        self.formSaveAjax = Drupal.quickedit.util.form.ajaxifySaving(formOptions, $submit);

        function removeHiddenForm () {
          Drupal.quickedit.util.form.unajaxifySaving(self.formSaveAjax);
          delete self.formSaveAjax;
          $backstage.remove();
        }

        // Work-around for https://drupal.org/node/2019481 in Drupal 7.
        self.formSaveAjax.commands = {};

        // Successfully saved.
        self.formSaveAjax.commands.quickeditFieldFormSaved = function (ajax, response, status) {
          removeHiddenForm();
          // First, transition the state to 'saved'. Also set the
          // 'htmlForOtherViewModes' attribute, so that when this field is
          // rerendered, the change can be propagated to other instances of this
          // field, which may be displayed in different view modes.
          fieldModel.set({
            'state': 'saved',
            'htmlForOtherViewModes': response.other_view_modes
          });
          // Then, set the 'html' attribute on the field model. This will cause
          // the field to be rerendered.
          fieldModel.set('html', response.data);
        };

        // Unsuccessfully saved; validation errors.
        self.formSaveAjax.commands.quickeditFieldFormValidationErrors = function (ajax, response, status) {
          removeHiddenForm();
          editorModel.set('validationErrors', response.data);
          fieldModel.set('state', 'invalid');
        };

        // The quickeditFieldForm AJAX command is only called upon loading the
        // form for the first time, and when there are validation errors in the
        // form; Form API then marks which form items have errors. This is
        // useful for the form-based in-place editor, but pointless for any
        // other: the form itself won't be visible at all anyway! So, we just
        // ignore it.
        self.formSaveAjax.commands.quickeditFieldForm = function () {};

        fillAndSubmitForm(editorModel.get('currentValue'));
      });
    },

    /**
     * Shows validation error messages.
     *
     * Should be called when the state is changed to 'invalid'.
     */
    showValidationErrors: function () {
      var $errors = $('<div class="quickedit-validation-errors"></div>')
        .append(this.model.get('validationErrors'));
      this.getEditedElement()
        .addClass('quickedit-validation-error')
        .after($errors);
    },

    /**
     * Cleans up validation error messages.
     *
     * Should be called when the state is changed to 'candidate' or 'saving'. In
     * the case of the latter: the user has modified the value in the in-place
     * editor again to attempt to save again. In the case of the latter: the
     * invalid value was discarded.
     */
    removeValidationErrors: function () {
      this.getEditedElement()
        .removeClass('quickedit-validation-error')
        .next('.quickedit-validation-errors')
        .remove();
    }

  });

}(jQuery, Backbone, Drupal));
;
/**
 * @file
 * A Backbone View that provides an interactive modal.
 */
(function ($, Backbone, Drupal) {

  "use strict";

  Drupal.quickedit.ModalView = Backbone.View.extend({

    message: null,
    buttons: null,
    callback: null,
    $elementsToHide: null,

    events: {
      'click button': 'onButtonClick'
    },

    /**
     * {@inheritdoc}
     *
     * @param Object options
     *   An object with the following keys:
     *   - String message: a message to show in the modal.
     *   - Array buttons: a set of buttons with 'action's defined, ready to be
     *     passed to Drupal.theme.quickeditButtons().
     *   - Function callback: a callback that will receive the 'action' of the
     *     clicked button.
     *
     * @see Drupal.theme.quickeditModal()
     * @see Drupal.theme.quickeditButtons()
     */
    initialize: function (options) {
      this.message = options.message;
      this.buttons = options.buttons;
      this.callback = options.callback;
    },

    /**
     * {@inheritdoc}
     */
    render: function () {
      this.setElement(Drupal.theme('quickeditModal', {}));
      this.$el.appendTo('body');
      // Template.
      this.$('.main p').html(this.message);
      var $actions = $(Drupal.theme('quickeditButtons', { 'buttons' : this.buttons}));
      this.$('.actions').append($actions);

      // Show the modal with an animation.
      var that = this;
      setTimeout(function () {
        that.$el.removeClass('quickedit-animate-invisible');
      }, 0);
    },

    /**
     * Passes the clicked button action to the callback; closes the modal.
     *
     * @param jQuery event
     */
    onButtonClick: function (event) {
      event.stopPropagation();
      event.preventDefault();

      // Remove after animation.
      var that = this;
      this.$el
        .addClass('quickedit-animate-invisible')
        .on(Drupal.quickedit.util.constants.transitionEnd, function (e) {
          that.remove();
        });

      var action = $(event.target).attr('data-quickedit-modal-action');
      return this.callback(action);
    }

  });

})(jQuery, Backbone, Drupal);
;
/**
 * @file
 * Provides overridable theme functions for all of Quick Edit's client-side HTML.
 */

(function ($, Drupal) {

  "use strict";

  /**
   * Theme function for a "backstage" for the Quick Edit module.
   *
   * @param Object settings
   *   An object with the following keys:
   *   - String id: the id to apply to the backstage.
   * @return String
   *   The corresponding HTML.
   */
  Drupal.theme.prototype.quickeditBackstage = function (settings) {
    var html = '';
    html += '<div id="' + settings.id + '" />';
    return html;
  };

  /**
   * Theme function for a toolbar container of the Quick Edit module.
   *
   * @param Object settings
   *   An object with the following keys:
   *   - String id: the id to apply to the toolbar container.
   * @return String
   *   The corresponding HTML.
   */
  Drupal.theme.prototype.quickeditEntityToolbar = function (settings) {
    var html = '';
    html += '<div id="' + settings.id + '" class="quickedit quickedit-toolbar-container clearfix">';
    html += '<i class="quickedit-toolbar-pointer"></i>';
    html += '<div class="quickedit-toolbar-content">';
    html += '<div class="quickedit-toolbar quickedit-toolbar-entity clearfix icon icon-pencil">';
    html += '<div class="quickedit-toolbar-label" />';
    html += '</div>';
    html += '<div class="quickedit-toolbar quickedit-toolbar-field clearfix" />';
    html += '</div><div class="quickedit-toolbar-lining"></div></div>';
    return html;
  };

  /**
   * Theme function for a toolbar container of the Quick Edit module.
   *
   * @param Object settings
   *   An object with the following keys:
   *   - String entityLabel: The title of the active entity.
   *   - String fieldLabel: The label of the highlighted or active field.
   * @return String
   *   The corresponding HTML.
   */
  Drupal.theme.prototype.quickeditEntityToolbarLabel = function (settings) {
    return '<span class="field">' + settings.fieldLabel + '</span>' + settings.entityLabel;
  };

  /**
   * Element that defines a containing box of the placement of the entity toolbar.
   *
   * @return String
   *   The corresponding HTML.
   */
  Drupal.theme.prototype.quickeditEntityToolbarFence = function () {
    return '<div id="quickedit-toolbar-fence" />';
  };

  /**
   * Theme function for a toolbar container of the Quick Edit module.
   *
   * @param settings
   *   An object with the following keys:
   *   - id: the id to apply to the toolbar container.
   * @return
   *   The corresponding HTML.
   */
  Drupal.theme.prototype.quickeditFieldToolbar = function (settings) {
    return '<div id="' + settings.id + '" />';
  };

  /**
   * Theme function for a toolbar toolgroup of the Quick Edit module.
   *
   * @param Object settings
   *   An object with the following keys:
   *   - String id: (optional) the id of the toolgroup
   *   - String classes: the class of the toolgroup.
   *   - Array buttons: @see Drupal.theme.prototype.quickeditButtons().
   * @return String
   *   The corresponding HTML.
   */
  Drupal.theme.prototype.quickeditToolgroup = function (settings) {
    // Classes.
    var classes = (settings.classes || []);
    classes.unshift('quickedit-toolgroup');
    var html = '';
    html += '<div class="' + classes.join(' ') + '"';
    if (settings.id) {
      html += ' id="' + settings.id + '"';
    }
    html += '>';
    html += Drupal.theme('quickeditButtons', { buttons: settings.buttons });
    html += '</div>';
    return html;
  };

  /**
   * Theme function for buttons of the Quick Edit module.
   *
   * Can be used for the buttons both in the toolbar toolgroups and in the modal.
   *
   * @param Object settings
   *   An object with the following keys:
   *   - buttons: an array of objects with the following keys:
   *     - String type: the type of the button (defaults to 'button')
   *     - Array classes: the classes of the button.
   *     - String label: the label of the button.
   *     - String action: sets a data-quickedit-modal-action attribute.
   * @return String
   *   The corresponding HTML.
   */
  Drupal.theme.prototype.quickeditButtons = function (settings) {
    var html = '';
    for (var i = 0; i < settings.buttons.length; i++) {
      var button = settings.buttons[i];
      if (!button.hasOwnProperty('type')) {
        button.type = 'button';
      }
      // Attributes.
      var attributes = [];
      var attrMap  = settings.buttons[i].attributes || {};
      for (var attr in attrMap) {
        if (attrMap.hasOwnProperty(attr)) {
          attributes.push(attr + ((attrMap[attr]) ? '="' + attrMap[attr] + '"' : '' ));
        }
      }
      html += '<button type="' + button.type + '" class="' + button.classes + '"'  + ' ' + attributes.join(' ');
      html += ((button.action) ? ' data-quickedit-modal-action="' + button.action + '"' : '');
      html += '>';
      html += button.label;
      html += '</button>';
    }
    return html;
  };

  /**
   * Theme function for a form container of the Quick Edit module.
   *
   * @param Object settings
   *   An object with the following keys:
   *   - String id: the id to apply to the toolbar container.
   *   - String loadingMsg: The message to show while loading.
   * @return String
   *   The corresponding HTML.
   */
  Drupal.theme.prototype.quickeditFormContainer = function (settings) {
    var html = '';
    html += '<div id="' + settings.id + '" class="quickedit-form-container">';
    html += '  <div class="quickedit-form">';
    html += '    <div class="placeholder">';
    html +=        settings.loadingMsg;
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
    return html;
  };

  /**
   * Theme function for a modal of the Quick Edit module.
   *
   * @param Object settings
   *   An object with the following keys:
   *   - String dialogClass: a class to apply to the modal dialog
   *   -
   *
   * @return String
   *   The corresponding HTML.
   */
  Drupal.theme.prototype.quickeditModal = function () {
    var classes = 'quickedit-animate-slow quickedit-animate-invisible quickedit-animate-delay-veryfast';
    var html = '';
    html += '<div id="quickedit_modal" class="' + classes + '" role="dialog">';
    html += '  <div class="main"><p></p></div>';
    html += '  <div class="actions"></div>';
    html += '</div>';
    return html;
  };

})(jQuery, Drupal);
;
/*!
 * jQuery UI Position 1.10.2
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 *
 * NOTE: Modified to live at $.fn.position_quickedit rather than $.fn.position!
 */
(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
  max = Math.max,
  abs = Math.abs,
  round = Math.round,
  rhorizontal = /left|center|right/,
  rvertical = /top|center|bottom/,
  roffset = /[\+\-]\d+(\.[\d]+)?%?/,
  rposition = /^\w+/,
  rpercent = /%$/,
  _position = $.fn.position_quickedit;

function getOffsets( offsets, width, height ) {
  return [
    parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
    parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
  ];
}

function parseCss( element, property ) {
  return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
  var raw = elem[0];
  if ( raw.nodeType === 9 ) {
    return {
      width: elem.width(),
      height: elem.height(),
      offset: { top: 0, left: 0 }
    };
  }
  if ( $.isWindow( raw ) ) {
    return {
      width: elem.width(),
      height: elem.height(),
      offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
    };
  }
  if ( raw.preventDefault ) {
    return {
      width: 0,
      height: 0,
      offset: { top: raw.pageY, left: raw.pageX }
    };
  }
  return {
    width: elem.outerWidth(),
    height: elem.outerHeight(),
    offset: elem.offset()
  };
}

$.position_quickedit = {
  scrollbarWidth: function() {
    if ( cachedScrollbarWidth !== undefined ) {
      return cachedScrollbarWidth;
    }
    var w1, w2,
      div = $( "<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
      innerDiv = div.children()[0];

    $( "body" ).append( div );
    w1 = innerDiv.offsetWidth;
    div.css( "overflow", "scroll" );

    w2 = innerDiv.offsetWidth;

    if ( w1 === w2 ) {
      w2 = div[0].clientWidth;
    }

    div.remove();

    return (cachedScrollbarWidth = w1 - w2);
  },
  getScrollInfo: function( within ) {
    var overflowX = within.isWindow ? "" : within.element.css( "overflow-x" ),
      overflowY = within.isWindow ? "" : within.element.css( "overflow-y" ),
      hasOverflowX = overflowX === "scroll" ||
        ( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
      hasOverflowY = overflowY === "scroll" ||
        ( overflowY === "auto" && within.height < within.element[0].scrollHeight );
    return {
      width: hasOverflowY ? $.position_quickedit.scrollbarWidth() : 0,
      height: hasOverflowX ? $.position_quickedit.scrollbarWidth() : 0
    };
  },
  getWithinInfo: function( element ) {
    var withinElement = $( element || window ),
      isWindow = $.isWindow( withinElement[0] );
    return {
      element: withinElement,
      isWindow: isWindow,
      offset: withinElement.offset() || { left: 0, top: 0 },
      scrollLeft: withinElement.scrollLeft(),
      scrollTop: withinElement.scrollTop(),
      width: isWindow ? withinElement.width() : withinElement.outerWidth(),
      height: isWindow ? withinElement.height() : withinElement.outerHeight()
    };
  }
};

$.fn.position_quickedit = function( options ) {
  if ( !options || !options.of ) {
    return _position.apply( this, arguments );
  }

  // make a copy, we don't want to modify arguments
  options = $.extend( {}, options );

  var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
    target = $( options.of ),
    within = $.position_quickedit.getWithinInfo( options.within ),
    scrollInfo = $.position_quickedit.getScrollInfo( within ),
    collision = ( options.collision || "flip" ).split( " " ),
    offsets = {};

  dimensions = getDimensions( target );
  if ( target[0].preventDefault ) {
    // force left top to allow flipping
    options.at = "left top";
  }
  targetWidth = dimensions.width;
  targetHeight = dimensions.height;
  targetOffset = dimensions.offset;
  // clone to reuse original targetOffset later
  basePosition = $.extend( {}, targetOffset );

  // force my and at to have valid horizontal and vertical positions
  // if a value is missing or invalid, it will be converted to center
  $.each( [ "my", "at" ], function() {
    var pos = ( options[ this ] || "" ).split( " " ),
      horizontalOffset,
      verticalOffset;

    if ( pos.length === 1) {
      pos = rhorizontal.test( pos[ 0 ] ) ?
        pos.concat( [ "center" ] ) :
        rvertical.test( pos[ 0 ] ) ?
          [ "center" ].concat( pos ) :
          [ "center", "center" ];
    }
    pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
    pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

    // calculate offsets
    horizontalOffset = roffset.exec( pos[ 0 ] );
    verticalOffset = roffset.exec( pos[ 1 ] );
    offsets[ this ] = [
      horizontalOffset ? horizontalOffset[ 0 ] : 0,
      verticalOffset ? verticalOffset[ 0 ] : 0
    ];

    // reduce to just the positions without the offsets
    options[ this ] = [
      rposition.exec( pos[ 0 ] )[ 0 ],
      rposition.exec( pos[ 1 ] )[ 0 ]
    ];
  });

  // normalize collision option
  if ( collision.length === 1 ) {
    collision[ 1 ] = collision[ 0 ];
  }

  if ( options.at[ 0 ] === "right" ) {
    basePosition.left += targetWidth;
  } else if ( options.at[ 0 ] === "center" ) {
    basePosition.left += targetWidth / 2;
  }

  if ( options.at[ 1 ] === "bottom" ) {
    basePosition.top += targetHeight;
  } else if ( options.at[ 1 ] === "center" ) {
    basePosition.top += targetHeight / 2;
  }

  atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
  basePosition.left += atOffset[ 0 ];
  basePosition.top += atOffset[ 1 ];

  return this.each(function() {
    var collisionPosition, using,
      elem = $( this ),
      elemWidth = elem.outerWidth(),
      elemHeight = elem.outerHeight(),
      marginLeft = parseCss( this, "marginLeft" ),
      marginTop = parseCss( this, "marginTop" ),
      collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
      collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
      position = $.extend( {}, basePosition ),
      myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

    if ( options.my[ 0 ] === "right" ) {
      position.left -= elemWidth;
    } else if ( options.my[ 0 ] === "center" ) {
      position.left -= elemWidth / 2;
    }

    if ( options.my[ 1 ] === "bottom" ) {
      position.top -= elemHeight;
    } else if ( options.my[ 1 ] === "center" ) {
      position.top -= elemHeight / 2;
    }

    position.left += myOffset[ 0 ];
    position.top += myOffset[ 1 ];

    // if the browser doesn't support fractions, then round for consistent results
    if ( !$.support.offsetFractions ) {
      position.left = round( position.left );
      position.top = round( position.top );
    }

    collisionPosition = {
      marginLeft: marginLeft,
      marginTop: marginTop
    };

    $.each( [ "left", "top" ], function( i, dir ) {
      if ( $.ui.position_quickedit[ collision[ i ] ] ) {
        $.ui.position_quickedit[ collision[ i ] ][ dir ]( position, {
          targetWidth: targetWidth,
          targetHeight: targetHeight,
          elemWidth: elemWidth,
          elemHeight: elemHeight,
          collisionPosition: collisionPosition,
          collisionWidth: collisionWidth,
          collisionHeight: collisionHeight,
          offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
          my: options.my,
          at: options.at,
          within: within,
          elem : elem
        });
      }
    });

    if ( options.using ) {
      // adds feedback as second argument to using callback, if present
      using = function( props ) {
        var left = targetOffset.left - position.left,
          right = left + targetWidth - elemWidth,
          top = targetOffset.top - position.top,
          bottom = top + targetHeight - elemHeight,
          feedback = {
            target: {
              element: target,
              left: targetOffset.left,
              top: targetOffset.top,
              width: targetWidth,
              height: targetHeight
            },
            element: {
              element: elem,
              left: position.left,
              top: position.top,
              width: elemWidth,
              height: elemHeight
            },
            horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
            vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
          };
        if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
          feedback.horizontal = "center";
        }
        if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
          feedback.vertical = "middle";
        }
        if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
          feedback.important = "horizontal";
        } else {
          feedback.important = "vertical";
        }
        options.using.call( this, props, feedback );
      };
    }

    elem.offset( $.extend( position, { using: using } ) );
  });
};

$.ui.position_quickedit = {
  fit: {
    left: function( position, data ) {
      var within = data.within,
        withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
        outerWidth = within.width,
        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
        overLeft = withinOffset - collisionPosLeft,
        overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
        newOverRight;

      // element is wider than within
      if ( data.collisionWidth > outerWidth ) {
        // element is initially over the left side of within
        if ( overLeft > 0 && overRight <= 0 ) {
          newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
          position.left += overLeft - newOverRight;
        // element is initially over right side of within
        } else if ( overRight > 0 && overLeft <= 0 ) {
          position.left = withinOffset;
        // element is initially over both left and right sides of within
        } else {
          if ( overLeft > overRight ) {
            position.left = withinOffset + outerWidth - data.collisionWidth;
          } else {
            position.left = withinOffset;
          }
        }
      // too far left -> align with left edge
      } else if ( overLeft > 0 ) {
        position.left += overLeft;
      // too far right -> align with right edge
      } else if ( overRight > 0 ) {
        position.left -= overRight;
      // adjust based on position and margin
      } else {
        position.left = max( position.left - collisionPosLeft, position.left );
      }
    },
    top: function( position, data ) {
      var within = data.within,
        withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
        outerHeight = data.within.height,
        collisionPosTop = position.top - data.collisionPosition.marginTop,
        overTop = withinOffset - collisionPosTop,
        overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
        newOverBottom;

      // element is taller than within
      if ( data.collisionHeight > outerHeight ) {
        // element is initially over the top of within
        if ( overTop > 0 && overBottom <= 0 ) {
          newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
          position.top += overTop - newOverBottom;
        // element is initially over bottom of within
        } else if ( overBottom > 0 && overTop <= 0 ) {
          position.top = withinOffset;
        // element is initially over both top and bottom of within
        } else {
          if ( overTop > overBottom ) {
            position.top = withinOffset + outerHeight - data.collisionHeight;
          } else {
            position.top = withinOffset;
          }
        }
      // too far up -> align with top
      } else if ( overTop > 0 ) {
        position.top += overTop;
      // too far down -> align with bottom edge
      } else if ( overBottom > 0 ) {
        position.top -= overBottom;
      // adjust based on position and margin
      } else {
        position.top = max( position.top - collisionPosTop, position.top );
      }
    }
  },
  flip: {
    left: function( position, data ) {
      var within = data.within,
        withinOffset = within.offset.left + within.scrollLeft,
        outerWidth = within.width,
        offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
        overLeft = collisionPosLeft - offsetLeft,
        overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
        myOffset = data.my[ 0 ] === "left" ?
          -data.elemWidth :
          data.my[ 0 ] === "right" ?
            data.elemWidth :
            0,
        atOffset = data.at[ 0 ] === "left" ?
          data.targetWidth :
          data.at[ 0 ] === "right" ?
            -data.targetWidth :
            0,
        offset = -2 * data.offset[ 0 ],
        newOverRight,
        newOverLeft;

      if ( overLeft < 0 ) {
        newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
        if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
          position.left += myOffset + atOffset + offset;
        }
      }
      else if ( overRight > 0 ) {
        newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
        if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
          position.left += myOffset + atOffset + offset;
        }
      }
    },
    top: function( position, data ) {
      var within = data.within,
        withinOffset = within.offset.top + within.scrollTop,
        outerHeight = within.height,
        offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
        collisionPosTop = position.top - data.collisionPosition.marginTop,
        overTop = collisionPosTop - offsetTop,
        overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
        top = data.my[ 1 ] === "top",
        myOffset = top ?
          -data.elemHeight :
          data.my[ 1 ] === "bottom" ?
            data.elemHeight :
            0,
        atOffset = data.at[ 1 ] === "top" ?
          data.targetHeight :
          data.at[ 1 ] === "bottom" ?
            -data.targetHeight :
            0,
        offset = -2 * data.offset[ 1 ],
        newOverTop,
        newOverBottom;
      if ( overTop < 0 ) {
        newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
        if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
          position.top += myOffset + atOffset + offset;
        }
      }
      else if ( overBottom > 0 ) {
        newOverTop = position.top -  data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
        if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
          position.top += myOffset + atOffset + offset;
        }
      }
    }
  },
  flipfit: {
    left: function() {
      $.ui.position_quickedit.flip.left.apply( this, arguments );
      $.ui.position_quickedit.fit.left.apply( this, arguments );
    },
    top: function() {
      $.ui.position_quickedit.flip.top.apply( this, arguments );
      $.ui.position_quickedit.fit.top.apply( this, arguments );
    }
  }
};

// fraction support test
(function () {
  var testElement, testElementParent, testElementStyle, offsetLeft, i,
    body = document.getElementsByTagName( "body" )[ 0 ],
    div = document.createElement( "div" );

  //Create a "fake body" for testing based on method used in jQuery.support
  testElement = document.createElement( body ? "div" : "body" );
  testElementStyle = {
    visibility: "hidden",
    width: 0,
    height: 0,
    border: 0,
    margin: 0,
    background: "none"
  };
  if ( body ) {
    $.extend( testElementStyle, {
      position: "absolute",
      left: "-1000px",
      top: "-1000px"
    });
  }
  for ( i in testElementStyle ) {
    testElement.style[ i ] = testElementStyle[ i ];
  }
  testElement.appendChild( div );
  testElementParent = body || document.documentElement;
  testElementParent.insertBefore( testElement, testElementParent.firstChild );

  div.style.cssText = "position: absolute; left: 10.7432222px;";

  offsetLeft = $( div ).offset().left;
  $.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

  testElement.innerHTML = "";
  testElementParent.removeChild( testElement );
})();

}( jQuery ) );
;
/**
 * @file
 * Provide a helper tab for easier in-place editing.
 */

(function ($, Backbone, Drupal, undefined) {

"use strict";

Drupal.behaviors.quickEditTab = {
  attach: function (context) {
    // Use backbone in scenarios where navbar tab is used.
    var $body = $(window.parent.document.body).once('quickedit-tab');
    if ($body.length) {
      var tabModel = Drupal.quickEditTab.models.tabModel = new Drupal.quickEditTab.TabStateModel();
      var $tab = $('#quickedit-navbar-tab').once('quickedit-tab');
      if ($tab.length > 0) {
        Drupal.quickEditTab.views.tabView = new Drupal.quickEditTab.TabView({
          el: $tab.get(),
          model: tabModel
        });
      }
    }
  }
};

Drupal.quickEditTab = {

  // Storage for view and model instances.
  models: {},
  views: {},

  // Backbone Model for the navbar tab state.
  TabStateModel: Backbone.Model.extend({
    defaults: {
      // Track how many in-place editable entities exist on the page.
      entityCount: 0,
      // The entity currently being in-place edited, if any.
      activeEntity: null,
      // The contextual links triggers are visible. (This only happens when
      // there are multiple in-place editable entities on the page.)
      contextualLinksTriggersVisible: false,
      // When there is either an active entity, or contextual links triggers are
      // visible, we consider the tab "active".
      isActive: false
    }
  }),

  // Handles the navbar tab interactions.
  TabView: Backbone.View.extend({
    events: {
      'click #quickedit-trigger-link': 'toggleQuickEdit'
    },

    /**
     * {@inheritdoc}
     */
    initialize: function (options) {
      this.listenTo(this.model, {
        'change:activeEntity change:contextualLinksTriggersVisible': this.updateActiveness,
        'change:entityCount change:isActive': this.render,
        'change:contextualLinksTriggersVisible': this.renderContextualLinkTriggers
      });

      this.listenTo(Drupal.quickedit.collections.entities, {
        'add remove reset': this.countEntities,
        'change:state': this.entityStateChange
      });
      // In Drupal 7, we cannot use asset library dependencies to make this
      // JavaScript execute before quickedit.module's, so upon initialization we need
      // to update the entity count manually.
      this.model.set('entityCount', Drupal.quickedit.collections.entities.length);
    },

    /**
     * Toggle in-place editing.
     */
    toggleQuickEdit: function () {
      // Activate!
      if (!this.model.get('isActive')) {
        // If there's only one in-place editable entity, start in-place editing.
        var editableEntities = Drupal.quickedit.collections.entities;
        if (editableEntities.length === 1) {
          editableEntities.at(0).set('state', 'launching');
        }
        // Otherwise, show all contextual links triggers.
        else {
          this.model.set('contextualLinksTriggersVisible', true);
        }
      }
      // Deactivate!
      else {
        // If there's an entity being in-place edited, stop in-place editing.
        var activeEntity = this.model.get('activeEntity');
        if (activeEntity) {
          activeEntity.set('state', 'deactivating');
        }
        // Otherwise, hide all contextual links triggers.
        else {
          this.model.set('contextualLinksTriggersVisible', false);
        }
      }
    },

    /**
     * Tracks the number of in-place editable entities on the page.
     *
     * @param Drupal.quickedit.EntityModel entityModel
     *   The entity model that was added or removed.
     * @param Drupal.quickedit.EntityCollection entityCollection
     *    The collection of entity models.
     */
    countEntities: function (entityModel, entityCollection) {
      this.model.set('entityCount', entityCollection.length);
    },

    /**
     * Tracks whether an entity is actively being in-place edited, and if that's
     * the case, hide all contextual links triggers.
     *
     * @param Drupal.quickedit.EntityModel entityModel
     *   The entity model that whose state has changed.
     * @param String state
     *   One of Drupal.quickedit.EntityModel.states.
     */
    entityStateChange: function (entityModel, state) {
      if (state === 'opened') {
        this.model.set('activeEntity', entityModel);
        this.model.set('contextualLinksTriggersVisible', false);
      }
      else if (state === 'closed') {
        this.model.set('activeEntity', null);
      }
    },

    /**
     * Update activeness based on two factors, makes it
     */
    updateActiveness: function () {
      // We mark the toolbar tab as active when either an entity is being edited
      // in-place, or we're showing all contextual links triggers.
      var hasActiveEntity = !!this.model.get('activeEntity');
      this.model.set('isActive', hasActiveEntity || this.model.get('contextualLinksTriggersVisible'));
    },

    /**
     * Renders visibility & activeness of tab.
     */
    render: function () {
      this.$el.toggleClass('element-invisible', this.model.get('entityCount') === 0);
      this.$el.toggleClass('active', this.model.get('isActive'));
      return this;
    },

    /**
     * Renders contextual links triggers visibility.
     */
    renderContextualLinkTriggers: function (model, show) {
      var classes = 'contextual-links-trigger-active quickedit-contextual-link';
      Drupal.quickedit.collections.entities.forEach(function (editableEntity) {
        var contextualLinkView = editableEntity.get('contextualLinkView');
        contextualLinkView.$el
          .closest('.contextual-links-wrapper')
          .find('.contextual-links-trigger')
          .toggleClass(classes, show);
      });
    }

  })

};

}(jQuery, Backbone, Drupal));
;
'use strict';

(function (Drupal) {

  Drupal.personalizeStorage = (function() {

    var keyListKey = 'personalize::storage::keys';

    /**
     * Determine the kind of storage to use based on session type requested.
     *
     * @param session
     *   True if session storage, false if local storage.  Defaults true.
     */
    function _getStore(session) {
      session = session === undefined ? true : session;
      return session ? sessionStorage : localStorage;
    }

    /**
     * Gets the listing of keys and the order in which they were added.
     *
     * @param key
     *   The key of the item saved to storage
     * @param session
     *   True if session storage, false if local storage.  Defaults true.
     */
    function _getTrackedKeys(session) {
      var store = _getStore(session);
      var keys = store.getItem(keyListKey);
      if (keys) {
        keys = JSON.parse(keys);
      } else {
        keys = [];
      }
      return keys;
    }

    /**
     * Add key to the end of the key list.
     *
     * @param key
     *   The key of the item add to storage
     * @param session
     *   True if session storage, false if local storage.  Defaults true.
     */
    function _addToKeyList(key, session) {
      var store = _getStore(session);
      var keys = _getTrackedKeys(session);
      keys.push(key);
      store.setItem(keyListKey, JSON.stringify(keys));
    }

    /**
     * Remove key from the key list.
     *
     * @param key
     *   The key of the item saved to storage
     * @param session
     *   True if session storage, false if local storage. Defaults true.
     */
    function _removeFromKeyList(key, session) {
      var store = _getStore(session);
      var keys = _getTrackedKeys(session);
      var index = keys.indexOf(key);
      if (index > -1) {
        keys.splice(index, 1);
      }
      store.setItem(keyListKey, JSON.stringify(keys));
    }

    /**
     * Prunes the oldest key(s) from storage.
     *
     * @param session
     *   True if session storage, false if local storage.  Defaults true.
     * @param numEntries
     *   The number of entries to remove.  Default = 10.
     */
    function _pruneOldest(session, numEntries) {
      numEntries = numEntries || 10;
      var keys = _getTrackedKeys(session);
      var totalKeys = keys.length;
      var until = totalKeys > numEntries ? totalKeys - numEntries : 0;
      var key, i;

      for (i = totalKeys; i >= until; i--) {
        key = keys.pop();
        _remove(key, session);
      }
    }

    /**
     * Writes an item to storage.
     *
     * @param key
     *   The bucket-specific key to use to store the item.
     * @param value
     *   The value to store (in any format that JSON.stringify can handle).
     * @param session
     *   True if session storage, false if local storage.  Defaults true.
     */
    function _write(key, value, session) {
      var store = _getStore(session);
      store.setItem(key, JSON.stringify(value));
      _addToKeyList(key, session);
    }

    /**
     * Removes an item from storage.
     *
     * @param key
     *   The bucket-specific key to use to remove the item.
     * @param session
     *   True if session storage, false if local storage.  Defaults true.
     */
    function _remove(key, session) {
      var store = _getStore(session);
      store.removeItem(key);
      _removeFromKeyList(key, session);
    }

    return {
      keyListKey: keyListKey,

      /**
       * Determine if the current browser supports web storage.
       * @return
       *   True if the current browser supports local storage, false otherwise.
       */
      supportsLocalStorage: function() {
        if (this.supportsHtmlLocalStorage !== undefined) {
          return this.supportsHtmlLocalStorage;
        }
        try {
          this.supportsHtmlLocalStorage = window.hasOwnProperty('localStorage') && window.localStorage !== null;
        } catch (e) {
          this.supportsHtmlLocalStorage = false;
        }
        return this.supportsHtmlLocalStorage;
      },

      /**
       * Reads an item from storage.
       *
       * @param key
       *   The bucket-specific key to use to lookup the item.
       * @param session
       *   True if session storage, false if local storage.  Defaults true.
       * @return
       *   The value set for the key or null if not available.
       */
      read: function (key, session) {
        if (!this.supportsLocalStorage()) { return null; }

        var store = _getStore(session),
            stored = store.getItem(key),
            record;
        if (stored) {
          record = JSON.parse(stored);
          if (record !== undefined) {
            return record;
          }
        }
        return null;
      },

      /**
       * Writes an item to the bucket.
       *
       * @param key
       *   The bucket-specific key to use to store the item.
       * @param value
       *   The value to store (in any format that JSON.stringify can handle).
       * @param session
       *   True if session storage, false if local storage.  Defaults true.
       */
      write: function (key, value, session) {
        if (!this.supportsLocalStorage()) { return; }

        // Fix for iPad issue - sometimes throws QUOTA_EXCEEDED_ERR on setItem.
        _remove(key, session);
        try {
          _write(key, value, session);
        } catch (e) {
          if (e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            // Prune off the oldest entries and try again.
            _pruneOldest(session);
            try {
              _write(key, value, session);
            } catch (e2) {
              console.error('Failed to write to storage, unhandled exception: ', e2);
            }
            return;
          }
          console.error('Failed to write to storage, unhandled exception: ', e);
        }
      },

      /**
       * Removes an item from a bucket.
       *
       * @param key
       *   The bucket-specific key to use to remove the item.
       * @param session
       *   True if session storage, false if local storage.  Defaults true.
       */
      remove: function (key, session) {
        if (!this.supportsLocalStorage()) { return; }

        _remove(key, session);
      },

      /**
       * Clears all items key containing prefix in storage
       *
       * @param prefix
       *    The bucket-specific key to use to remove the item.
       * @param session
       *    True if session storage, false if local storage. Defaults true.
       */
      clearStorage: function(prefix, session){
        if (!this.supportsLocalStorage()) { return; }

        var store = _getStore(session),
            i = store.length,
            key;
        while(i--) {
          key = store.key(i);
          if(key.indexOf(prefix) === 0) {
            _remove(key, session);
          }
        }
      }
    };
  })();

})(Drupal);
;
!function(){var a,b,c,d;!function(){var e={},f={};a=function(a,b,c){e[a]={deps:b,callback:c}},d=c=b=function(a){function c(b){if("."!==b.charAt(0))return b;for(var c=b.split("/"),d=a.split("/").slice(0,-1),e=0,f=c.length;f>e;e++){var g=c[e];if(".."===g)d.pop();else{if("."===g)continue;d.push(g)}}return d.join("/")}if(d._eak_seen=e,f[a])return f[a];if(f[a]={},!e[a])throw new Error("Could not find module "+a);for(var g,h=e[a],i=h.deps,j=h.callback,k=[],l=0,m=i.length;m>l;l++)"exports"===i[l]?k.push(g={}):k.push(b(c(i[l])));var n=j.apply(this,k);return f[a]=g||n}}(),a("promise/all",["./utils","exports"],function(a,b){"use strict";function c(a){var b=this;if(!d(a))throw new TypeError("You must pass an array to all.");return new b(function(b,c){function d(a){return function(b){f(a,b)}}function f(a,c){h[a]=c,0===--i&&b(h)}var g,h=[],i=a.length;0===i&&b([]);for(var j=0;j<a.length;j++)g=a[j],g&&e(g.then)?g.then(d(j),c):f(j,g)})}var d=a.isArray,e=a.isFunction;b.all=c}),a("promise/asap",["exports"],function(a){"use strict";function b(){return function(){process.nextTick(e)}}function c(){var a=0,b=new i(e),c=document.createTextNode("");return b.observe(c,{characterData:!0}),function(){c.data=a=++a%2}}function d(){return function(){j.setTimeout(e,1)}}function e(){for(var a=0;a<k.length;a++){var b=k[a],c=b[0],d=b[1];c(d)}k=[]}function f(a,b){var c=k.push([a,b]);1===c&&g()}var g,h="undefined"!=typeof window?window:{},i=h.MutationObserver||h.WebKitMutationObserver,j="undefined"!=typeof global?global:void 0===this?window:this,k=[];g="undefined"!=typeof process&&"[object process]"==={}.toString.call(process)?b():i?c():d(),a.asap=f}),a("promise/config",["exports"],function(a){"use strict";function b(a,b){return 2!==arguments.length?c[a]:(c[a]=b,void 0)}var c={instrument:!1};a.config=c,a.configure=b}),a("promise/polyfill",["./promise","./utils","exports"],function(a,b,c){"use strict";function d(){var a;a="undefined"!=typeof global?global:"undefined"!=typeof window&&window.document?window:self;var b="Promise"in a&&"resolve"in a.Promise&&"reject"in a.Promise&&"all"in a.Promise&&"race"in a.Promise&&function(){var b;return new a.Promise(function(a){b=a}),f(b)}();b||(a.Promise=e)}var e=a.Promise,f=b.isFunction;c.polyfill=d}),a("promise/promise",["./config","./utils","./all","./race","./resolve","./reject","./asap","exports"],function(a,b,c,d,e,f,g,h){"use strict";function i(a){if(!v(a))throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");if(!(this instanceof i))throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");this._subscribers=[],j(a,this)}function j(a,b){function c(a){o(b,a)}function d(a){q(b,a)}try{a(c,d)}catch(e){d(e)}}function k(a,b,c,d){var e,f,g,h,i=v(c);if(i)try{e=c(d),g=!0}catch(j){h=!0,f=j}else e=d,g=!0;n(b,e)||(i&&g?o(b,e):h?q(b,f):a===D?o(b,e):a===E&&q(b,e))}function l(a,b,c,d){var e=a._subscribers,f=e.length;e[f]=b,e[f+D]=c,e[f+E]=d}function m(a,b){for(var c,d,e=a._subscribers,f=a._detail,g=0;g<e.length;g+=3)c=e[g],d=e[g+b],k(b,c,d,f);a._subscribers=null}function n(a,b){var c,d=null;try{if(a===b)throw new TypeError("A promises callback cannot return that same promise.");if(u(b)&&(d=b.then,v(d)))return d.call(b,function(d){return c?!0:(c=!0,b!==d?o(a,d):p(a,d),void 0)},function(b){return c?!0:(c=!0,q(a,b),void 0)}),!0}catch(e){return c?!0:(q(a,e),!0)}return!1}function o(a,b){a===b?p(a,b):n(a,b)||p(a,b)}function p(a,b){a._state===B&&(a._state=C,a._detail=b,t.async(r,a))}function q(a,b){a._state===B&&(a._state=C,a._detail=b,t.async(s,a))}function r(a){m(a,a._state=D)}function s(a){m(a,a._state=E)}var t=a.config,u=(a.configure,b.objectOrFunction),v=b.isFunction,w=(b.now,c.all),x=d.race,y=e.resolve,z=f.reject,A=g.asap;t.async=A;var B=void 0,C=0,D=1,E=2;i.prototype={constructor:i,_state:void 0,_detail:void 0,_subscribers:void 0,then:function(a,b){var c=this,d=new this.constructor(function(){});if(this._state){var e=arguments;t.async(function(){k(c._state,d,e[c._state-1],c._detail)})}else l(this,d,a,b);return d},"catch":function(a){return this.then(null,a)}},i.all=w,i.race=x,i.resolve=y,i.reject=z,h.Promise=i}),a("promise/race",["./utils","exports"],function(a,b){"use strict";function c(a){var b=this;if(!d(a))throw new TypeError("You must pass an array to race.");return new b(function(b,c){for(var d,e=0;e<a.length;e++)d=a[e],d&&"function"==typeof d.then?d.then(b,c):b(d)})}var d=a.isArray;b.race=c}),a("promise/reject",["exports"],function(a){"use strict";function b(a){var b=this;return new b(function(b,c){c(a)})}a.reject=b}),a("promise/resolve",["exports"],function(a){"use strict";function b(a){if(a&&"object"==typeof a&&a.constructor===this)return a;var b=this;return new b(function(b){b(a)})}a.resolve=b}),a("promise/utils",["exports"],function(a){"use strict";function b(a){return c(a)||"object"==typeof a&&null!==a}function c(a){return"function"==typeof a}function d(a){return"[object Array]"===Object.prototype.toString.call(a)}var e=Date.now||function(){return(new Date).getTime()};a.objectOrFunction=b,a.isFunction=c,a.isArray=d,a.now=e}),b("promise/polyfill").polyfill()}();;
(function ($) {
  var cookieName = 'drupal-personalize';

  /**
   * Provides client side page personalization based on a user's context.
   */
  Drupal.personalize = Drupal.personalize || {};
  // Timeout to retrieve visitor context values in milliseconds.
  Drupal.personalize.contextTimeout = Drupal.personalize.contextTimeout || 5000;

  /**
   * Private variable: Session identifier for decision and goals.
   */
  var sessionId = false;
  /**
   * Initializes the session ID to be used for decision and goal requests.
   *
   * The session ID can be used by decision agents to keep track of visitors
   * across requests. It may be generated by the decision agent itself and
   * stored in a cookie, or, for logged in users, it is a hash of the user
   * ID.
   */
  Drupal.personalize.initializeSessionID = function() {
    if (sessionId) {
      return sessionId;
    }
    // Populate the session id from the cookie, if present.
    var storedId = $.cookie(cookieName);
    if (storedId) {
      sessionId = storedId;
    }
    else if (Drupal.settings.personalize.sessionID) {
      sessionId = Drupal.settings.personalize.sessionID;
    }
    return sessionId;
  };

  /**
   * Saves the passed in ID as the SessionID variable to be used for all
   * future decision and goal requests.
   */
  Drupal.personalize.saveSessionID = function(session_id) {
    sessionId = session_id;
    $.cookie(cookieName, session_id);
  };

  /**
   * Private administrative indicator - available as a convenience to store
   * property from reference.
   */
  var adminMode = null;
  /**
   * Returns whether or not personalization is running in admin mode.
   *
   * @return boolean
   */
  Drupal.personalize.isAdminMode = function() {
    if (adminMode == null) {
      adminMode = Drupal.settings.personalize.hasOwnProperty('adminMode');
    }
    return adminMode;
  };

  var DNT = null;
  /**
   * Returns whether or not do-not-track is enabled.
   *
   * @return boolean
   */
  Drupal.personalize.DNTenabled = function() {
    if (DNT == null) {
      DNT = false;
      // @todo We need a flexible way of allowing site owners to decide how to support the
      //   idea of Do Not Track. The browser header is not a standard and many site owners
      //   will prefer to use a custom cookie that they can allow visitors to set. Commenting
      //   this out until we have a way of configuring how it works.
/*      if (typeof window.navigator.doNotTrack != "undefined") {
        if (window.navigator.doNotTrack == "yes" || window.navigator.doNotTrack == "1") {
          DNT = true;
        }
      }*/
    }
    return DNT;
  };

  var debugMode = null;
  /**
   * Returns whether or not debug mode is enabled.
   *
   * @return boolean
   */
  Drupal.personalize.isDebugMode = function() {
    if (debugMode === null) {
      debugMode = Drupal.settings.personalize.debugMode && (Drupal.personalize.isAdminMode() || $.cookie('personalizeDebugMode'));
    }
    return debugMode;
  };

  /**
   * Private tracking variables across behavior attachments.
   */
  var processedDecisions = {}, decisionCallbacks = {}, processedOptionSets = {}, processingOptionSets = {};

  /**
   * A decorator for a promise to implement an enforced timeout value.
   *
   * @param timeoutMS
   *   The timeout value in milliseconds.
   * @param promise
   *   A JavaScript promise.
   * @returns Promise
   *   A promise that will respond with the original promises values
   *   unless a time out error occurs.
   */
  var TimeoutPromise = function(timeoutMS, promise) {
    var isTimedOut = false, isResolved = false;
    return new Promise(function (resolve, reject) {
      // Enforce a timeout error response.
      setTimeout(function () {
        isTimedOut = true;
        if (!isResolved) {
          reject(new Error("Promise timed out"));
        }
      }, timeoutMS);

      // Respond with the wrapped promise's results as long as a time out
      // has not occurred.
      promise.then(function (response) {
        isResolved = true;
        if (!isTimedOut) {
          resolve(response)
        }
      }, function (error) {
        isResolved = true;
        if (!isTimedOut) {
          reject(error);
        }
      });
    });
  }

  Drupal.personalize.getVisitorContexts = function(contexts, callback) {

    // Load and evaluate all contexts.
    var contextPromises = [];
    var promisePlugins = [];
    var contextValues = {};
    for (var plugin in contexts) {
      if (contexts.hasOwnProperty(plugin)) {
        // @todo: Should be able to just always return promises and let
        // nested promises resolve but it doesn't appear to work that way.
        var contextResult = getVisitorContext(plugin, contexts[plugin]);
        if (contextResult instanceof Promise) {
          promisePlugins.push(plugin);
          contextPromises.push(new TimeoutPromise(Drupal.personalize.contextTimeout, contextResult));
        } else {
          contextValues[plugin] = contextResult;
        }
      }
    }
    // Promise specification doesn't handle an empty array of promises
    // as automatically completing.
    if (contextPromises.length == 0) {
      callback(contextValues);
      return;
    }
    // If there are promises, then wait for them all to complete before calling
    // back with the context values.
    Promise.all(contextPromises).then(function processLoadedVisitorContexts(loadedContexts) {
      // Results are in the same order as promises were.
      var num = loadedContexts.length;
      for (var i = 0; i < num; i++) {
        contextValues[promisePlugins[i]] = loadedContexts[i];
      }
    }, function handleErrorContexts(err) {
      if (console.log) {
        console.log(err.message);
      }
    }).then(function() {
      callback(contextValues);
    });
  };

  // Keeps track of processed listeners so we don't subscribe them more than once.
  var processedListeners = {};

  /**
   * Looks for personalized elements and calls the corresponding decision agent
   * for each one.
   */
  Drupal.behaviors.personalize = {
    attach: function (context, settings) {

      // Assure that at least the personalize key is available on settings.
      settings.personalize = settings.personalize || {};

      Drupal.personalize.initializeSessionID();

      // Clear out any expired local storage.
      Drupal.personalize.storage.utilities.maintain();

      Drupal.personalize.personalizePage(settings);

      // This part is not dependent upon decisions so it can run prior to
      // fulfillment of Promise.
      if (!Drupal.personalize.isAdminMode()) {
        // Dispatch any goals that were triggered server-side.
        Drupal.personalize.sendGoals(settings);
      }

      // Add an action listener for client-side goals.
      addActionListener(settings);

      $(document).bind('visitorActionsBindActions', function(e, boundActions){
        for (var action in boundActions) {
          if (boundActions.hasOwnProperty(action) && processedListeners.hasOwnProperty(action)) {
            if (boundActions[action] == null || (boundActions[action] instanceof jQuery && boundActions[action].length == 0)) {
              Drupal.personalize.debug('Element goal ' + action + ' has no DOM element on this page.', 3001);
            }
          }
        }
      });
    }
  };

  Drupal.personalize.personalizePage = function(settings) {

    // Prepare MVTs and option sets for processing.
    var optionSets = prepareOptionSets(settings);

    // Gets the agent data for any option sets requiring decisions.
    // Any decisions that can be rendered early are handled here and only
    // those agents that require decisions are returned.
    var agents = processOptionSets(optionSets);

    if (!$.isEmptyObject(agents)) {
      // Get a consolidation of all visitor contexts to be retrieved for all agents.
      var contexts = getAgentsContexts(agents);

      // Set up a callback for when all visitor contexts have been resolved.
      var callback = function(contextValues) {
        for (var agentName in agents) {
          if (!agents.hasOwnProperty(agentName)) {
            continue;
          }
          var agent = agents[agentName];
          var agentContexts = {};
          // Apply the context values to each of the agent's enabled contexts
          // which essentially means limiting the agent's contexts to those
          // returned here.
          for (var plugin in agent.enabledContexts) {
            if (agent.enabledContexts.hasOwnProperty(plugin)) {
              if (contextValues.hasOwnProperty(plugin) && !$.isEmptyObject(contextValues[plugin])) {
                agentContexts[plugin] = contextValues[plugin];
              }
            }
          }
          // Evaluate the contexts.
          agent.visitorContext = Drupal.personalize.evaluateContexts(agent.agentType, agentContexts, agent.fixedTargeting);
        }
        // Trigger decision calls on the agents.
        triggerDecisions(agents);
      };
      Drupal.personalize.getVisitorContexts(contexts, callback);
    }
  };

  /**
   * Helper function for sending a goal to the debugger.
   */
  function debugGoal(goal_name, agent_name, value) {
    Drupal.personalize.debug('Sending goal ' + goal_name + ' to agent ' + agent_name + ' with value ' + value, 2010);
  }

  /**
   * Sends any goals that have been set server-side.
   */
  Drupal.personalize.sendGoals = function(settings) {
    if (settings.personalize.goals_attained) {
      for (var agent_name in settings.personalize.goals_attained) {
        if (settings.personalize.goals_attained.hasOwnProperty(agent_name)) {
          var agent = settings.personalize.agent_map[agent_name];
          if (!Drupal.personalize.agents.hasOwnProperty(agent.type)) {
            // @todo How best to handle errors like this?
            continue;
          }
          for (var i in settings.personalize.goals_attained[agent_name]) {
            if (settings.personalize.goals_attained[agent_name].hasOwnProperty(i) && !settings.personalize.goals_attained[agent_name][i].processed) {
              Drupal.personalize.agents[agent.type].sendGoalToAgent(agent_name, settings.personalize.goals_attained[agent_name][i].name, settings.personalize.goals_attained[agent_name][i].value);
              settings.personalize.goals_attained[agent_name][i].processed = 1;
              debugGoal(settings.personalize.goals_attained[agent_name][i].name, agent_name, settings.personalize.goals_attained[agent_name][i].value)
              $(document).trigger('sentGoalToAgent', [agent_name, settings.personalize.goals_attained[agent_name][i].name, settings.personalize.goals_attained[agent_name][i].value ]);
            }
          }
        }
      }
    }
  };

  Drupal.personalize.executors = Drupal.personalize.executors || {};
  /**
   * Executor that Looks for options inside a script tag and pulls out the
   * chosen one.
   */
  Drupal.personalize.executors.show = {
    'execute': function ($option_sets, choice_name, osid, preview) {
      if ($option_sets.length == 0 ) {
        return;
      }

      $option_sets.each(function() {
        var $option_set = $(this);
        var noscripthtml = '', choices = null, winner = '';
        var $option_source = $('script[type="text/template"]', $option_set);
        if ($option_source.length == 0) {
          // The script tag may have been moved outside by a jQuery insertion after an
          // AJAX request - look for it in the entire document by its data attribute.
          $option_source = $(document).find('script[data-personalize-script=' + osid + ']');
        }
        if ($option_source.length != 0) {
          var element = $option_source.get(0);
          noscripthtml = $option_source.prev('noscript').text();
          var json = element.innerText;
          if (typeof preview === 'undefined') { preview = false; };
          if (json === undefined || json.length == 0) {
            json = element.text;
          }
          choices = jQuery.parseJSON(json);
        }
        else {
          // Use the noscript contents.
          noscripthtml = $option_set.find('noscript').text();
        }

        if (choices == null || choices === false || !choices.hasOwnProperty(choice_name)) {
          // Invalid JSON in the template.  Just show the noscript option.
          winner = noscripthtml;
        }
        else if (!choices[choice_name].hasOwnProperty('html')) {
          var controlOptionName = Drupal.settings.personalize.controlOptionName;
          if (choices.hasOwnProperty(controlOptionName) && choices[controlOptionName].hasOwnProperty('html')) {
            winner = choices[controlOptionName]['html'];
          }
          else {
            winner = noscripthtml;
          }
        }
        else if (choices[choice_name]['html'].length == 0) {
          winner = noscripthtml;
        }
        else {
          winner = choices[choice_name]['html'];
        }

        // Remove any previously existing options.
        $option_set
          // empty() is necessary to remove text nodes as well as elements.
          .empty()
          .append($option_source);
        // Append the selected option.
        $option_set.append(winner);

      });
      Drupal.personalize.executorCompleted($option_sets, choice_name, osid);
      // Lots of Drupal modules expect context to be document on the first pass.
      var bread = document; // context.
      var circus = Drupal.settings; // settings.
      Drupal.attachBehaviors(bread, circus);
    }
  };

  Drupal.personalize.executorCompleted = function($option_set, option_name, osid) {
    // Trigger an event to let others respond to the option change.
    $(document).trigger('personalizeOptionChange', [$option_set, option_name, osid]);
  };

  /**
   * Executor that executes a callback function to retrieve the chosen
   * option set to display.
   */
  Drupal.personalize.executors.callback = {
  'execute': function($option_set, choice_name, osid, preview) {
    if ($option_set.length == 0 ) {
      return;
    }
    // Set up such that Drupal ajax handling can be utilized without a trigger.
    var custom_settings = {};
    custom_settings.url = Drupal.settings.basePath + Drupal.settings.pathPrefix + 'personalize/option_set/' + osid + '/' + choice_name + '/ajax';
    custom_settings.event = 'onload';
    custom_settings.keypress = false;
    custom_settings.prevent = false;
    // Only show the throbber and wait message in preview mode.
    if (preview !== true) {
      custom_settings.progress = {
        message: '',
        type: 'none'
      };
    }
    var callback_action = new Drupal.ajax(null, $option_set, custom_settings);

    try {
        $.ajax(callback_action.options);
      }
      catch (err) {
        // If we can't process the result dynamically, then show the
        // default option selected within the noscript block.
        // NOTE: jQuery returns escaped HTML when calling the html property
        // on a noscript tag.
        var defaultHtml = $option_set.next('noscript').text();
        $option_set.html(defaultHtml);
        $option_set.next('noscript').remove();
        return false;
      }
    }
  }

  Drupal.personalize.agents = Drupal.personalize.agents || {};
  /**
   * Provides a default agent.
   */
  Drupal.personalize.agents.default_agent = {
    'getDecisionsForPoint': function(name, visitor_context, choices, decision_point, callback) {
      var j, decisions = {};
      for (j in choices) {
        if (choices.hasOwnProperty(j)) {
          decisions[j] = choices[j][0];
        }
        callback(decisions);
      }
    },
    'sendGoalToAgent': function(agent_name, goal_name, value) {

    },
    'featureToContext': function(featureString) {
      var contextArray = featureString.split('::');
      return {
        'key': contextArray[0],
        'value': contextArray[1]
      }
    }
  };

  /**
   * Builds up an object of all enabled contexts for active agents on the page.
   *
   * @param agents
   *   An object of all active agents on the page keyed by agent name.
   * @return
   *   An object of all contexts on the page keyed by plugin name.
   */
  function getAgentsContexts(agents) {
    var contexts = {};
    for (var agentName in agents) {
      if (!agents.hasOwnProperty(agentName)) {
        continue;
      }
      var agent = agents[agentName];
      for (var pluginName in agent.enabledContexts) {
        if (agent.enabledContexts.hasOwnProperty(pluginName)) {
          var plugin = agent.enabledContexts[pluginName];
          if (!contexts.hasOwnProperty(pluginName)) {
            contexts[pluginName] = {};
          }
          for (var context in plugin) {
            if (plugin.hasOwnProperty(context)) {
              contexts[pluginName][context] = plugin[context];
            }
          }
        }
      }
    }
    return contexts;
  }

  /**
   * Gets the values for a particular visitor context.
   *
   * @param plugin
   *   The plugin name to use to retrieve visitor context.
   * @param context
   *   The context object to retrieve values for in the current visitor context.
   * @returns object|Promise|null
   *   The context object with values filled in for each context key
   *   OR An asynchronous JS promise for asynchronous processing
   *   OR null.
   */
  function getVisitorContext(plugin, context) {
    var visitor_context = Drupal.personalize.visitor_context;
    if (visitor_context.hasOwnProperty(plugin) && typeof visitor_context[plugin].getContext === 'function') {
      return visitor_context[plugin].getContext(context);
    }
    return null;
  }

  /**
   * Evaluate the visitor contexts for an agent.
   *
   * @param agentType
   *   The type of agent.
   * @param {object} visitorContext
   *   The enabled context for the agent as an object keyed by plugin name.
   * @param {object} featureRules
   *   Fixed targeting feature rules for the agent.
   * @returns {object}
   *   An object that holds arrays for each context key to indicate the rule
   *   and how the rule was satisfied.
   */
  Drupal.personalize.evaluateContexts = function (agentType, visitorContext, featureRules) {
    if (!Drupal.personalize.agents.hasOwnProperty(agentType)) {
      return {};
    }
    // The new visitor context object will hold an array of values for each
    // key, rather than just a single value for each plugin's key. This is because in addition to
    // having a string representing key and actual value, for each rule that
    // is satisfied we'll also need a string indicating that that rule is
    // satisfied. For example, if we have a targeting rule that says show this
    // option if the visitor's "interests" field contains "submarines", and the
    // value of this field for the current visitor is "ships and submarines",
    // then our visitor context for key "interests" should be ["ships and submarines",
    // "sc-submarines"], where sc- is just the prefix added to codify "string
    // contains".
    var newVisitorContext = {};
    for (var pluginName in visitorContext) {
      if (visitorContext.hasOwnProperty(pluginName)) {
        for (var contextKey in visitorContext[pluginName]) {
          if (visitorContext[pluginName].hasOwnProperty(contextKey)) {
            newVisitorContext[contextKey] = [visitorContext[pluginName][contextKey]];
          }
        }
      }
    }
    // If our agent type does not support translating feature strings back into contexts
    // then we can't use feature rules.
    if (typeof Drupal.personalize.agents[agentType].featureToContext !== 'function') {
      return newVisitorContext;
    }
    // Use the rules to set values on the visitor context which can then be used
    // for explicit targeting. It is up to the agent how exactly the explicit
    // targeting is done.
    if (typeof featureRules !== 'undefined') {
      for (var featureName in featureRules) {
        if (featureRules.hasOwnProperty(featureName)) {
          var key = featureRules[featureName].context;
          var plugin = featureRules[featureName].plugin;
          if (visitorContext.hasOwnProperty(plugin) && visitorContext[plugin].hasOwnProperty(key)) {
            // Evaluate the rule and if it returns true, we set the feature string
            // on the visitor context.
            var operator = featureRules[featureName].operator;
            var match = featureRules[featureName].match;
            if (Drupal.personalize.targetingOperators.hasOwnProperty(operator)) {
              if (Drupal.personalize.targetingOperators[operator](visitorContext[plugin][key], match)) {
                // The feature string was created by the agent responsible for consuming
                // it, so only that agent knows how to split it up into its key and
                // value components.
                var context = Drupal.personalize.agents[agentType].featureToContext(featureName);
                // Now add the value that reflects this matched rule.
                newVisitorContext[key].push(context.value);
              }
            }
          }
        }
      }
    }
    return newVisitorContext;
  };

  /**
   * Defines the various operations that can be performed to evaluate
   * explicit targeting rules.
   */
  Drupal.personalize.targetingOperators = {
    'contains': function(actualValue, matchValue) {
      return actualValue.indexOf(matchValue) !== -1;
    },
    'starts': function(actualValue, matchValue) {
      return actualValue.indexOf(matchValue) === 0;
    },
    'ends': function(actualValue, matchValue) {
      return actualValue.indexOf(matchValue, actualValue.length - matchValue.length) !== -1;
    },
    'numgt': function(actualValue, matchValue) {
      if (isNaN(actualValue) || isNaN(matchValue)) return false;
      return actualValue > matchValue;
    },
    'numlt': function(actualValue, matchValue) {
      if (isNaN(actualValue) || isNaN(matchValue)) return false;
      return actualValue < matchValue;
    }
  };

  /**
   * Visitor Context object.
   *
   * This object holds the context for the active user which will be used
   * as the basis of personalization. Agents may add additional information
   * to this object as they work with it, or other code may place context
   * within this object which can be used later by agents or used
   * on subsequent page loads.
   */
  Drupal.personalize.visitor_context = Drupal.personalize.visitor_context || {};

  /**
   * The User Profile context plugin.
   *
   * @todo This context plugin should really be in its own file which would only
   *   be added when the plugin is being used.
   */
  Drupal.personalize.visitor_context.user_profile_context = {
    'getContext': function(enabled) {
      if (!Drupal.settings.hasOwnProperty('personalize_user_profile_context')) {
        return [];
      }
      var i, context_values = {};
      for (i in enabled) {
        if (enabled.hasOwnProperty(i) && Drupal.settings.personalize_user_profile_context.hasOwnProperty(i)) {
          context_values[i] = Drupal.settings.personalize_user_profile_context[i];
        }
      }
      return context_values;
    }
  };

  /**
   * Reads a visitor context item from localStorage.
   *
   * @param key
   *   The name of the context item to retrieve.
   * @param context
   *   The type of visitor context for the key.
   * @returns {*}
   *   The value of the specified context item or null if not found or
   *   if not configured to store visitor context in localStorage.
   */
  Drupal.personalize.visitor_context_read = function(key, context) {
    var bucketName = Drupal.personalize.storage.utilities.generateVisitorContextBucketName(key, context);
    var bucket = Drupal.personalize.storage.utilities.getBucket(bucketName);
    return bucket.read(key);
  };

  /**
   * Writes a visitor context item to localStorage.
   *
   * Checks if the site is configured to allow storing of visitor
   * context items in localStorage and does nothing if not.
   *
   * @param key
   *   The name of the context item to store.
   * @param context
   *   The type of visitor context for the key.
   * @param value
   *   The value of the context item to store.
   * @param overwrite
   *   True to overwrite existing values, false not to overwrite; default true.
   */
  Drupal.personalize.visitor_context_write = function(key, context, value, overwrite) {
    var bucketName = Drupal.personalize.storage.utilities.generateVisitorContextBucketName(key, context);
    var bucket = Drupal.personalize.storage.utilities.getBucket(bucketName);
    if (overwrite === false) {
      var current = bucket.read(key);
      if (current !== null) {
        // A value already exists and we are not allowed to overwrite.
        return;
      }
    }

    return bucket.write(key, value);
  };

  /**
   * Prepares option sets for processing.  Separates out those option sets
   * that are part of an MVT and then adds in rest of option sets with
   * relevant agent information.
   *
   * @param settings
   *   A Drupal settings object.
   * @return {object}
   *   An associative array keyed by osid for all option sets to be processed.
   */
  function prepareOptionSets(settings) {
    var option_sets = {};
    // First process all MVTs.
    if (settings.personalize.hasOwnProperty('mvt')) {
      for (var mvt_name in settings.personalize.mvt) {
        if (settings.personalize.mvt.hasOwnProperty(mvt_name)) {
          // Extract agent and decision info from the mvt settings.
          var mvt = settings.personalize.mvt[mvt_name];
          var agent_info = Drupal.settings.personalize.agent_map[mvt.agent];
          for (var i in mvt.option_sets) {
            if (mvt.option_sets.hasOwnProperty(i)) {
              var option_set = mvt.option_sets[i];
              option_set.decision_point = mvt_name;
              option_set.agent = mvt.agent;
              option_set.agent_info = agent_info;
              option_sets[option_set.osid] = option_set;
            }
          }
        }
      }
    }
    // Now add any option sets that aren't part of MVTs.
    if (settings.personalize.hasOwnProperty('option_sets')) {
      for (var osid in settings.personalize.option_sets) {
        if (settings.personalize.option_sets.hasOwnProperty(osid)) {
          // If it was part of an MVT then skip it.
          if (option_sets.hasOwnProperty(osid)) {
            continue;
          }
          // Extract agent and decision info from the option set settings.
          var option_set = settings.personalize.option_sets[osid];
          option_set.agent_info = Drupal.settings.personalize.agent_map[option_set.agent];
          option_sets[osid] = option_set;
        }
      }
    }
    return option_sets;
  }

  /**
   * Generates a standardized key format for a decision point to use for
   * persisted storage.
   *
   * @param agent_name
   *   The name of the agent for decisions.
   * @param point
   *   The decision point name.
   * @returns string
   *   The formatted key name to be used in persistent storage.
   */
  function generateDecisionStorageKey(agent_name, point) {
    return agent_name + Drupal.personalize.storage.utilities.cacheSeparator + point;
  }

  function readDecisionsFromStorage(agent_name, point) {
    if (!Drupal.settings.personalize.agent_map[agent_name].cache_decisions) {
      return null;
    }
    var bucket = Drupal.personalize.storage.utilities.getBucket('decisions');
    return bucket.read(generateDecisionStorageKey(agent_name, point));
  }

  function writeDecisionsToStorage(agent_name, point, decisions) {
    if (!Drupal.settings.personalize.agent_map[agent_name].cache_decisions) {
      return;
    }
    var bucket = Drupal.personalize.storage.utilities.getBucket('decisions');
    bucket.write(generateDecisionStorageKey(agent_name, point), decisions);
  }

  /**
   * Triggers all decisions needing to be made for the current page.
   *
   * @param agents
   *   An object of agent data keyed by agent name.
   *
   * Relies on closure variable processedDecisions.
   */
  function triggerDecisions(agents) {
    var agent_name, agent, point, decisions, callback;

    // Loop through all agents and ask them for decisions.
    for (agent_name in agents) {
      if (agents.hasOwnProperty(agent_name)) {
        agent = agents[agent_name];
        processedDecisions[agent_name] = processedDecisions[agent_name] || {};
        for (point in agent.decisionPoints) {
          if (agent.decisionPoints.hasOwnProperty(point) && !processedDecisions[agent_name][point]) {
            processedDecisions[agent_name][point] = true;
            callback = (function(inner_agent_name, inner_agent, inner_point) {
              return function(selection) {
                // Save to local storage.
                writeDecisionsToStorage(inner_agent_name, inner_point, selection)
                // Call the per-option-set callbacks.
                executeDecisionCallbacks(inner_agent_name, inner_point, selection);
              };
            })(agent_name, agent, point);
            var decisionAgent = Drupal.personalize.agents[agent.agentType];
            if (!decisionAgent || typeof decisionAgent.getDecisionsForPoint !== 'function') {
              // If for some reason we can't find the agent responsible for this decision,
              // just use the fallbacks.
              var fallbacks = agent.decisionPoints[point].fallbacks;
              decisions = {};
              for (var key in fallbacks) {
                if (fallbacks.hasOwnProperty(key) && agent.decisionPoints[point].choices.hasOwnProperty(key)) {
                  decisions[key] = agent.decisionPoints[point].choices[key][fallbacks[key]];
                }
              }
              executeDecisionCallbacks(agent_name, point, decisions);
              return;
            }
            Drupal.personalize.debug('Requesting decision for ' + agent_name + ': ' + point, 2000);
            decisionAgent.getDecisionsForPoint(agent_name, agent.visitorContext, agent.decisionPoints[point].choices, point, agent.decisionPoints[point].fallbacks, callback);
          }
        }
      }
    }
    // Let other code know that we have finished requesting decisions for the current page.
    $(document).trigger('personalizeDecisionsEnd');
  }

  /**
   * Returns whether the specified option set is stateful.
   *
   * Stateful option sets cause the chosen option to be reflected in the
   * url. This way, if the url is shared with a friend, the friend will
   * see the same option for that option set.
   *
   * @param osid
   *   The option set ID
   *
   * @return boolean
   *   true if the option set is stateful, false otherwise.
   */
  function optionSetIsStateful(osid) {
    if (!Drupal.settings.personalize.option_sets.hasOwnProperty(osid)) {
      return false;
    }
    var stateful = Drupal.settings.personalize.option_sets[osid].stateful;
    return stateful == "1";
  }

  /**
   * Returns the preselected option for the given option set, if one
   * has been set.
   *
   * @param osid
   *   The option set ID
   * @returns string
   *   The selection for the option set or false if none exists.
   */
  function getPreselection(osid) {
    if (optionSetIsStateful(osid) && (selection = $.bbq.getState(osid, true))) {
      return selection;
    }
    if (Drupal.settings.personalize.preselected && Drupal.settings.personalize.preselected.hasOwnProperty(osid)) {
      return Drupal.settings.personalize.preselected[osid];
    }
    return false;
  }

  /**
   * Loops through the option sets on the page and handles retrieving
   * and formatting agent data including decision points and targeting data.
   *
   * @param option_sets
   *   An object of option set data keyed by osid.
   * @returns object
   *   The combined agent data for all option sets on the page.
   */
  function processOptionSets (option_sets) {
    var agents = {}, agentName, agentData, osid, decisionPoint, decisions, optionSetsToProcess = [];
    // We need an initial loop to add this batch of option sets to the local
    // optionSetsToProcess variable and to the processingOptionSets closure variable. If
    // any option set is already in the processingOptionSets closure variable, then it
    // will not be processed here.
    for(osid in option_sets) {
      if (option_sets.hasOwnProperty(osid)) {
        if (!processingOptionSets.hasOwnProperty(osid)) {
          optionSetsToProcess.push(osid);
          processingOptionSets[osid] = true;
        }
      }
    }
    // This second loop does the actual processing of each option set, which could result
    // in an executor being called with a decision (e.g. if the agent is paused), which
    // would in turn result in processOptionSets being called again with the same batch
    // of option sets due to the call to Drupal.attachBehaviors. This is why we need the
    // closure and local variable keeping track of option sets to process.
    for(osid in option_sets) {
      if (option_sets.hasOwnProperty(osid)) {
        if (optionSetsToProcess.indexOf(osid) == -1 || processedOptionSets.hasOwnProperty(osid)) {
          continue;
        }
        processedOptionSets[osid] = true;

        agentData = processOptionSet(option_sets[osid]);
        // If agent data is not returned then the decision is not necessary for
        // this option set.
        if (!agentData) {
          continue;
        }
        // Merge in the agent data with other option set agent data.
        agentName = agentData.agentName;
        if (!agents.hasOwnProperty(agentName)) {
          agents[agentName] = agentData;
        } else {
          // Merge in decision point data.
          $.extend(true, agents[agentName].decisionPoints, agentData.decisionPoints);
          // Merge in fixed targeting data.
          $.extend(agents[agentName].fixedTargeting, agentData.fixedTargeting);
        }
      }
    }

    // Check to see if any of the decisions are already in storage.
    for(agentName in agents) {
      if (agents.hasOwnProperty(agentName)) {
        for(decisionPoint in agents[agentName].decisionPoints) {
          if (agents[agentName].decisionPoints.hasOwnProperty(decisionPoint)) {
            decisions = readDecisionsFromStorage(agentName, decisionPoint);
            // Decisions from localStorage need to be checked against the known valid
            // set of choices because they may be stale (e.g. if an option has been
            // removed after being stored in a user's localStorage).
            if (!decisionsAreValid(decisions, agents[agentName].decisionPoints[decisionPoint].choices)) {
              decisions = null;
            }
            if (decisions != null) {
              // Execute the decision callbacks and skip processing this agent any further.
              Drupal.personalize.debug('Reading decisions from storage: ' + agentName + ': ' + decisionPoint, 2001);
              executeDecisionCallbacks(agentName, decisionPoint, decisions);
              // Remove this from the decision points to be processed for this agent.
              delete agents[agentName].decisionPoints[decisionPoint];
            }
          }
        }
      }
    }

    return agents;
  }

  /**
   * Parses through an option set and handles a decision if one can be made
   * immediately (due to cache, preselection, etc.) -- otherwise returns
   * the agent decision data necessary to retrieve a decision.
   *
   * @param option_set
   *   An object representing an option set.
   * @return object|null
   *   An associative array of agent decision data.
   */
  function processOptionSet(option_set) {
    var executor = option_set.executor == undefined ? 'show' : option_set.executor,
      osid = option_set.osid,
      agent_name = option_set.agent,
      agent_info = option_set.agent_info,
      // If we have an empty or undefined decision name, use the osid.
      decision_name = option_set.decision_name == undefined || option_set.decision_name == '' ? osid : option_set.decision_name,
      // If we have an empty or undefined decision point, use the decision name.
      decision_point = option_set.decision_point == undefined || option_set.decision_point == '' ? decision_name : option_set.decision_point,
      choices = option_set.option_names,
      $option_set = null,
      fallbackIndex = 0,
      chosenOption = null;

    // Make sure the selector is syntactically valid.
    try {
      $option_set = $(option_set.selector);
    } catch (error) {
      return;
    }

    if (option_set.selector.length > 0 && $option_set.length == 0 && agent_info.active) {
      // Add a debug message to say there's a decision happening for an option set with
      // no DOM element on hte page.
      Drupal.personalize.debug('No DOM element for the following selector in the ' + agent_name + ' personalization: "' + option_set.selector + '"', 3002);
    }
    // Determine any pre-selected option to display.
    if (option_set.hasOwnProperty('winner') && option_set.winner !== null) {
      fallbackIndex = option_set.winner;
    }
    // If we have a pre-selected decision for this option set, just
    // use that.
    var selection = getPreselection(osid);
    if (selection !== false) {
      chosenOption = selection;
      Drupal.personalize.debug('Preselected option being shown for ' + agent_name, 2002);
    }
    // If we're in admin mode just show the first option, or, if available, the "winner" option.
    else if (Drupal.personalize.isAdminMode()) {
      chosenOption = choices[fallbackIndex];
      Drupal.personalize.debug('Fallback option being shown for ' + agent_name + ' because admin mode is on.', 2003);
    }
    // Same for if do-not-track is enabled.
    else if (Drupal.personalize.DNTenabled()) {
      chosenOption = choices[fallbackIndex];
      Drupal.personalize.debug('Fallback option being shown for ' + agent_name + ' because DNT is enabled.', 2004);
    }
    // ... or if the campaign is not running.
    else if (!agent_info.active) {
      chosenOption = choices[fallbackIndex];
      Drupal.personalize.debug('Fallback option being shown for ' + agent_name + ' because the personalization is not running.', 2005);
    }
    // If we now have a chosen option, just call the executor and be done.
    if (chosenOption !== null) {
      if (Drupal.personalize.executors.hasOwnProperty(executor)) {
        Drupal.personalize.executors[executor].execute($option_set, chosenOption, osid);
      }
      return;
    }

    // If there is no agent, then return empty.
    if (!agent_info) {
      return;
    }

    // Build up the agent data, organized into decision points and decisions.
    var agentData = {
      agentName: agent_name,
      agentType: agent_info.type == undefined ? 'default_agent' : agent_info.type,
      enabledContexts: agent_info.enabled_contexts,
      decisionPoints: {},
      fixedTargeting: {}
    };
    agentData.decisionPoints[decision_point] = { choices: {}, callbacks: {}, fallbacks: {}};

    agentData.decisionPoints[decision_point].choices[decision_name] = choices;
    agentData.decisionPoints[decision_point].fallbacks[decision_name] = fallbackIndex;
    addDecisionCallback(executor, agent_name, decision_point, decision_name, $option_set, osid);

    if (option_set.hasOwnProperty('targeting')) {
      // Build up the fixed targeting rules for this option set.
      for (var j in option_set.targeting) {
        if (option_set.targeting.hasOwnProperty(j)) {
          $.extend(agentData.fixedTargeting, getTargeting(option_set.targeting[j]));
        }
      }
    }

    return agentData;
  }

  /**
   * Builds the targeting rules for an option within an option set.
   *
   * @param targeting
   *   The targeting info to extract rules from.
   * @return {object}
   *   An object of targeting rules keyed by feature name.
   */
  function getTargeting(targeting) {
    var rules = {};
    if (targeting.hasOwnProperty('targeting_features')) {
      for (var i in targeting.targeting_features) {
        if (targeting.targeting_features.hasOwnProperty(i)) {
          var feature_name = targeting.targeting_features[i];
          if (targeting.hasOwnProperty('targeting_rules') && targeting.targeting_rules.hasOwnProperty(feature_name)) {
            rules[feature_name] = targeting.targeting_rules[feature_name];
          }
        }
      }
    }
    return rules;
  }

  // Checks the choice for each decision against the valid set of choices
  // for that decision. Returns false if any of the decisions has an invalid
  // choice.
  function decisionsAreValid(decisionsToCheck, validDecisions) {
    var i;
    for (i in decisionsToCheck) {
      if (decisionsToCheck.hasOwnProperty(i)) {
        if (!validDecisions.hasOwnProperty(i) || validDecisions[i].indexOf(decisionsToCheck[i]) == -1) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Adds a decision callback for later processing.
   *
   * @param agent_name
   *   The name of the decision agent.
   * @param decision_point
   *   The decision point to listen for.
   * @param option_sets
   *   The option set jQuery element.
   * @param osid
   *   The option set id.
   */
  function addDecisionCallback(executor, agent_name, decision_point, decision_name, $option_set, osid) {
    // Define the callback function.
    var callback = (function(inner_executor, $inner_option_set, inner_osid, inner_agent_name) {
      return function(decision) {
        Drupal.personalize.debug('Calling the executor for ' + inner_agent_name + ': ' + inner_osid + ': ' + decision, 2020);
        Drupal.personalize.executors[inner_executor].execute($inner_option_set, decision, inner_osid);
        // Fire an event so other code can respond to the decision.
        $(document).trigger('personalizeDecision', [$inner_option_set, decision, inner_osid, inner_agent_name ]);
      }
    }(executor, $option_set, osid, agent_name));
    // Now add it to the array for this decision name.
    decisionCallbacks[agent_name] = decisionCallbacks[agent_name] || {};
    decisionCallbacks[agent_name][decision_point] = decisionCallbacks[agent_name][decision_point] || {};
    decisionCallbacks[agent_name][decision_point][decision_name] = decisionCallbacks[agent_name][decision_point][decision_name] || {};
    decisionCallbacks[agent_name][decision_point][decision_name][osid] = callback;
  }

  /**
   * Executes the callbacks for a decision.
   *
   * @param agent_name
   *   The name of the decision agent.
   * @param decision_point
   *   The decision point that the decision is for.
   * @param decisions
   *   An array of decisions that have been returned for the point.
   *
   * Relies on closure variable decisionCallbacks.
   */
  function executeDecisionCallbacks(agent_name, decision_point, decisions) {
    var callbacks = {};
    if (decisionCallbacks.hasOwnProperty(agent_name) &&
      decisionCallbacks[agent_name].hasOwnProperty(decision_point)) {
      callbacks = decisionCallbacks[agent_name][decision_point];
    }
    // Call each executor callback.
    for (var decision in decisions) {
      if (decisions.hasOwnProperty(decision) && callbacks.hasOwnProperty(decision)) {
        for (var osid in callbacks[decision]) {
          if (callbacks[decision].hasOwnProperty(osid)) {
            callbacks[decision][osid].call(undefined, decisions[decision]);
            // If the option set is shareable, push the decision to the
            // URL.
            if (optionSetIsStateful(osid)) {
              var state = {};
              state[osid] = decisions[decision];
              $.bbq.pushState(state);
            }
          }
        }
      }
    }
  }

  /**
   * Add an action listener for client-side goal events.
   */
  function addActionListener(settings) {
    var adminMode = Drupal.personalize.isAdminMode();
    if (Drupal.hasOwnProperty('visitorActions')) {
      var events = {}, new_events = 0;
      for (var eventName in settings.personalize.actionListeners) {
        if (settings.personalize.actionListeners.hasOwnProperty(eventName) && !processedListeners.hasOwnProperty(eventName)) {
          processedListeners[eventName] = 1;
          events[eventName] = settings.personalize.actionListeners[eventName];
          new_events++;
        }
      }
      if (new_events > 0 && !adminMode) {
        var callback = function(eventName, jsEvent) {
          if (events.hasOwnProperty(eventName)) {
            var goals = events[eventName];
            for (var i in goals) {
              if (goals.hasOwnProperty(i)) {
                var agent = settings.personalize.agent_map[goals[i].agent];
                if (agent !== undefined) {
                  debugGoal(eventName, goals[i].agent, goals[i].value);
                  Drupal.personalize.agents[agent.type].sendGoalToAgent(goals[i].agent, eventName, goals[i].value, jsEvent);
                  $(document).trigger('sentGoalToAgent', [goals[i].agent, eventName, goals[i].value, jsEvent ]);

                }
              }
            }
          }
        };
        Drupal.visitorActions.publisher.subscribe(callback);
      }
    }
  }

  /*
   * W . E . B   S . T . O . R . A . G . E
   *
   * Inspired by https://github.com/pamelafox/lscache.
   */
  Drupal.personalize.storage = Drupal.personalize.storage || {};
  Drupal.personalize.storage.buckets = Drupal.personalize.storage.buckets || {};
  Drupal.personalize.storage.utilities = {
    cachePrefix: 'Drupal.personalize',
    cacheSeparator: ':',

    /**
     * Generates a visitor context bucket for a particular key.
     *
     * Each visitor context option can have it's own cache expiration and
     * therefore it's own bucket.
     *
     * @param key
     *   The key to store.
     * @param context
     *   The type of visitor context for the key.
     * @returns string
     *   The standardized bucket name.
     */
    generateVisitorContextBucketName: function (key, context) {
      return 'visitor_context' + this.cacheSeparator + context + this.cacheSeparator + key;
    },

    /**
     * Gets the expiration for a bucket based on the type of bucket.
     *
     * If a bucket specific expiration cannot be found, then keys are stored
     * in session only.
     *
     * @param bucketName
     *   The name of the bucket, i.e., visitor_context.
     * @returns number
     *   - If local storage then the expiration in number of milliseconds
     *   - If session storage then 0
     *   - If no storage configured then -1
     */
    getBucketExpiration: function (bucketName) {
      var data = {};
      if (Drupal.settings.personalize.cacheExpiration.hasOwnProperty(bucketName)) {
        var expirationSetting = Drupal.settings.personalize.cacheExpiration[bucketName];
        if (expirationSetting == 'session') {
          data.bucketType = 'session';
          data.expires = 0;
        } else {
          data.bucketType = 'local';
          if (expirationSetting === 'none') {
            data.expires = NaN;
          } else {
            // Expiration is set in minutes but used in milliseconds.
            data.expires = expirationSetting * 60 * 1000;
          }
        }
      }
      return data;
    },

    /**
     * A factory method to create/retrieve a storage bucket.
     *
     * @param bucketName
     *   The name of the bucket to retrieve.
     * @returns {Drupal.personalize.storage.bucket}
     *   The bucket instance.
     */
    getBucket: function (bucketName) {
      if (!Drupal.personalize.storage.buckets.hasOwnProperty(bucketName)) {
        var expirationData = this.getBucketExpiration(bucketName);
        if (expirationData.hasOwnProperty('bucketType')) {
          Drupal.personalize.storage.buckets[bucketName] = new Drupal.personalize.storage.bucket(bucketName, expirationData.bucketType, expirationData.expires);
        } else {
          // No cache mechanisms configured for this bucket.
          Drupal.personalize.storage.buckets[bucketName] = new Drupal.personalize.storage.nullBucket(bucketName);
        }
      }
      return Drupal.personalize.storage.buckets[bucketName];
    },

    /**
     * Determine if the current browser supports web storage.
     */
    supportsLocalStorage: function() {
      if (this.supportsHtmlLocalStorage != undefined) {
        return this.supportsHtmlLocalStorage;
      }
      try {
        this.supportsHtmlLocalStorage = 'localStorage' in window && window['localStorage'] !== null;
      } catch (e) {
        this.supportsHtmlLocalStorage = false;
      }
      return this.supportsHtmlLocalStorage;
    },

    /**
     * Purges the storage of any expired cache items.
     */
    maintain: function () {
      if (!this.supportsLocalStorage()) { return; }
      if (this.wasMaintained != undefined) { return; }
      var currentTime = new Date().getTime();
      var num = localStorage.length;
      var expirations = {};

      for (var i = (num-1); i >= 0; i--) {
        var key = localStorage.key(i);
        if (key.indexOf(this.cachePrefix) == 0) {
          // Key names are in the format cachePrefix:bucketName:otherArguments
          var keyParts = key.split(this.cacheSeparator);
          var bucketName = keyParts.length >= 2 ? keyParts[1] : '';
          var expiration = expirations.hasOwnProperty(bucketName) ? expirations[bucketName] : this.getBucketExpiration(bucketName);
          // Store back for fast retrieval.
          expirations[bucketName] = expiration;
          // Make sure the bucket content should expire.
          if (expiration.bucketType === 'local' && !isNaN(expiration.expires)) {
            var stored = localStorage.getItem(key);
            if (stored) {
              var record = JSON.parse(stored);
              // Expire the content if past expiration time.
              if (record.ts && (record.ts + expiration.expires) < currentTime) {
                localStorage.removeItem(key);
              }
            }
          }
        }
      }
      this.wasMaintained = true;
    }
  };

  /**
   * Returns an invalid storage mechanism bucket in a null object pattern.
   *
   * This bucket follows the publicly available methods for the
   * Drupal.personalize.storage.bucket in order to allow reads and writes to
   * fail gracefully when storage is not configured.
   */
  Drupal.personalize.storage.nullBucket = function(bucketName) {
    return {
      read: function (key) {
        return null;
      },
      write: function (key, value) {
        return;
      }
    }
  }

  /**
   * Returns a bucket for reading from and writing to HTML5 web storage.
   *
   * @param bucketName
   *   The name of this bucket of stored items.
   * @param bucketType
   *   The webstorage to use (either local or session).
   * @param expiration
   *   The expiration in minutes for items in this bucket.  NaN for none.
   */
  Drupal.personalize.storage.bucket = function(bucketName, bucketType, expiration) {
    this.bucketName = bucketName;
    if (Drupal.personalize.storage.utilities.supportsLocalStorage()) {
      this.store = bucketType === 'session' ? sessionStorage : localStorage;
    }
    this.expiration = expiration;

  }

  /**
   * Bucket functions.
   */
  Drupal.personalize.storage.bucket.prototype = (function() {
    /**
     * Gets a bucket-specific prefix for a key.
     */
    function getBucketPrefix() {
      return Drupal.personalize.storage.utilities.cachePrefix + Drupal.personalize.storage.utilities.cacheSeparator + this.bucketName;
    }

    /**
     * Generates a standardized key name.
     *
     * @param key
     *   The key string for the key within the current bucket.
     * @returns string
     *   A fully namespaced key to prevent overwriting.
     */
    function generateKey(key) {
      return getBucketPrefix.call(this) + Drupal.personalize.storage.utilities.cacheSeparator + key;
    }

    /**
     * Generates a standardized value to be stored.
     *
     * @param value
     *   The key's value to be written.
     * @returns string
     *   A standardized stringified object that includes the keys:
     *   - ts:  the timestamp that this item was created
     *   - val: the original submitted value to store.
     */
    function generateRecord(value) {
      var now = new Date().getTime();
      var record =  {
        ts: now,
        val: value
      };

      return JSON.stringify(record);
    }

    return {
      /**
       * Reads an item from the bucket.
       *
       * @param key
       *   The bucket-specific key to use to lookup the item.
       * @return
       *   The value set for the key or null if not available.
       */
      read: function (key) {
        if (!Drupal.personalize.storage.utilities.supportsLocalStorage()) { return null; }
        var stored = this.store.getItem(generateKey.call(this,key));
        if (stored) {
          var record = JSON.parse(stored);
          if (typeof record.val !== 'undefined') {
            return record.val;
          }
        }
        return null;
      },

      /**
       * Writes an item to the bucket.
       *
       * @param key
       *   The bucket-specific key to use to store the item.
       * @param value
       *   The value to store.
       */
      write: function (key, value) {
        if (!Drupal.personalize.storage.utilities.supportsLocalStorage()) { return; }
        var fullKey = generateKey.call(this, key);
        var record = generateRecord.call(this, value);
        // Fix for iPad issue - sometimes throws QUOTA_EXCEEDED_ERR on setItem.
        this.store.removeItem(fullKey);
        try {
          this.store.setItem(fullKey, record);
        } catch (e) {
          // @todo Add handling that removes records from storage based on age.
          //if (e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          // For now just carry on without the additional stored values.
          return;
        }
      },

      /**
       * Removes an item from a bucket.
       *
       * @param key
       *   The bucket-specific key to use to remove the item.
       */
      removeItem: function (key) {
        if (!Drupal.personalize.storage.utilities.supportsHtmlLocalStorage()) { return; }
        var fullKey = generateKey.call(this, key);
        this.store.removeItem(fullKey);
      }
    }
  })();

  // A custom Drupal command to merge in settings.  This is required when
  // there are modules in use, such as advagg, that do not include merge
  // settings in their altered command output.
  Drupal.ajax.prototype.commands.personalize_settings_merge = function (ajax, response, status) {
    // For the settings to merge.
    response.merge = true;
    // Call the Drupal settings command to do the actual settings merge.
    this.settings(ajax, response, status);
  };

  /**
   * Helper function to reset variables during tests.
   */
  Drupal.personalize.resetAll = function() {
    sessionId = false;
    processedDecisions = {};
    decisionCallbacks = {};
    processedOptionSets = {};
    processingOptionSets = {};
    processedListeners = {};
    Drupal.personalize.storage.buckets = {};
    delete Drupal.personalize.storage.utilities.wasMaintained;
  };

  Drupal.personalize.debug = function(message, code) {
    if (Drupal.personalize.isDebugMode() && Drupal.hasOwnProperty('personalizeDebug')) {
      Drupal.personalizeDebug.log(message, code);
    }
  }
})(jQuery);
;
(function ($) {

  var eventNamespace = 'visitorActions';

  /**
   * IE8 Compatibility functions.
   */

  /**
   * Duct tape for Array.prototype.forEach.
   *
   * @usage forEach([], function () {}, {});
   *
   * @param array arr
   * @param function iterator
   *   The iterator is provided with the following signature and context.
   *   function (item, index, scope) { this === scope }
   * @param object scope
   *   (optional) The value of the iterator invocation object aka 'this'.
   */
  var forEach = Array.prototype.forEach && function (arr, iterator, scope) {
    Array.prototype.forEach.call(arr, iterator, scope);
  } || function (arr, iterator, scope) {
    'use strict';
    var i, len;
    for (i = 0, len = arr.length; i < len; ++i) {
      iterator.call(scope, arr[i], i, arr);
    }
  };

  /**
   * Duct tape for Array.prototype.some.
   *
   * @usage some([], function () {}, {});
   *
   * @param array arr
   * @param function comparator
   *   The comparator is provided with the following signature and context.
   *   function (item, index, scope) { this === scope }
   * @param object scope
   *   (optional) The value of the iterator invocation object aka 'this'.
   */
  var some = Array.prototype.some && function (arr, comparator, scope) {
    return Array.prototype.some.call(arr, comparator, scope);
  } || function (arr, comparator, scope) {
    'use strict';
    if (arr === null) {
      throw new TypeError();
    }

    var thisp, i,
      t = Object(arr),
      len = t.length >>> 0;
    if (typeof comparator !== 'function') {
      throw new TypeError();
    }

    thisp = arguments[2];
    for (i = 0; i < len; i++) {
      if (i in t && comparator.call(thisp, t[i], i, t)) {
        return true;
      }
    }

    return false;
  }

  /**
   * End of IE8 Compatibility functions.
   */

  /**
   * Provides client side visitor action tracking.
   */
  var Publisher = function () {
    this.subscribers = [];
    this.events = [];
  };

  Publisher.prototype = {
    /**
     * Publishes events to listeners.
     *
     * @param string name
     *   The name of the event being delivered.
     * @param Event event
     *   The JavaScript event object
     * @param Object pageContext
     *   An object of page context data.
     */
    deliver: function (name, event, pageContext) {
      forEach(this.subscribers, function (subscriber) {
       subscriber.call(this, name, event, pageContext);
      });
      this.events.push({
        'name': name,
        'event': event,
        'pageContext': pageContext
      });
    },

    /**
     * Registers subscribers to published data.
     *
     * @param Function subscriber
     *   The subscriber callback for event notifications
     * @param boolean receivePreviousEvents
     *   True to get have the subscriber callback invoked with notifications
     *   for all events of this page request that occurred prior to subscribing.
     *   False to only receive notifications for future events.
     *   Defaults to true.
     */
    subscribe: function (subscriber, receivePreviousEvents) {
      receivePreviousEvents = typeof(receivePreviousEvents) == 'undefined';

      var alreadyExists = some(this.subscribers,
        function(el) {
          return el === subscriber;
        }
      );
      if (!alreadyExists) {
        this.subscribers.push(subscriber);

        if (receivePreviousEvents) {
          forEach(this.events, function (eventData) {
            subscriber.call(this, eventData.name, eventData.event, eventData.pageContext);
          })
        }
      }
    },

    /**
     * Clears a publisher's subscriber and event listings.
     *
     * Used for testing purposes.
     */
    reset: function() {
      this.subscribers = [];
      this.events = [];
    }
  };

  Drupal.visitorActions = Drupal.visitorActions || {};
  Drupal.visitorActions.publisher = new Publisher();

  /**
   * Binds events to selectors for client-side visitor actions.
   */
  Drupal.behaviors.visitorActions = {
    attach: function (context, settings) {
      var name, action, callback, boundActions = {};
      for (name in Drupal.settings.visitor_actions.actions) {
        if (Drupal.settings.visitor_actions.actions.hasOwnProperty(name)) {
          action = Drupal.settings.visitor_actions.actions[name];
          if (Drupal.visitorActions.hasOwnProperty(action.actionable_element) && typeof Drupal.visitorActions[action.actionable_element].bindEvent === 'function') {
            callback = (function (innerName){
              return function (event, actionContext) {
                Drupal.visitorActions.publisher.deliver(innerName, event, actionContext);
              }
            })(name);
            // Keep track of what we have bound actions to.
            boundActions[name] = Drupal.visitorActions[action.actionable_element].bindEvent(name, action, context, callback);
          }
        }
      }
      $(document).trigger('visitorActionsBindActions', [boundActions]);
    }
  };

  /**
   * Generates the page context data for visitor actions.
   */
  Drupal.visitorActions.getPageContext = function() {
    // Start with server-side context settings.
    var actionContext = {};
    actionContext['PageView'] = Drupal.settings.visitor_actions.pageContext;

    // Add client-side context settings.
    var clientContext = {};
    clientContext.ReferralPath = document.referrer;

    // Get the query string as a map
    var queryMap = {}, keyValuePairs = location.search.slice(1).split('&');

    forEach(keyValuePairs, function(keyValuePair) {
      keyValuePair = keyValuePair.split('=');
      queryMap[keyValuePair[0]] = keyValuePair[1] || '';
    });
    // Add query string parameters
    clientContext.Campaign = queryMap.hasOwnProperty('utm_campaign') ? queryMap.utm_campaign : '';
    clientContext.Source = queryMap.hasOwnProperty('utm_source') ? queryMap.utm_source : '';
    clientContext.Medium = queryMap.hasOwnProperty('utm_medium') ? queryMap.utm_medium : '';
    clientContext.Term = queryMap.hasOwnProperty('utm_term') ? queryMap.utm_term : '';
    clientContext.Content = queryMap.hasOwnProperty('utm_content') ? queryMap.utm_content : '';
    actionContext['PageView']['TrafficSource'] = clientContext;
    return actionContext;
  };

  Drupal.visitorActions.link = {
    'bindEvent': function (name, action, context, callback) {
      var actionContext = Drupal.visitorActions.getPageContext();
      // Make sure the selector is valid.
      try {
        var $selector = $(action.identifier, context);
      } catch (error) {
        // Can't add a bind event because the selector is invalid.
        return;
      }
      $selector
        .once('visitorActions-' + name)
        .bind(action.event + '.' + eventNamespace, {'eventNamespace' : eventNamespace}, function (event) {
          // Add link click context to action context.
          if (event.type === 'click') {
            var linkContext = {};
            linkContext.DestinationUrl = $(this).attr('href');
            linkContext.AnchorText = $(this).text();
            linkContext.LinkClasses = $(this).attr('class').split(' ');
            linkContext.DataAttributes = {};
            var linkData = $selector.data();
            for (var dataKey in linkData) {
              var typeData = typeof(linkData[dataKey]);
              if (typeData !== 'object' && typeData !== 'undefined' && typeData !== 'function') {
                linkContext.DataAttributes[dataKey] = linkData[dataKey];
              }
            }
            actionContext.Click = linkContext;
          }
          if (typeof callback === 'function') {
            callback.call(null, event, actionContext)
          }
        });
      return $selector;
    }
  };

  Drupal.visitorActions.form = {
    'bindEvent': function (name, action, context, callback) {
      // Drupal form IDs get their underscores converted to hyphens when
      // output as element IDs in markup.
      var formId = action.identifier.replace(/_/g, '-');
      try {
        var $selector = $('form#' + formId, context);
      } catch (error) {
        // Can't add a bind event because the selector is invalid.
        return null;
      }
      var pageContext = Drupal.visitorActions.getPageContext();
      if ($selector.length == 0 || typeof callback !== 'function') {
        return null;
      }
      if (action.event === 'submit_client') {
        // If the selector is within a Drupal AJAX form then we have to
        // work within the Drupal form processing.
        for (var id in Drupal.settings.ajax) {
          var ajaxed = Drupal.ajax[id];
          if (typeof ajaxed !== 'undefined' && typeof ajaxed.form !== 'undefined' && ajaxed.form.length > 0) {
            if (ajaxed.form[0] === $selector[0]) {
              // Re-assign the eventResponse prototype method so that it can
              // be called from the scope of the instance later.
              ajaxed.drupalEventResponse = Drupal.ajax.prototype.eventResponse;
              // Now use the eventResponse prototype to inject visitor actions
              // callback prior to calling the Drupal event handler.
              ajaxed.eventResponse = function(element, event) {
                // Notify of this action.
                callback.call(null, event, pageContext);
                // Now invoke Drupal's event handling.
                return this.drupalEventResponse(element, event);
              };
              return $selector;
            }
          }
        }

        // Otherwise just bind to the form submit event for a regular client-
        // side form submission.
        $selector
          .once('visitorActions-' + name)
          .bind('submit.' + eventNamespace, {'eventNamespace' : eventNamespace}, function (event) {
            callback.call(null, event, pageContext);
          });
      }
      return $selector;
    }
  };

  var pageViewed = false;

  Drupal.visitorActions.page = {
    'view': function (name, action, context, callback) {
      if (!pageViewed) {
        // Create a dummy "event" object to pass as the first parameter (this
        // is usually a js event representing e.g. a click or a form submission).
        var event = {'type': 'PageView'};
        if (typeof callback === 'function') {
          callback.call(null, event, Drupal.visitorActions.getPageContext());
        }
        pageViewed = true;
      }
    },
    'stay': function (name, action, context, callback) {
      var time = 5; // Default time in seconds.
      if (action.options.hasOwnProperty('remains_for')) {
        time = action.options.remains_for;
      }
      var pageContext = Drupal.visitorActions.getPageContext();
      setTimeout(function (event) {
        if (typeof callback === 'function') {
          callback.call(null, event, pageContext);
        }
      }, time * 1000);
    },
    'scrollToBottom': function (name, action, context, callback) {
      var $windowProcessed = $('html').once('visitorActionsPageBindEvent-' + name);
      if ($windowProcessed.length > 0) {
        var bottomOffset = 100; // Default bottom offset in pixels
        var pageContext = Drupal.visitorActions.getPageContext();
        if (action.hasOwnProperty('options') && action.options.hasOwnProperty('bottom_offset')) {
          bottomOffset = action.options.bottom_offset;
        }
        $(window)
          .bind('scroll.visitorActions-' + name, function (event) {
            var $window = $(event.currentTarget);
            // Fire the event when the user scrolls to within a set number of
            // pixels from the bottom of the page.
            // Taken from the example here http://goo.gl/XfMaZZ
            if($window.scrollTop() + $window.height() > $(document).height() - bottomOffset) {
              $window.unbind('scroll.visitorActions-' + name);
              if (typeof callback === 'function') {
                callback.call(null, event, pageContext);
              }
            }
          });
      }
    },
    'bindEvent': function (name, action, context, callback) {
      if (typeof(this[action.event]) === 'function') {
        this[action.event].call(this, name, action, context, callback);
      }
      return $(window);
    },
    'reset': function() {
      pageViewed = false;
    }
  };

})(jQuery);
;
