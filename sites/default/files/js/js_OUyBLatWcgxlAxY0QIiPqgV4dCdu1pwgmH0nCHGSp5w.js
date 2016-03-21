(function ($) {

  /**
   * Gets the current breakpoint.
   */
  $.fn.checkBreakpoint = function() {
    var size = this.width(),
        breakpoints = {
          'small' : 400,
          'medium' : 760,
          'large' : 980,
          'extra-large' : 1024
        },
        status = new Object,
        state = new Object;

    // Cycle through the breakpoint definitions and find biggest one that is
    // less than the window size.
    for (var name in breakpoints) {
      if (breakpoints[name] < size) {
        state = {
          'size' : size,
          'name' : name,
          'break' : breakpoints[name]
        };
      }
    }

    // Build out the rest of the object with reference data.
    status.breakpoints = breakpoints;
    status.state = state;

    return status;
  }

  /**
   * Make sure a video fits within its parental boundaries.
   */
  function videoCheck(container, video) {
    var containerWidth = container.width(),
        videoWidth = video.attr('width');

    if (containerWidth <= videoWidth && !container.hasClass('video-responsive')) {
      container.addClass('video-responsive').css('padding-bottom', video.data('ratio') + '%');
    }
    else if (containerWidth > videoWidth && container.hasClass('video-responsive')) {
      container.removeClass('video-responsive').css('padding-bottom', '');
    }
  }

  /**
   * Make videos fit the parent container.
   */
  Drupal.behaviors.demonstratieVideo = {
    attach: function (context, settings) {
      $('.file-video video, .file-video iframe, .file-video embed, .file-video object', context).once('demonstratieVideo', function () {
        var video = $(this).addClass('video-embed').data('ratio', $(this).attr('height') / $(this).attr('width') * 100),
            parent = video.parent().addClass('video-wrapper');

        videoCheck(parent, video);

        $(window).resize(function () {
          videoCheck(parent, video);
        });
      });
    }
  };

})(jQuery);
;
(function ($) {

  /**
   * Gets the main title for the item.
   */
  function getTitle(item) {
    var headerSibling = item.prev('h1, h2, h3, h4, h5, h6'),
        headerInside = item.find('h1, h2, h3, h4, h5, h6');

    if (headerSibling.length > 0) {
      return $(headerSibling[0]).text().toLowerCase();
    }
    else if (headerInside.length > 0) {
      return $(headerInside[0]).text().toLowerCase();
    }
    else {
      return null;
    }
  }

  /**
   * Generate the trigger text.
   */
  function triggerText(name) {
    var params = new Object;

    if (name) {
      params['!title'] = name;
      return Drupal.t('Expand the !title', params)
    }
    else {
      return Drupal.t('Expand');
    }
  }

  /**
   * Collapse expanded menus based on the trigger.
   */
  function menuCollapse(trigger) {
    var menuId = trigger.data('menu'),
        menu = $('.collapsible-menu-' + menuId);

    menu.addClass('menu-closed').removeClass('menu-active');
    trigger.removeClass('trigger-active');
  }

  /**
   * Helper function for expanding and collapsing the menu.
   */
  function menuState(menu, trigger, responsive) {
    if (responsive == true) {
      var breakpoint = $(window).checkBreakpoint(),
          stateName = breakpoint.state.name;

      // Hide the content if the screen is the right size.
      if (stateName != 'medium' && stateName != 'large' && stateName != 'extra-large') {
        trigger.removeClass('element-invisible');
        menu.removeClass('menu-active').addClass('menu-closed');
      }
      else {
        trigger.addClass('element-invisible').removeClass('trigger-active');
        menu.removeClass('menu-closed menu-active');
      }
    }

    // Enable the trigger.
    trigger.click(function () {
      if (trigger.hasClass('trigger-active')) {
        trigger.removeClass('trigger-active');
        menu.removeClass('menu-active').addClass('menu-closed');
      }
      else {
        var activeTriggers = $('.trigger-active');

        if (activeTriggers) {
          menuCollapse(activeTriggers);
        }

        trigger.addClass('trigger-active');
        menu.removeClass('menu-closed').addClass('menu-active');
      }

      return false;
    });
  }

  /**
   * Add toggles to expand and collapse blocks.
   */
  Drupal.behaviors.demonstratieMenu = {
    attach: function (context, settings) {
      var counter = 1;

      $('.site-navigation').once('demonstratieMenu', function () {
        var triggerHolder = $('<div>').attr({
              'class' : 'trigger-container'
            });

        triggerHolder.prependTo('.site-navigation');
      });

      $('.main-menu, .secondary-menu').once('demonstratieMenu', function () {
        var menu = $(this).data('trigger', counter).addClass('collapsible-menu-' + counter),
            menuTitle = getTitle(menu),
            triggerLabel = triggerText(menuTitle),
            trigger = $('<a>').data('menu', counter).attr({
              'class' : 'trigger-' + counter + ' trigger-' + menuTitle.split(' ').join('-').toLowerCase() + ' menu-trigger',
              'href' : '#',
              'title' : triggerLabel
            }).text(triggerLabel),
            triggerHolder = $('.trigger-container');

        // Initialize the menus and triggers.
        triggerHolder.append(trigger);
        menuState(menu, trigger, true);

        // Watch for resizing and reevaluate the menu state if it changes.
        $(window).resize(function() {
          menuState(menu, trigger, true);
        });

        counter = counter + 1;
      });
    }
  };

  /**
   * Show header blocks when an icon is clicked.
   */
  Drupal.behaviors.demonstratieHeaderBlock = {
    attach: function (context, settings) {
      $('.header-search .block', context).once('demonstatieHeaderBlock', function () {
        var triggerHolder = $('div.trigger-container'),
            block = $(this).addClass('collapsible-menu-' + $(this).attr('id') + ' collapsible-block menu-closed'),
            menuTitle = getTitle(block),
            triggerLabel = triggerText(menuTitle),
            trigger = $('<a>').data('menu', block.attr('id')).attr({
              'class' : 'trigger-' + block.attr('id') + ' menu-trigger',
              'href' : '#',
              'title' : triggerLabel
            }).text(triggerLabel);

        // Initialize the blocks and triggers.
        triggerHolder.append(trigger);
        menuState(block, trigger);
      });
    }
  };

})(jQuery);
;
