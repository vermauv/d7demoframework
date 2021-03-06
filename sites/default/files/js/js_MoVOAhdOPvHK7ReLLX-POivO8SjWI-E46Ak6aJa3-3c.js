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
