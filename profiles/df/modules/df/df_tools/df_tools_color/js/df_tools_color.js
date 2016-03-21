/**
 * @file
 * Contains all javascript logic for df_tools_color.
 */

(function ($, Drupal) {

  /**
   * Holds persistent data (colors) and defines behaviors for certain popup features.
   *
   * @namespace
   */
  Drupal.DFToolsColor = {

    /**
     * Appends the given color palette to an element.
     *
     * @param {Element} target
     *   The target element to append the given palette to (always the popup).
     * @param {Array} colors
     *   An array returned by Drupal.DFToolsColor.parseColors
     */
    appendPalette: function(target, colors) {
      // Add our parsed colors to the color picker.
      var base_element = $('<input type="text" style="display:none">');

      for (var i in colors) {
        var element = base_element.clone();
        element.data('color-index', i);
        $(target).append(element);
        element.spectrum({
          // Allow users to change the alpha value of colors.
          showAlpha: true,
          // Allow direct input of hex/rgb values.
          showInput: true,
          // Set the default color to the current color in css.
          color: colors[i][0],
          // Default the input format to hex.
          preferredFormat: "hex",
          // Add default classes to the color picker and our color palette.
          containerClassName: 'sp-container-index-' + i,
          change: function(color) {
            var index = $(this).data('color-index');
            Drupal.DFToolsColor.colors[index][0] = color.toHexString();
            Drupal.DFToolsColor.preview();
          },
          hide: function(color) {
            var index = $(this).data('color-index');
            Drupal.DFToolsColor.colors[index][0] = color.toHexString();
            Drupal.DFToolsColor.preview();
          }
        });
      }
      // Store the colors array for future lookups.
      this.colors = colors;
    },

    /**
     * Parses raw CSS as a structured array mapping colors to their selectors.
     *
     * @param {String} css
     *   The raw CSS content of a file or files.
     *
     * @return {Array}
     *   An array mapping colors to selectors, sorted by the number of selectors.
     */
    parseColors: function(css) {
      // Initialize parser object.
      var parser = new cssjs();
      // Parse the loaded css string.
      var parsed = parser.parseCSS(css);
      var parsed_flat = [];

      // Flatten media queries.
      for (var i in parsed) {
        if (parsed[i]['type'] == 'media') {
          // Add each substyle as a normal rule with an extra field (media_selector).
          for (var j in parsed[i]['subStyles']) {
            parsed[i]['subStyles'][j]['media_selector'] = parsed[i]['selector'];
            parsed_flat.push(parsed[i]['subStyles'][j]);
          }
        }
        else {
          parsed_flat.push(parsed[i]);
        }
      }

      // An object is used here to make initial selector sorting easier.
      var colors = {};
      for (var i in parsed_flat) {
        var current = parsed_flat[i]['rules'];
        for (var j in current) {
          var rule = current[j];
          var directives = ['color', 'background-color', 'background'];
          // Some of the css.js parsing isn't perfect, so we need to check that our required fields are present.
          if (rule !== undefined && directives.indexOf(rule['directive']) > -1) {
            // Get absolute rgb value of color using a JS trick.
            var d = document.createElement("div");
            d.style.color = rule['value'];
            document.body.appendChild(d);
            var color = window.getComputedStyle(d).color;
            document.body.removeChild(d);

            // Add this selector to the list of colors.
            if (colors[color] === undefined) {
              colors[color] = [];
            }
            var color_array = [parsed_flat[i]['selector'], rule['directive']];
            if (parsed_flat[i]['media_selector'] !== undefined) {
              color_array.push(parsed_flat[i]['media_selector']);
            }
            colors[color].push(color_array);
          }
        }
      }

      // Order the list.
      colors_ordered = [];
      for (var i in colors) {
        colors_ordered.push([i, colors[i]]);
      }

      // Sort the list from most selectors > least selectors.
      colors_ordered.sort(function (a, b) {
        return (b[1].length - a[1].length);
      });

      return colors_ordered;
    },

    /**
     * Callback for external iframes, which parses colors from an iframe and appends them to the external palette.
     *
     * @param {Element} iframe
     *   The external iframe.
     *
     */
    iframeLoad: function(iframe) {
      var body = $(iframe).contents().find('body');
      $(iframe).hide();

      html2canvas(body, {
        onrendered: function( canvas ) {
          var image = new Image();
          image.src = canvas.toDataURL();
          var colorThief = new ColorThief();
          var palette = colorThief.getPalette(image, 13);

          var wrapper = $('.external-color-palette');
          wrapper.empty();

          for (var i in palette) {
            var swatch = $('<div></div>');
            var color = palette[i][0] + ',' + palette[i][1] + ',' + palette[i][2];
            swatch.css('background-color', 'rgb(' + color + ')');
            swatch.addClass('external-swatch');
            swatch.draggable({
              revert: true,
              revertDuration: 0,
              helper: 'clone',
              appendTo: 'body',
              stop: function (event, ui) {
                var element = document.elementFromPoint(event.pageX, event.pageY - window.pageYOffset);
                var input = $(element).closest('.sp-replacer').prev();
                var color = $(event.srcElement).css('background-color');
                if (input.length && typeof input.spectrum != 'undefined') {
                  input.spectrum('set', color);
                  input.spectrum('show');
                  input.spectrum('hide');
                }
              }
            });
            wrapper.append(swatch);
          }

          $('base').attr('href','');

          // Remove the progress class.
          wrapper.removeClass('color-processing');
        },
        logging: true
      });
    },

    /**
     * Sets up the process of extracting a color palette from a given url.
     *
     * @param {String} url
     *   The target external url.
     *
     */
    parseExternalColors: function(url) {
      // This is required for CORS compliance
      $.getJSON('/df_tools_color/proxy?url=' + encodeURIComponent(url), function(data) {
        if (typeof data.contents != 'undefined') {
          $(document.body).append($('<div></div>').addClass('df-tools-color-external-canvas'));

          // Create a canvas element based on the given webpage.
          // Borrowed from http://html2canvas.hertzen.com/site/console.js
          var urlParts = document.createElement('a');
          urlParts.href = url;

          var iframe = document.createElement('iframe');
          $(iframe).css({
            'visibility': 'hidden'
          }).width($(window).width()).height($(window).height());
          $(document.body).append(iframe);
          d = iframe.contentWindow.document;

          d.open();

          $(iframe.contentWindow).load(Drupal.DFToolsColor.iframeLoad.bind(null, iframe));

          $('base').attr('href', urlParts.protocol + "//" + urlParts.hostname + "/" + urlParts.pathname);
          var html = data.contents.replace("<head>", "<head><base href='" + urlParts.protocol + "//" + urlParts.hostname + "/" + urlParts.pathname + "'  />");
          html = html.replace(/\<script/gi,"<!--<script");
          html = html.replace(/\<\/script\>/gi,"<\/script>-->");

          d.write(html);
          d.close();
        }
      });
    },

    /**
     * Sets up a one-time click event to get the color of the selected element.
     *
     */
    selectColor: function() {
      $(document).on('click', function(e) {
        e.preventDefault();
        if (!$(e.target).hasClass('df-tools-color-dropper')) {
          // @todo Bubble up parent styles and give priority to background/background-color.
          var style = window.getComputedStyle(e.target);
          var color = '';
          var styles = ['background', 'background-color', 'color'];
          for (var i in styles) {
            // Don't select transparent or white colors, people can eyeball that.
            if (
              style[styles[i]] != '' &&
              style[styles[i]].indexOf('rgb(255, 255, 255') != 0 &&
              style[styles[i]].indexOf('rgba(0, 0, 0, 0)') != 0
            ){
              color = style[styles[i]].replace(/\).*/, ')');
              break;
            }
          }

          // Click on the associated color in the palette.
          var palette = $('.current-color-palette');
          var found = false;
          palette.find('.sp-preview-inner').each(function() {
            // Get computed style for this element.
            if ($(this).css('background-color') == color) {
              // Simulate a click.
              $(this).click();
              found = true;
            }
          });

          if (!found) {
            // Add temporary error message to palette.
            palette.addClass('error');
            setTimeout(function() {
              palette.removeClass('dropper-lock error');
            }, 500);
          }
          else {
            // Disable the dropper mode/this event.
            palette.removeClass('dropper-lock');
          }

          // This click event should only fire once.
          $(this).off(e);
        }
      });
    },

    /**
     * Initializes the popup, its children, and all related behaviors and event handlers.
     *
     */
    init: function() {
      // Create the popup.
      var popup = $('<div></div>');
      popup.addClass('df-tools-color-popup color-processing');

      $(document.body).append(popup);

      // Fetch data about our current colors.
      $.get('/df_tools_color/css', function (data) {
        // Add a dummy style tag that we can shove preview data in.
        $(document.head).append('<style type="text/css" class="df-tools-color-style"></style>');

        // Add an eyedropper icon.
        var dropper = $('<a></a>');
        dropper.addClass('df-tools-color-dropper');
        popup.append(dropper);

        // Add a click handler.
        dropper.on('click', function(e) {
          $('.current-color-palette').scrollTop(0).addClass('dropper-lock');
          Drupal.DFToolsColor.selectColor();
        });

        // Add a header.
        popup.append('<h4>Current Colors</h4>');

        //Add the current color palette.
        var colors = Drupal.DFToolsColor.parseColors(data);
        var popup_child = $('<div></div>');
        popup_child.addClass('current-color-palette color-palette');
        Drupal.DFToolsColor.appendPalette(popup_child, colors);

        // Append the palette.
        popup.append(popup_child);

        // Add the input field for colors from other websites.
        popup.append('<h4>External Colors</h4>');
        var input = $('<input>');
        input.addClass('color-crawler-site');
        input.attr('type', 'text');
        popup.append(input);
        var submit = $('<button>Go</button>');
        submit.addClass('color-crawler-submit');
        popup.append(submit);

        // Add the empty external color palette.
        var external = $('<div></div>');
        external.addClass('external-color-palette color-palette');
        popup.append(external);

        // Add a click handler.
        submit.on('click', function(e) {
          var url = $(this).siblings('.color-crawler-site').val();
          // Append a progress bar to the palette
          $('.external-color-palette').empty().addClass('color-processing');
          Drupal.DFToolsColor.parseExternalColors(url);
        });

        // Add a save button.
        var save = $('<button>Save</button>');
        save.addClass('df-tools-color-save');
        popup.append(save);

        // Add a click handler.
        save.on('click', function(e) {
          Drupal.DFToolsColor.save();
        });

        // Add a reset button.
        var reset = $('<button>Reset</button>');
        reset.addClass('df-tools-color-reset');
        popup.append(reset);

        // Add a click handler.
        reset.on('click', function(e) {
          Drupal.DFToolsColor.reset();
        });

        // Finally append the completed popup.
        $(popup).removeClass('color-processing');

        // Fix for scrolling past color palette contents.
        $('.color-palette').mouseenter(function(e) {
          $('body').css('overflow', 'hidden');
        }).mouseleave(function(e){
          $('body').css('overflow', '');
        });
      });
    },

    /**
     * Saves the current color palette and reloads the page.
     *
     */
    save: function() {
      $.post('/df_tools_color/css/save', {colors: JSON.stringify(this.colors)})
        .done(function(data) {
          location.reload();
        });
    },

    /**
     * Contacts the server to compile our palette as CSS and append it to a temporary style tag.
     *
     */
    preview: function() {
      $.post('/df_tools_color/css/preview', {colors: JSON.stringify(this.colors)})
        .done(function(data) {
          $('.df-tools-color-style').empty().append(data);
        });
    },

    /**
     * Deletes the current CSS file and refreshes the page.
     *
     */
    reset: function() {
      $.post('/df_tools_color/css/reset')
        .done(function(data) {
          location.reload();
        });
    }
  };

  /**
   * Attaches DF Tools Color behaviors for a navbar popup.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Initializes the popup and all of its components, when the navbar icon is clicked.
   */
  Drupal.behaviors.DFToolsColor = {
    attach: function (context) {
      $(document.body, context).once('df_tools_color_icon', function () {
        $('.df-tools-color-icon').on('click', function () {
          // Init the popup if it doesn't exist.
          if (!$('.df-tools-color-popup').length) {
            Drupal.DFToolsColor.init();
          }
          // Toggle popup visibility.
          if (!$(this).hasClass('open')) {
            $(this).addClass('open');
            $('.df-tools-color-popup').show();
          }
          else {
            $(this).removeClass('open');
            $('.df-tools-color-popup').hide();
          }
        });
      });
    }
  };


})(jQuery, Drupal);
