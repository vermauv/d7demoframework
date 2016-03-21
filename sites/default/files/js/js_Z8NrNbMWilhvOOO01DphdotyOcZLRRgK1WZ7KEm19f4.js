(function($) {
  Drupal.behaviors.custom_search = {
    attach: function(context) {

      if (!Drupal.settings.custom_search.solr) {
        // Check if the search box is not empty on submit
        $('form.search-form', context).submit(function(){
          var $this = $(this);
          var box = $this.find('input.custom-search-box');
          if (box.val() != undefined && box.val() == '') {
            $this.find('input.custom-search-box').addClass('error');
            return false;
          }
          // If basic search is hidden, copy or value to the keys
          if ($this.find('#edit-keys').parents('div.element-invisible').attr('class') == 'element-invisible') {
            $this.find('#edit-keys').val($this.find('#edit-or').val());
            $this.find('#edit-or').val('');
          }
          return true;
        });
      }

      // Search from target
      $('form.search-form').attr('target', Drupal.settings.custom_search.form_target);

      // Displays Popup.
      $('form.search-form input.custom-search-box', context).bind('click focus', function(e){
        var $parentForm = $(this).parents('form');
        // check if there's something in the popup and displays it
        var popup = $parentForm.find('fieldset.custom_search-popup');
        if (popup.find('input,select').length && !popup.hasClass('opened')) {
          popup.fadeIn().addClass('opened');
        }
        e.stopPropagation();
      });
      $(document).bind('click focus', function(){
        $('fieldset.custom_search-popup').hide().removeClass('opened');
      });

      // Handle checkboxes
      $('.custom-search-selector input:checkbox', context).each(function(){
        var el = $(this);
        if (el.val() == 'c-all') {
          el.change(function(){
            $(this).parents('.custom-search-selector').find('input:checkbox[value!=c-all]').attr('checked', false);
          });
        }
        else {
          if (el.val().substr(0,2) == 'c-') {
            el.change(function(){
              $('.custom-search-selector input:checkbox').each(function(){
                if ($(this).val().substr(0,2) == 'o-') {
                  $(this).attr('checked', false);
                }
              });
              $(this).parents('.custom-search-selector').find('input:checkbox[value=c-all]').attr('checked', false);
            });
          } else {
            el.change(function(){
              $(this).parents('.custom-search-selector').find('input:checkbox[value!=' + el.val() + ']').attr('checked', false);
            });
          }
        }
      });

      // Handle popup.
      var popup = $('fieldset.custom_search-popup:not(.custom_search-processed)', context).addClass("custom_search-processed");
      popup.click(function(e){
        e.stopPropagation();
      })
      popup.append('<a class="custom_search-popup-close" href="#">' + Drupal.t('Close') + '</a>');
      $('a.custom_search-popup-close').click(function(e){
        $('fieldset.custom_search-popup.opened').hide().removeClass('opened');
        e.preventDefault();
      });

    }
  }
})(jQuery);
;
/**
 * @file
 * Add jCarousel behaviors to the page and provide Views-support.
 */

(function($) {

Drupal.behaviors.jcarousel = {};
Drupal.behaviors.jcarousel.attach = function(context, settings) {
  settings = settings || Drupal.settings;

  // If no carousels exist on this part of the page, work no further. 
  if (!settings.jcarousel || !settings.jcarousel.carousels) {
    return;
  }

  $("ul.jcarousel li").css("display", "");

  $.each(settings.jcarousel.carousels, function(key, options) {
    var $carousel = $(options.selector + ':not(.jcarousel-processed)', context);

    // If this carousel has already been processed or doesn't exist, move on.
    if (!$carousel.length) {
      return;
    }

    // Callbacks need to be converted from a string to an actual function.
    $.each(options, function(optionKey) {
      if (optionKey.match(/Callback$/) && typeof options[optionKey] == 'string') {
        var callbackFunction = window;
        var callbackParents = options[optionKey].split('.');
        $.each(callbackParents, function(objectParent) {
          callbackFunction = callbackFunction[callbackParents[objectParent]];
        });
        options[optionKey] = callbackFunction;
      }
    });

    // Add standard options required for AJAX functionality.
    if (options.ajax && !options.itemLoadCallback) {
      options.itemLoadCallback = Drupal.jcarousel.ajaxLoadCallback;
    }

    // If auto-scrolling, pause animation when hoving over the carousel.
    if (options.auto && options.autoPause && !options.initCallback) {
      options.initCallback = function(carousel, state) {
        Drupal.jcarousel.autoPauseCallback(carousel, state);
      };
    }

    // Add responsive behavior.
    if (options.responsive  && !options.reloadCallback) {
      options.vertical = false;
      options.visible = null;
      options.reloadCallback = Drupal.jcarousel.reloadCallback;
    }

    // Add navigation to the carousel if enabled.
    if (!options.setupCallback) {
      options.setupCallback = function(carousel) {
        Drupal.jcarousel.setupCarousel(carousel);
        if (options.navigation) {
          Drupal.jcarousel.addNavigation(carousel, options.navigation);
        }
        if (options.responsive) {
          carousel.reload();
        }
      };
      if (options.navigation && !options.itemVisibleInCallback) {
        options.itemLastInCallback = {
          onAfterAnimation: Drupal.jcarousel.updateNavigationActive
        };
      }
    }

    if (!options.hasOwnProperty('buttonNextHTML') && !options.hasOwnProperty('buttonPrevHTML')) {
      options.buttonNextHTML = Drupal.theme('jCarouselButton', 'next');
      options.buttonPrevHTML = Drupal.theme('jCarouselButton', 'previous');
    }

    // Initialize the jcarousel.
    $carousel.addClass('jcarousel-processed').jcarousel(options);
  });
};

Drupal.jcarousel = {};
Drupal.jcarousel.reloadCallback = function(carousel) {
  // Set the clip and container to auto width so that they will fill
  // the available space.
  carousel.container.css('width', 'auto');
  carousel.clip.css('width', 'auto');
  var clipWidth = carousel.clip.width();
  var containerExtra = carousel.container.width() - carousel.clip.outerWidth(true);
  // Determine the width of an item.
  var itemWidth = carousel.list.find('li').first().outerWidth(true);
  var numItems = Math.floor(carousel.clip.width() / itemWidth) || 1;
  // Set the new scroll number.
  carousel.options.scroll = numItems;
  var newClipWidth = numItems * itemWidth;
  var newContainerWidth = newClipWidth + containerExtra;
  // Resize the clip and container.
  carousel.clip.width(newClipWidth);
  carousel.container.width(newContainerWidth);
};
Drupal.jcarousel.ajaxLoadCallback = function(jcarousel, state) {
  // Check if the requested items already exist.
  if (state == 'init' || jcarousel.has(jcarousel.first, jcarousel.last)) {
    return;
  }

  var $list = jcarousel.list;
  var $view = $list.parents('.view:first');
  var ajaxPath = Drupal.settings.jcarousel.ajaxPath;
  var target = $view.get(0);

  // Find this view's settings in the Views AJAX settings.
  var settings;
  $.each(Drupal.settings.jcarousel.carousels, function(domID, carouselSettings) {
    if ($list.is('.' + domID)) {
      settings = carouselSettings['view_options'];
    }
  });

  // Copied from ajax_view.js:
  var viewData = { 'js': 1, 'first': jcarousel.first - 1, 'last': jcarousel.last };
  // Construct an object using the settings defaults and then overriding
  // with data specific to the link.
  $.extend(
    viewData,
    settings
  );

  $.ajax({
    url: ajaxPath,
    type: 'GET',
    data: viewData,
    success: function(response) {
      Drupal.jcarousel.ajaxResponseCallback(jcarousel, target, response);
    },
    error: function(xhr) {
      Drupal.jcarousel.ajaxErrorCallback(xhr, ajaxPath);
    },
    dataType: 'json'
  });

};

/**
 * Init callback for jCarousel. Pauses the carousel when hovering over.
 */
Drupal.jcarousel.autoPauseCallback = function(carousel, state) {
  function pauseAuto() {
    carousel.stopAuto();
  }
  function resumeAuto() {
    carousel.startAuto();
  }
  carousel.clip.hover(pauseAuto, resumeAuto);
  carousel.buttonNext.hover(pauseAuto, resumeAuto);
  carousel.buttonPrev.hover(pauseAuto, resumeAuto);
};

/**
 * Setup callback for jCarousel. Calculates number of pages.
 */
Drupal.jcarousel.setupCarousel = function(carousel) {
  // Determine the number of pages this carousel includes.
  // This only works for a positive starting point. Also, .first is 1-based
  // while .last is a count, so we need to reset the .first number to be
  // 0-based to make the math work.
  carousel.pageSize = carousel.last - (carousel.first - 1);

  // jCarousel's Views integration sets "size" in the carousel options. Use that
  // if available, otherwise count the number of items in the carousel.
  var itemCount = carousel.options.size ? carousel.options.size : $(carousel.list).children('li').length;
  carousel.pageCount =  Math.ceil(itemCount / carousel.pageSize);
  carousel.pageNumber = 1;

  // Disable the previous/next arrows if there is only one page.
  if (carousel.options.wrap != 'circular' && carousel.pageCount == 1) {
    carousel.buttons(false, false);
  }

  // Always remove the hard-coded display: block from the navigation.
  carousel.buttonNext.css('display', '');
  carousel.buttonPrev.css('display', '');
}

/**
 * Setup callback for jCarousel. Adds the navigation to the carousel if enabled.
 */
Drupal.jcarousel.addNavigation = function(carousel, position) {
  // Don't add a pager if there's only one page of results.
  if (carousel.pageCount <= 1) {
    return;
  }

  // Add a class to the wrapper so it can adjust CSS.
  $(carousel.list).parents('.jcarousel-container:first').addClass('jcarousel-navigation-' + position);

  var navigation = $('<ul class="jcarousel-navigation"></ul>');

  for (var i = 1; i <= carousel.pageCount; i++) {
    var pagerItem = $(Drupal.theme('jCarouselPageLink', i));
    var listItem = $('<li></li>').attr('jcarousel-page', i).append(pagerItem);
    navigation.append(listItem);

    // Make the first page active by default.
    if (i === 1) {
      listItem.addClass('active');
    }

    // Scroll to the correct page when a pager is clicked.
    pagerItem.bind('click', function() {
      // We scroll to the new page based on item offsets. This works with
      // circular carousels that do not divide items evenly, making it so that
      // going back or forward in pages will not skip or repeat any items.
      var newPageNumber = $(this).parent().attr('jcarousel-page');
      var itemOffset = (newPageNumber - carousel.pageNumber) * carousel.pageSize;

      if (itemOffset) {
        carousel.scroll(carousel.first + itemOffset);
      }

      return false;
    });
  }

  $(carousel.list).parents('.jcarousel-clip:first')[position](navigation);
}

/**
 * itemVisibleInCallback for jCarousel. Update the navigation after page change.
 */
Drupal.jcarousel.updateNavigationActive = function(carousel, item, idx, state) {
  // The navigation doesn't even exist yet when this is called on init.
  var $listItems = $(carousel.list).parents('.jcarousel-container:first').find('.jcarousel-navigation li');
  if ($listItems.length == 0) {
    return;
  }

  // jCarousel does some very odd things with circular wraps. Items before the
  // first item are given negative numbers and items after the last are given
  // numbers beyond the total number of items. This complicated logic calculates
  // which page number is active based off this numbering scheme.
  var pageNumber = Math.ceil(idx / carousel.pageSize);
  if (pageNumber <= 0 || pageNumber > carousel.pageCount) {
    pageNumber = pageNumber % carousel.pageCount;
    pageNumber = pageNumber == 0 ? carousel.pageCount : pageNumber;
    pageNumber = pageNumber < 0 ? pageNumber + carousel.pageCount : pageNumber;
  }
  carousel.pageNumber = pageNumber;
  var currentPage = $listItems.get(carousel.pageNumber - 1);

  // Set the current page to be active.
  $listItems.not(currentPage).removeClass('active');
  $(currentPage).addClass('active');
}

/**
 * AJAX callback for all jCarousel-style views.
 */
Drupal.jcarousel.ajaxResponseCallback = function(jcarousel, target, response) {
  if (response.debug) {
    alert(response.debug);
  }

  var $view = $(target);
  var jcarousel = $view.find('ul.jcarousel').data('jcarousel');

  // Add items to the jCarousel.
  $('ul.jcarousel > li', response.display).each(function(i) {
    var itemNumber = this.className.replace(/.*?jcarousel-item-(\d+).*/, '$1');
    jcarousel.add(itemNumber, this.innerHTML);
  });

  // Add Drupal behaviors to the content of the carousel to affect new items.
  Drupal.attachBehaviors(jcarousel.list.get(0));

  // Treat messages the same way that Views typically handles messages.
  if (response.messages) {
    // Show any messages (but first remove old ones, if there are any).
    $view.find('.views-messages').remove().end().prepend(response.messages);
  }
};

/**
 * Display error messages using the same mechanism as Views module.
 */
Drupal.jcarousel.ajaxErrorCallback = function (xhr, path) {
  var error_text = '';

  if ((xhr.status == 500 && xhr.responseText) || xhr.status == 200) {
    error_text = xhr.responseText;

    // Replace all &lt; and &gt; by < and >
    error_text = error_text.replace("/&(lt|gt);/g", function (m, p) {
      return (p == "lt")? "<" : ">";
    });

    // Now, replace all html tags by empty spaces
    error_text = error_text.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi,"");

    // Fix end lines
    error_text = error_text.replace(/[\n]+\s+/g,"\n");
  }
  else if (xhr.status == 500) {
    error_text = xhr.status + ': ' + Drupal.t("Internal server error. Please see server or PHP logs for error information.");
  }
  else {
    error_text = xhr.status + ': ' + xhr.statusText;
  }

  alert(Drupal.t("An error occurred at @path.\n\nError Description: @error", {'@path': path, '@error': error_text}));
};

Drupal.theme.prototype.jCarouselButton = function(type) {
  // Use links for buttons for accessibility.
  return '<a href="javascript:void(0)"></a>';
};

Drupal.theme.prototype.jCarouselPageLink = function(pageNumber) {
  return '<a href="javascript:void(0)"><span>' + (pageNumber) + '</span></a>';
};

})(jQuery);
;
/*!
 * jCarousel - Riding carousels with jQuery
 *   http://sorgalla.com/jcarousel/
 *
 * Copyright (c) 2006 Jan Sorgalla (http://sorgalla.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Built on top of the jQuery library
 *   http://jquery.com
 *
 * Inspired by the "Carousel Component" by Bill Scott
 *   http://billwscott.com/carousel/
 */

(function(c){var d={vertical:false,rtl:false,start:1,offset:1,size:null,scroll:3,visible:null,animation:"normal",easing:"swing",auto:0,wrap:null,initCallback:null,setupCallback:null,reloadCallback:null,itemLoadCallback:null,itemFirstInCallback:null,itemFirstOutCallback:null,itemLastInCallback:null,itemLastOutCallback:null,itemVisibleInCallback:null,itemVisibleOutCallback:null,animationStepCallback:null,buttonNextHTML:"<div></div>",buttonPrevHTML:"<div></div>",buttonNextEvent:"click",buttonPrevEvent:"click",buttonNextCallback:null,buttonPrevCallback:null,itemFallbackDimension:null},b=false;c(window).bind("load.jcarousel",function(){b=true});c.jcarousel=function(l,g){this.options=c.extend({},d,g||{});this.locked=false;this.autoStopped=false;this.container=null;this.clip=null;this.list=null;this.buttonNext=null;this.buttonPrev=null;this.buttonNextState=null;this.buttonPrevState=null;if(!g||g.rtl===undefined){this.options.rtl=(c(l).attr("dir")||c("html").attr("dir")||"").toLowerCase()=="rtl"}this.wh=!this.options.vertical?"width":"height";this.lt=!this.options.vertical?(this.options.rtl?"right":"left"):"top";var q="",n=l.className.split(" ");for(var k=0;k<n.length;k++){if(n[k].indexOf("jcarousel-skin")!=-1){c(l).removeClass(n[k]);q=n[k];break}}if(l.nodeName.toUpperCase()=="UL"||l.nodeName.toUpperCase()=="OL"){this.list=c(l);this.clip=this.list.parents(".jcarousel-clip");this.container=this.list.parents(".jcarousel-container")}else{this.container=c(l);this.list=this.container.find("ul,ol").eq(0);this.clip=this.container.find(".jcarousel-clip")}if(this.clip.size()===0){this.clip=this.list.wrap("<div></div>").parent()}if(this.container.size()===0){this.container=this.clip.wrap("<div></div>").parent()}if(q!==""&&this.container.parent()[0].className.indexOf("jcarousel-skin")==-1){this.container.wrap('<div class=" '+q+'"></div>')}this.buttonPrev=c(".jcarousel-prev",this.container);if(this.buttonPrev.size()===0&&this.options.buttonPrevHTML!==null){this.buttonPrev=c(this.options.buttonPrevHTML).appendTo(this.container)}this.buttonPrev.addClass(this.className("jcarousel-prev"));this.buttonNext=c(".jcarousel-next",this.container);if(this.buttonNext.size()===0&&this.options.buttonNextHTML!==null){this.buttonNext=c(this.options.buttonNextHTML).appendTo(this.container)}this.buttonNext.addClass(this.className("jcarousel-next"));this.clip.addClass(this.className("jcarousel-clip")).css({position:"relative"});this.list.addClass(this.className("jcarousel-list")).css({overflow:"hidden",position:"relative",top:0,margin:0,padding:0}).css((this.options.rtl?"right":"left"),0);this.container.addClass(this.className("jcarousel-container")).css({position:"relative"});if(!this.options.vertical&&this.options.rtl){this.container.addClass("jcarousel-direction-rtl").attr("dir","rtl")}var m=this.options.visible!==null?Math.ceil(this.clipping()/this.options.visible):null;var p=this.list.children("li");var r=this;if(p.size()>0){var f=0,h=this.options.offset;p.each(function(){r.format(this,h++);f+=r.dimension(this,m)});this.list.css(this.wh,(f+100)+"px");if(!g||g.size===undefined){this.options.size=p.size()}}this.container.css("display","block");this.buttonNext.css("display","block");this.buttonPrev.css("display","block");this.funcNext=function(){r.next();return false};this.funcPrev=function(){r.prev();return false};this.funcResize=function(){if(r.resizeTimer){clearTimeout(r.resizeTimer)}r.resizeTimer=setTimeout(function(){r.reload()},100)};if(this.options.initCallback!==null){this.options.initCallback(this,"init")}if(!b&&a.isSafari()){this.buttons(false,false);c(window).bind("load.jcarousel",function(){r.setup()})}else{this.setup()}};var a=c.jcarousel;a.fn=a.prototype={jcarousel:"0.2.9"};a.fn.extend=a.extend=c.extend;a.fn.extend({setup:function(){this.first=null;this.last=null;this.prevFirst=null;this.prevLast=null;this.animating=false;this.timer=null;this.resizeTimer=null;this.tail=null;this.inTail=false;if(this.locked){return}this.list.css(this.lt,this.pos(this.options.offset)+"px");var e=this.pos(this.options.start,true);this.prevFirst=this.prevLast=null;this.animate(e,false);c(window).unbind("resize.jcarousel",this.funcResize).bind("resize.jcarousel",this.funcResize);if(this.options.setupCallback!==null){this.options.setupCallback(this)}},reset:function(){this.list.empty();this.list.css(this.lt,"0px");this.list.css(this.wh,"10px");if(this.options.initCallback!==null){this.options.initCallback(this,"reset")}this.setup()},reload:function(){if(this.tail!==null&&this.inTail){this.list.css(this.lt,a.intval(this.list.css(this.lt))+this.tail)}this.tail=null;this.inTail=false;if(this.options.reloadCallback!==null){this.options.reloadCallback(this)}if(this.options.visible!==null){var g=this;var h=Math.ceil(this.clipping()/this.options.visible),f=0,e=0;this.list.children("li").each(function(j){f+=g.dimension(this,h);if(parseInt(jQuery(this).attr("jcarouselindex"))<g.first){e=f}});this.list.css(this.wh,f+"px");this.list.css(this.lt,-e+"px")}this.scroll(this.first,false)},lock:function(){this.locked=true;this.buttons()},unlock:function(){this.locked=false;this.buttons()},size:function(e){if(e!==undefined){this.options.size=e;if(!this.locked){this.buttons()}}return this.options.size},has:function(g,h){if(h===undefined||!h){h=g}if(this.options.size!==null&&h>this.options.size){h=this.options.size}for(var f=g;f<=h;f++){var k=this.get(f);if(!k.length||k.hasClass("jcarousel-item-placeholder")){return false}}return true},get:function(e){return c(">.jcarousel-item-"+e,this.list)},add:function(l,q){var m=this.get(l),h=0,g=c(q);if(m.length===0){var p,k=a.intval(l);m=this.create(l);while(true){p=this.get(--k);if(k<=0||p.length){if(k<=0){this.list.prepend(m)}else{p.after(m)}break}}}else{h=this.dimension(m)}if(g.get(0).nodeName.toUpperCase()=="LI"){m.replaceWith(g);m=g}else{m.empty().append(q)}this.format(m.removeClass(this.className("jcarousel-item-placeholder")),l);var o=this.options.visible!==null?Math.ceil(this.clipping()/this.options.visible):null;var f=this.dimension(m,o)-h;if(l>0&&l<this.first){this.list.css(this.lt,a.intval(this.list.css(this.lt))-f+"px")}this.list.css(this.wh,a.intval(this.list.css(this.wh))+f+"px");return m},remove:function(f){var g=this.get(f);if(!g.length||(f>=this.first&&f<=this.last)){return}var h=this.dimension(g);if(f<this.first){this.list.css(this.lt,a.intval(this.list.css(this.lt))+h+"px")}g.remove();this.list.css(this.wh,a.intval(this.list.css(this.wh))-h+"px")},next:function(){if(this.tail!==null&&!this.inTail){this.scrollTail(false)}else{this.scroll(((this.options.wrap=="both"||this.options.wrap=="last")&&this.options.size!==null&&this.last==this.options.size)?1:this.first+this.options.scroll)}},prev:function(){if(this.tail!==null&&this.inTail){this.scrollTail(true)}else{this.scroll(((this.options.wrap=="both"||this.options.wrap=="first")&&this.options.size!==null&&this.first==1)?this.options.size:this.first-this.options.scroll)}},scrollTail:function(e){if(this.locked||this.animating||!this.tail){return}this.pauseAuto();var f=a.intval(this.list.css(this.lt));f=!e?f-this.tail:f+this.tail;this.inTail=!e;this.prevFirst=this.first;this.prevLast=this.last;this.animate(f)},scroll:function(f,e){if(this.locked||this.animating){return}this.pauseAuto();this.animate(this.pos(f),e)},pos:function(C,k){var n=a.intval(this.list.css(this.lt));if(this.locked||this.animating){return n}if(this.options.wrap!="circular"){C=C<1?1:(this.options.size&&C>this.options.size?this.options.size:C)}var z=this.first>C;var E=this.options.wrap!="circular"&&this.first<=1?1:this.first;var H=z?this.get(E):this.get(this.last);var B=z?E:E-1;var F=null,A=0,w=false,G=0,D;while(z?--B>=C:++B<C){F=this.get(B);w=!F.length;if(F.length===0){F=this.create(B).addClass(this.className("jcarousel-item-placeholder"));H[z?"before":"after"](F);if(this.first!==null&&this.options.wrap=="circular"&&this.options.size!==null&&(B<=0||B>this.options.size)){D=this.get(this.index(B));if(D.length){F=this.add(B,D.clone(true))}}}H=F;G=this.dimension(F);if(w){A+=G}if(this.first!==null&&(this.options.wrap=="circular"||(B>=1&&(this.options.size===null||B<=this.options.size)))){n=z?n+G:n-G}}var s=this.clipping(),u=[],h=0,t=0;H=this.get(C-1);B=C;while(++h){F=this.get(B);w=!F.length;if(F.length===0){F=this.create(B).addClass(this.className("jcarousel-item-placeholder"));if(H.length===0){this.list.prepend(F)}else{H[z?"before":"after"](F)}if(this.first!==null&&this.options.wrap=="circular"&&this.options.size!==null&&(B<=0||B>this.options.size)){D=this.get(this.index(B));if(D.length){F=this.add(B,D.clone(true))}}}H=F;G=this.dimension(F);if(G===0){throw new Error("jCarousel: No width/height set for items. This will cause an infinite loop. Aborting...")}if(this.options.wrap!="circular"&&this.options.size!==null&&B>this.options.size){u.push(F)}else{if(w){A+=G}}t+=G;if(t>=s){break}B++}for(var r=0;r<u.length;r++){u[r].remove()}if(A>0){this.list.css(this.wh,this.dimension(this.list)+A+"px");if(z){n-=A;this.list.css(this.lt,a.intval(this.list.css(this.lt))-A+"px")}}var q=C+h-1;if(this.options.wrap!="circular"&&this.options.size&&q>this.options.size){q=this.options.size}if(B>q){h=0;B=q;t=0;while(++h){F=this.get(B--);if(!F.length){break}t+=this.dimension(F);if(t>=s){break}}}var o=q-h+1;if(this.options.wrap!="circular"&&o<1){o=1}if(this.inTail&&z){n+=this.tail;this.inTail=false}this.tail=null;if(this.options.wrap!="circular"&&q==this.options.size&&(q-h+1)>=1){var y=a.intval(this.get(q).css(!this.options.vertical?"marginRight":"marginBottom"));if((t-y)>s){this.tail=t-s-y}}if(k&&C===this.options.size&&this.tail){n-=this.tail;this.inTail=true}while(C-->o){n+=this.dimension(this.get(C))}this.prevFirst=this.first;this.prevLast=this.last;this.first=o;this.last=q;return n},animate:function(i,e){if(this.locked||this.animating){return}this.animating=true;var f=this;var g=function(){f.animating=false;if(i===0){f.list.css(f.lt,0)}if(!f.autoStopped&&(f.options.wrap=="circular"||f.options.wrap=="both"||f.options.wrap=="last"||f.options.size===null||f.last<f.options.size||(f.last==f.options.size&&f.tail!==null&&!f.inTail))){f.startAuto()}f.buttons();f.notify("onAfterAnimation");if(f.options.wrap=="circular"&&f.options.size!==null){for(var k=f.prevFirst;k<=f.prevLast;k++){if(k!==null&&!(k>=f.first&&k<=f.last)&&(k<1||k>f.options.size)){f.remove(k)}}}};this.notify("onBeforeAnimation");if(!this.options.animation||e===false){this.list.css(this.lt,i+"px");g()}else{var j=!this.options.vertical?(this.options.rtl?{right:i}:{left:i}):{top:i};var h={duration:this.options.animation,easing:this.options.easing,complete:g};if(c.isFunction(this.options.animationStepCallback)){h.step=this.options.animationStepCallback}this.list.animate(j,h)}},startAuto:function(f){if(f!==undefined){this.options.auto=f}if(this.options.auto===0){return this.stopAuto()}if(this.timer!==null){return}this.autoStopped=false;var e=this;this.timer=window.setTimeout(function(){e.next()},this.options.auto*1000)},stopAuto:function(){this.pauseAuto();this.autoStopped=true},pauseAuto:function(){if(this.timer===null){return}window.clearTimeout(this.timer);this.timer=null},buttons:function(g,f){if(g==null){g=!this.locked&&this.options.size!==0&&((this.options.wrap&&this.options.wrap!="first")||this.options.size===null||this.last<this.options.size);if(!this.locked&&(!this.options.wrap||this.options.wrap=="first")&&this.options.size!==null&&this.last>=this.options.size){g=this.tail!==null&&!this.inTail}}if(f==null){f=!this.locked&&this.options.size!==0&&((this.options.wrap&&this.options.wrap!="last")||this.first>1);if(!this.locked&&(!this.options.wrap||this.options.wrap=="last")&&this.options.size!==null&&this.first==1){f=this.tail!==null&&this.inTail}}var e=this;if(this.buttonNext.size()>0){this.buttonNext.unbind(this.options.buttonNextEvent+".jcarousel",this.funcNext);if(g){this.buttonNext.bind(this.options.buttonNextEvent+".jcarousel",this.funcNext)}this.buttonNext[g?"removeClass":"addClass"](this.className("jcarousel-next-disabled")).attr("disabled",g?false:true);if(this.options.buttonNextCallback!==null&&this.buttonNext.data("jcarouselstate")!=g){this.buttonNext.each(function(){e.options.buttonNextCallback(e,this,g)}).data("jcarouselstate",g)}}else{if(this.options.buttonNextCallback!==null&&this.buttonNextState!=g){this.options.buttonNextCallback(e,null,g)}}if(this.buttonPrev.size()>0){this.buttonPrev.unbind(this.options.buttonPrevEvent+".jcarousel",this.funcPrev);if(f){this.buttonPrev.bind(this.options.buttonPrevEvent+".jcarousel",this.funcPrev)}this.buttonPrev[f?"removeClass":"addClass"](this.className("jcarousel-prev-disabled")).attr("disabled",f?false:true);if(this.options.buttonPrevCallback!==null&&this.buttonPrev.data("jcarouselstate")!=f){this.buttonPrev.each(function(){e.options.buttonPrevCallback(e,this,f)}).data("jcarouselstate",f)}}else{if(this.options.buttonPrevCallback!==null&&this.buttonPrevState!=f){this.options.buttonPrevCallback(e,null,f)}}this.buttonNextState=g;this.buttonPrevState=f},notify:function(e){var f=this.prevFirst===null?"init":(this.prevFirst<this.first?"next":"prev");this.callback("itemLoadCallback",e,f);if(this.prevFirst!==this.first){this.callback("itemFirstInCallback",e,f,this.first);this.callback("itemFirstOutCallback",e,f,this.prevFirst)}if(this.prevLast!==this.last){this.callback("itemLastInCallback",e,f,this.last);this.callback("itemLastOutCallback",e,f,this.prevLast)}this.callback("itemVisibleInCallback",e,f,this.first,this.last,this.prevFirst,this.prevLast);this.callback("itemVisibleOutCallback",e,f,this.prevFirst,this.prevLast,this.first,this.last)},callback:function(j,m,e,k,h,g,f){if(this.options[j]==null||(typeof this.options[j]!="object"&&m!="onAfterAnimation")){return}var n=typeof this.options[j]=="object"?this.options[j][m]:this.options[j];if(!c.isFunction(n)){return}var o=this;if(k===undefined){n(o,e,m)}else{if(h===undefined){this.get(k).each(function(){n(o,this,k,e,m)})}else{var p=function(q){o.get(q).each(function(){n(o,this,q,e,m)})};for(var l=k;l<=h;l++){if(l!==null&&!(l>=g&&l<=f)){p(l)}}}}},create:function(e){return this.format("<li></li>",e)},format:function(k,h){k=c(k);var g=k.get(0).className.split(" ");for(var f=0;f<g.length;f++){if(g[f].indexOf("jcarousel-")!=-1){k.removeClass(g[f])}}k.addClass(this.className("jcarousel-item")).addClass(this.className("jcarousel-item-"+h)).css({"float":(this.options.rtl?"right":"left"),"list-style":"none"}).attr("jcarouselindex",h);return k},className:function(e){return e+" "+e+(!this.options.vertical?"-horizontal":"-vertical")},dimension:function(h,i){var g=c(h);if(i==null){return !this.options.vertical?((g.innerWidth()+a.intval(g.css("margin-left"))+a.intval(g.css("margin-right"))+a.intval(g.css("border-left-width"))+a.intval(g.css("border-right-width")))||a.intval(this.options.itemFallbackDimension)):((g.innerHeight()+a.intval(g.css("margin-top"))+a.intval(g.css("margin-bottom"))+a.intval(g.css("border-top-width"))+a.intval(g.css("border-bottom-width")))||a.intval(this.options.itemFallbackDimension))}else{var f=!this.options.vertical?i-a.intval(g.css("marginLeft"))-a.intval(g.css("marginRight")):i-a.intval(g.css("marginTop"))-a.intval(g.css("marginBottom"));c(g).css(this.wh,f+"px");return this.dimension(g)}},clipping:function(){return !this.options.vertical?this.clip[0].offsetWidth-a.intval(this.clip.css("borderLeftWidth"))-a.intval(this.clip.css("borderRightWidth")):this.clip[0].offsetHeight-a.intval(this.clip.css("borderTopWidth"))-a.intval(this.clip.css("borderBottomWidth"))},index:function(e,f){if(f==null){f=this.options.size}return Math.round((((e-1)/f)-Math.floor((e-1)/f))*f)+1}});a.extend({defaults:function(e){return c.extend(d,e||{})},intval:function(e){e=parseInt(e,10);return isNaN(e)?0:e},windowLoaded:function(){b=true},isSafari:function(){var g=navigator.userAgent.toLowerCase(),f=/(chrome)[ \/]([\w.]+)/.exec(g)||/(webkit)[ \/]([\w.]+)/.exec(g)||[],e=f[1]||"";return e==="webkit"}});c.fn.jcarousel=function(g){if(typeof g=="string"){var e=c(this).data("jcarousel"),f=Array.prototype.slice.call(arguments,1);return e[g].apply(e,f)}else{return this.each(function(){var h=c(this).data("jcarousel");if(h){if(g){c.extend(h.options,g)}h.reload()}else{c(this).data("jcarousel",new a(this,g))}})}}})(jQuery);
;
(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the URI fragment identifier.
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($fieldset.find('.error' + anchor).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
/**
 * @file
 * SEARCH AUTOCOMPLETE javascript mechanism.
 *
 * Sponsored by:
 * www.axiomcafe.fr
 */

(function ($) {

  function strip(html)
  {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
  }

  // Autocomplete
  $.ui.autocomplete.prototype._renderItem = function (ul, item) {
    var term = this.term;
    var first = ("group" in item)  ? 'first' : '';
    var innerHTML = '<div class="ui-autocomplete-fields ' + first + '">';
    item.value = strip(item.value);
    item.label = Drupal.checkPlain(item.label);
    if (item.fields) {
      $.each(item.fields, function(key, value) {
        var regex = new RegExp('(' + $.trim(term) + ')', 'gi');
        var output = Drupal.checkPlain(value);
        if (value.indexOf('src=') == -1 && value.indexOf('href=') == -1) {
          output = output.replace(regex, "<span class='ui-autocomplete-field-term'>$1</span>");
          innerHTML += ('<div class="ui-autocomplete-field-' + key + '">' + output + '</div>');
        } else {
          innerHTML += ('<div class="ui-autocomplete-field-' + key + '">' + value + '</div>');
        }
      });
    } else {
      innerHTML += ('<div class="ui-autocomplete-field">' + item.label + '</div>');
    }
    innerHTML += '</div>';

    var group = '';
    if ("group" in item) {
    	groupId = typeof(item.group.group_id) !== 'undefined' ? item.group.group_id : '';
    	groupName = typeof(item.group.group_name) !== 'undefined' ? item.group.group_name : '';
      group += ('<div class="ui-autocomplete-field-group ' + groupId + '">' + groupName + '</div>');
      $(group).appendTo(ul);
    }
    var elem =  $("<li class=ui-menu-item-" + first + "></li>" )
    .append("<a>" + innerHTML + "</a>");
    if (item.value == '') {
    	elem = $("<li class='ui-state-disabled ui-menu-item-" + first + " ui-menu-item'>" + item.label + "</li>" );
    }
    elem.data("item.autocomplete", item).appendTo(ul);
    
    Drupal.attachBehaviors(elem);
    return elem;
  };

  $.ui.autocomplete.prototype._resizeMenu = function() {
    var ul = this.menu.element;
    ul.outerWidth(Math.max(ul.width("").outerWidth() + 5, this.options.position.of == null ? this.element.outerWidth() : this.options.position.of.outerWidth()));
  };

  Drupal.behaviors.search_autocomplete = {
    attach: function(context) {
      if (Drupal.settings.search_autocomplete) {
        $.each(Drupal.settings.search_autocomplete, function(key, value) {
          $(Drupal.settings.search_autocomplete[key].selector).bind("mouseover", function() {
             $(Drupal.settings.search_autocomplete[key].selector).addClass('form-autocomplete ui-autocomplete-processed').attr('data-sa-theme', Drupal.settings.search_autocomplete[key].theme).autocomplete({
            	 	minLength: Drupal.settings.search_autocomplete[key].minChars,
            	 	source: function(request, response) {
                 $(Drupal.settings.search_autocomplete[key].selector).addClass('throbbing');
		              // External URL:
		              if (Drupal.settings.search_autocomplete[key].type == 'external') {
		                $.getJSON(Drupal.settings.search_autocomplete[key].datas, { q: encodeURIComponent(request.term) }, function (results) {
		                  // Only return the number of values set in the settings.
		                  if (results.length) {
		                  	results.slice(0, Drupal.settings.search_autocomplete[key].max_sug);
		                  }
		                  response(results);
		                });
		              }
		              // Internal URL:
		              else if (Drupal.settings.search_autocomplete[key].type == 'internal' || Drupal.settings.search_autocomplete[key].type == 'view') {
		                $.getJSON(Drupal.settings.search_autocomplete[key].datas, request, function (results) {
		                  // Only return the number of values set in the settings.
		                  if (results.length) {
	                	    results.slice(0, Drupal.settings.search_autocomplete[key].max_sug);
		                  }
		                  response(results);
		                });
		              }
		              // Static resources:
		              else if (Drupal.settings.search_autocomplete[key].type == 'static') {
		                var results = $.ui.autocomplete.filter(Drupal.settings.search_autocomplete[key].datas, request.term);
	                  if (results.length) {
	                    results.slice(0, Drupal.settings.search_autocomplete[key].max_sug);
	                  }
	                  response(results);
		              }
		            },
		            open: function(event, ui) {
		              $(".ui-autocomplete li.ui-menu-item:odd").addClass("ui-menu-item-odd");
		              $(".ui-autocomplete li.ui-menu-item:even").addClass("ui-menu-item-even");
		              $(Drupal.settings.search_autocomplete[key].selector).removeClass('throbbing');
		            },
		            select: function(event, ui) {
		              if (Drupal.settings.search_autocomplete[key].auto_redirect == 1 && ui.item.link) {
		                document.location.href = ui.item.link;
		              } else if (Drupal.settings.search_autocomplete[key].auto_submit == 1 && ui.item.value) {
		                  $(this).val(ui.item.value);
		                  $(this).closest("form").submit();
		              }
		            },
		            focus: function (event, ui) {
		              if (typeof ui.item.group != 'undefined') {
  		              if (ui.item.group.group_id == 'no_results' || ui.item.group.group_id == 'all_results') {
  		                  event.preventDefault();
  		              }
		              }
		            },
		            appendTo: $(Drupal.settings.search_autocomplete[key].selector).parent()
             }).autocomplete("widget").attr("data-sa-theme", Drupal.settings.search_autocomplete[key].theme);
        	});
          $(Drupal.settings.search_autocomplete[key].selector).trigger('mouseover');
       });
      }
    }
  };
})(jQuery);
;
/**
 * @file
 * Implement a simple, clickable dropbutton menu.
 *
 * See dropbutton.theme.inc for primary documentation.
 *
 * The javascript relies on four classes:
 * - The dropbutton must be fully contained in a div with the class
 *   ctools-dropbutton. It must also contain the class ctools-no-js
 *   which will be immediately removed by the javascript; this allows for
 *   graceful degradation.
 * - The trigger that opens the dropbutton must be an a tag wit hthe class
 *   ctools-dropbutton-link. The href should just be '#' as this will never
 *   be allowed to complete.
 * - The part of the dropbutton that will appear when the link is clicked must
 *   be a div with class ctools-dropbutton-container.
 * - Finally, ctools-dropbutton-hover will be placed on any link that is being
 *   hovered over, so that the browser can restyle the links.
 *
 * This tool isn't meant to replace click-tips or anything, it is specifically
 * meant to work well presenting menus.
 */

(function ($) {
  Drupal.behaviors.CToolsDropbutton = {
    attach: function() {
      // Process buttons. All dropbuttons are buttons.
      $('.ctools-button')
        .once('ctools-button')
        .removeClass('ctools-no-js');

      // Process dropbuttons. Not all buttons are dropbuttons.
      $('.ctools-dropbutton').once('ctools-dropbutton', function() {
        var $dropbutton = $(this);
        var $button = $('.ctools-content', $dropbutton);
        var $secondaryActions = $('li', $button).not(':first');
        var $twisty = $(".ctools-link", $dropbutton);
        var open = false;
        var hovering = false;
        var timerID = 0;

        var toggle = function(close) {
          // if it's open or we're told to close it, close it.
          if (open || close) {
            // If we're just toggling it, close it immediately.
            if (!close) {
              open = false;
              $secondaryActions.slideUp(100);
              $dropbutton.removeClass('open');
            }
            else {
              // If we were told to close it, wait half a second to make
              // sure that's what the user wanted.
              // Clear any previous timer we were using.
              if (timerID) {
                clearTimeout(timerID);
              }
              timerID = setTimeout(function() {
                if (!hovering) {
                  open = false;
                  $secondaryActions.slideUp(100);
                  $dropbutton.removeClass('open');
                }}, 500);
            }
          }
          else {
            // open it.
            open = true;
            $secondaryActions.animate({height: "show", opacity: "show"}, 100);
            $dropbutton.addClass('open');
          }
        }
        // Hide the secondary actions initially.
        $secondaryActions.hide();

        $twisty.click(function() {
            toggle();
            return false;
          });

        $dropbutton.hover(
          function() {
            hovering = true;
          }, // hover in
          function() { // hover out
            hovering = false;
            toggle(true);
            return false;
          }
        );
      });
    }
  }
})(jQuery);
;

/**
 * Cookie plugin 1.0
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie=function(b,j,m){if(typeof j!="undefined"){m=m||{};if(j===null){j="";m.expires=-1}var e="";if(m.expires&&(typeof m.expires=="number"||m.expires.toUTCString)){var f;if(typeof m.expires=="number"){f=new Date();f.setTime(f.getTime()+(m.expires*24*60*60*1000))}else{f=m.expires}e="; expires="+f.toUTCString()}var l=m.path?"; path="+(m.path):"";var g=m.domain?"; domain="+(m.domain):"";var a=m.secure?"; secure":"";document.cookie=[b,"=",encodeURIComponent(j),e,l,g,a].join("")}else{var d=null;if(document.cookie&&document.cookie!=""){var k=document.cookie.split(";");for(var h=0;h<k.length;h++){var c=jQuery.trim(k[h]);if(c.substring(0,b.length+1)==(b+"=")){d=decodeURIComponent(c.substring(b.length+1));break}}}return d}};
;
(function ($) {

Drupal.ModuleFilter = {};

Drupal.ModuleFilter.explode = function(string) {
  var queryArray = string.match(/([a-zA-Z]+\:(\w+|"[^"]+")*)|\w+|"[^"]+"/g);
  if (!queryArray) {
    queryArray = new Array();
  }
  var i = queryArray.length;
  while (i--) {
    queryArray[i] = queryArray[i].replace(/"/g, "");
  }
  return queryArray;
};

Drupal.ModuleFilter.getState = function(key) {
  if (!Drupal.ModuleFilter.state) {
    Drupal.ModuleFilter.state = {};
    var cookie = $.cookie('DrupalModuleFilter');
    var query = cookie ? cookie.split('&') : [];
    if (query) {
      for (var i in query) {
        // Extra check to avoid js errors in Chrome, IE and Safari when
        // combined with JS like twitter's widget.js.
        // See http://drupal.org/node/798764.
        if (typeof(query[i]) == 'string' && query[i].indexOf('=') != -1) {
          var values = query[i].split('=');
          if (values.length === 2) {
            Drupal.ModuleFilter.state[values[0]] = values[1];
          }
        }
      }
    }
  }
  return Drupal.ModuleFilter.state[key] ? Drupal.ModuleFilter.state[key] : false;
};

Drupal.ModuleFilter.setState = function(key, value) {
  var existing = Drupal.ModuleFilter.getState(key);
  if (existing != value) {
    Drupal.ModuleFilter.state[key] = value;
    var query = [];
    for (var i in Drupal.ModuleFilter.state) {
      query.push(i + '=' + Drupal.ModuleFilter.state[i]);
    }
    $.cookie('DrupalModuleFilter', query.join('&'), { expires: 7, path: '/' });
  }
};

Drupal.ModuleFilter.Filter = function(element, selector, options) {
  var self = this;

  this.element = element;
  this.text = $(this.element).val();

  this.settings = Drupal.settings.moduleFilter;

  this.selector = selector;

  this.options = $.extend({
    delay: 500,
    striping: false,
    childSelector: null,
    empty: Drupal.t('No results'),
    rules: new Array()
  }, options);
  if (this.options.wrapper == undefined) {
    this.options.wrapper = $(self.selector).parent();
  }

  // Add clear button.
  this.element.after('<div class="module-filter-clear"><a href="#" class="js-hide">' + Drupal.t('clear') + '</a></div>');
  if (this.text) {
    $('.module-filter-clear a', this.element.parent()).removeClass('js-hide');
  }
  $('.module-filter-clear a', this.element.parent()).click(function() {
    self.element.val('');
    self.text = '';
    delete self.queries;
    self.applyFilter();
    self.element.focus();
    $(this).addClass('js-hide');
    return false;
  });

  this.updateQueries = function() {
    var queryStrings = Drupal.ModuleFilter.explode(self.text);

    self.queries = new Array();
    for (var i in queryStrings) {
      var query = { operator: 'text', string: queryStrings[i] };

      if (self.operators != undefined) {
        // Check if an operator is possibly used.
        if (queryStrings[i].indexOf(':') > 0) {
          // Determine operator used.
          var args = queryStrings[i].split(':', 2);
          var operator = args.shift();
          if (self.operators[operator] != undefined) {
            query.operator = operator;
            query.string = args.shift();
          }
        }
      }

      query.string = query.string.toLowerCase();

      self.queries.push(query);
    }

    if (self.queries.length <= 0) {
      // Add a blank string query.
      self.queries.push({ operator: 'text', string: '' });
    }
  };

  this.applyFilter = function() {
    self.results = new Array();

    self.updateQueries();

    if (self.index == undefined) {
      self.buildIndex();
    }

    self.element.trigger('moduleFilter:start');

    $.each(self.index, function(key, item) {
      var $item = item.element;

      for (var i in self.queries) {
        var query = self.queries[i];
        if (query.operator == 'text') {
          if (item.text.indexOf(query.string) < 0) {
            continue;
          }
        }
        else {
          var func = self.operators[query.operator];
          if (!(func(query.string, self, item))) {
            continue;
          }
        }

        var rulesResult = self.processRules(item);
        if (rulesResult !== false) {
          return true;
        }
      }

      $item.addClass('js-hide');
    });

    self.element.trigger('moduleFilter:finish', { results: self.results });

    if (self.options.striping) {
      self.stripe();
    }

    if (self.results.length > 0) {
      self.options.wrapper.find('.module-filter-no-results').remove();
    }
    else {
      if (!self.options.wrapper.find('.module-filter-no-results').length) {
        self.options.wrapper.append($('<p class="module-filter-no-results"/>').text(self.options.empty));
      };
    }
  };

  self.element.keyup(function(e) {
    switch (e.which) {
      case 13:
        if (self.timeOut) {
          clearTimeout(self.timeOut);
        }
        self.applyFilter();
        break;
      default:
        if (self.text != $(this).val()) {
          if (self.timeOut) {
            clearTimeout(self.timeOut);
          }

          self.text = $(this).val();

          if (self.text) {
            self.element.parent().find('.module-filter-clear a').removeClass('js-hide');
          }
          else {
            self.element.parent().find('.module-filter-clear a').addClass('js-hide');
          }

          self.element.trigger('moduleFilter:keyup');

          self.timeOut = setTimeout(self.applyFilter, self.options.delay);
        }
        break;
    }
  });

  self.element.keypress(function(e) {
    if (e.which == 13) e.preventDefault();
  });
};

Drupal.ModuleFilter.Filter.prototype.buildIndex = function() {
  var self = this;
  var index = new Array();
  $(this.selector).each(function(i) {
    var text = (self.options.childSelector) ? $(self.options.childSelector, this).text() : $(this).text();
    var item = {
      key: i,
      element: $(this),
      text: text.toLowerCase()
    };
    for (var j in self.options.buildIndex) {
      var func = self.options.buildIndex[j];
      item = $.extend(func(self, item), item);
    }
    $(this).data('indexKey', i);
    index.push(item);
    delete item;
  });
  this.index = index;
};

Drupal.ModuleFilter.Filter.prototype.processRules = function(item) {
  var self = this;
  var $item = item.element;
  var rulesResult = true;
  if (self.options.rules.length > 0) {
    for (var i in self.options.rules) {
      var func = self.options.rules[i];
      rulesResult = func(self, item);
      if (rulesResult === false) {
        break;
      }
    }
  }
  if (rulesResult !== false) {
    $item.removeClass('js-hide');
    self.results.push(item);
  }
  return rulesResult;
};

Drupal.ModuleFilter.Filter.prototype.stripe = function() {
  var self = this;
  var flip = { even: 'odd', odd: 'even' };
  var stripe = 'odd';

  $.each(self.index, function(key, item) {
    if (!item.element.hasClass('js-hide')) {
      item.element.removeClass('odd even')
        .addClass(stripe);
      stripe = flip[stripe];
    }
  });
};

$.fn.moduleFilter = function(selector, options) {
  var filterInput = this;
  filterInput.parents('.module-filter-inputs-wrapper').show();
  if (Drupal.settings.moduleFilter.setFocus) {
    filterInput.focus();
  }
  filterInput.data('moduleFilter', new Drupal.ModuleFilter.Filter(this, selector, options));
};

})(jQuery);
;
(function($) {

Drupal.behaviors.moduleFilter = {
  attach: function(context) {
    $('#system-modules td.description').once('description', function() {
      $('.inner.expand', $(this)).click(function() {
        $(this).toggleClass('expanded');
      });
    });

    $('.module-filter-inputs-wrapper', context).once('module-filter', function() {
      var filterInput = $('input[name="module_filter[name]"]', context);
      var selector = '#system-modules table tbody tr';
      if (Drupal.settings.moduleFilter.tabs) {
        selector += '.module';
      }

      filterInput.moduleFilter(selector, {
        wrapper: $('#module-filter-modules'),
        delay: 500,
        striping: true,
        childSelector: 'td:nth(1)',
        rules: [
          function(moduleFilter, item) {
            if (!item.unavailable) {
              if (moduleFilter.options.showEnabled) {
                if (item.status && !item.disabled) {
                  return true;
                }
              }
              if (moduleFilter.options.showDisabled) {
                if (!item.status && !item.disabled) {
                  return true;
                }
              }
              if (moduleFilter.options.showRequired) {
                if (item.status && item.disabled) {
                  return true;
                }
              }
            }
            if (moduleFilter.options.showUnavailable) {
              if (item.unavailable || (!item.status && item.disabled)) {
                return true;
              }
            }
            return false;
          }
        ],
        buildIndex: [
          function(moduleFilter, item) {
            var $checkbox = $('td.checkbox :checkbox', item.element);
            if ($checkbox.size() > 0) {
              item.status = $checkbox.is(':checked');
              item.disabled = $checkbox.is(':disabled');
            }
            else {
              item.status = false;
              item.disabled = true;
              item.unavailable = true;
            }
            return item;
          }
        ],
        showEnabled: $('#edit-module-filter-show-enabled').is(':checked'),
        showDisabled: $('#edit-module-filter-show-disabled').is(':checked'),
        showRequired: $('#edit-module-filter-show-required').is(':checked'),
        showUnavailable: $('#edit-module-filter-show-unavailable').is(':checked')
      });

      var moduleFilter = filterInput.data('moduleFilter');

      moduleFilter.operators = {
        description: function(string, moduleFilter, item) {
          if (item.description == undefined) {
            var description = $('.description', item.element).clone();
            $('.admin-requirements', description).remove();
            $('.admin-operations', description).remove();
            item.description = description.text().toLowerCase();
          }

          if (item.description.indexOf(string) >= 0) {
            return true;
          }
        },
        requiredBy: function(string, moduleFilter, item) {
          if (item.requiredBy == undefined) {
            var requirements = Drupal.ModuleFilter.getRequirements(item.element);
            item.requires = requirements.requires;
            item.requiredBy = requirements.requiredBy;
          }

          for (var i in item.requiredBy) {
            if (item.requiredBy[i].indexOf(string) >= 0) {
              return true;
            }
          }
        },
        requires: function(string, moduleFilter, item) {
          if (item.requires == undefined) {
            var requirements = Drupal.ModuleFilter.getRequirements(item.element);
            item.requires = requirements.requires;
            item.requiredBy = requirements.requiredBy;
          }

          for (var i in item.requires) {
            if (item.requires[i].indexOf(string) >= 0) {
              return true;
            }
          }
        }
      };

      $('#edit-module-filter-show-enabled', context).change(function() {
        moduleFilter.options.showEnabled = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
      $('#edit-module-filter-show-disabled', context).change(function() {
        moduleFilter.options.showDisabled = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
      $('#edit-module-filter-show-required', context).change(function() {
        moduleFilter.options.showRequired = $(this).is(':checked');
        moduleFilter.applyFilter();
      });
      $('#edit-module-filter-show-unavailable', context).change(function() {
        moduleFilter.options.showUnavailable = $(this).is(':checked');
        moduleFilter.applyFilter();
      });

      if (!Drupal.settings.moduleFilter.tabs) {
        moduleFilter.element.bind('moduleFilter:start', function() {
          $('#system-modules fieldset').show();
        });

        moduleFilter.element.bind('moduleFilter:finish', function(e, data) {
          $('#system-modules fieldset').each(function(i) {
            $fieldset = $(this);
            if ($('tbody tr', $fieldset).filter(':visible').length == 0) {
              $fieldset.hide();
            }
          });
        });

        moduleFilter.applyFilter();
      }
    });
  }
};

Drupal.ModuleFilter.getRequirements = function(element) {
  var requires = new Array();
  var requiredBy = new Array();
  $('.admin-requirements', element).each(function() {
    var text = $(this).text();
    if (text.substr(0, 9) == 'Requires:') {
      // Requires element.
      requiresString = text.substr(9);
      requires = requiresString.replace(/\([a-z]*\)/g, '').split(',');
    }
    else if (text.substr(0, 12) == 'Required by:') {
      // Required by element.
      requiredByString = text.substr(12);
      requiredBy = requiredByString.replace(/\([a-z]*\)/g, '').split(',');
    }
  });
  for (var i in requires) {
    requires[i] = $.trim(requires[i].toLowerCase());
  }
  for (var i in requiredBy) {
    requiredBy[i] = $.trim(requiredBy[i].toLowerCase());
  }
  return { requires: requires, requiredBy: requiredBy };
};

})(jQuery);
;

(function ($) {

Drupal.ModuleFilter.tabs = {};
Drupal.ModuleFilter.enabling = {};
Drupal.ModuleFilter.disabling = {};

Drupal.ModuleFilter.jQueryIsNewer = function() {
  if (Drupal.ModuleFilter.jQueryNewer == undefined) {
    var v1parts = $.fn.jquery.split('.');
    var v2parts = new Array('1', '4', '4');

    for (var i = 0; i < v1parts.length; ++i) {
      if (v2parts.length == i) {
        Drupal.ModuleFilter.jQueryNewer = true;
        return Drupal.ModuleFilter.jQueryNewer;
      }

      if (v1parts[i] == v2parts[i]) {
        continue;
      }
      else if (v1parts[i] > v2parts[i]) {
        Drupal.ModuleFilter.jQueryNewer = true;
        return Drupal.ModuleFilter.jQueryNewer;
      }
      else {
        Drupal.ModuleFilter.jQueryNewer = false;
        return Drupal.ModuleFilter.jQueryNewer;
      }
    }

    if (v1parts.length != v2parts.length) {
      Drupal.ModuleFilter.jQueryNewer = false;
      return Drupal.ModuleFilter.jQueryNewer;
    }

    Drupal.ModuleFilter.jQueryNewer = false;
  }
  return Drupal.ModuleFilter.jQueryNewer;
};

Drupal.behaviors.moduleFilterTabs = {
  attach: function(context) {
    if (Drupal.settings.moduleFilter.tabs) {
      $('#module-filter-wrapper table:not(.sticky-header)', context).once('module-filter-tabs', function() {
        var $modules = $('#module-filter-modules');
        var moduleFilter = $('input[name="module_filter[name]"]').data('moduleFilter');
        var table = $(this);

        $('thead', table).show();

        // Remove package header rows.
        $('tr.admin-package-header', table).remove();

        var $tabsWrapper = $('<div id="module-filter-tabs"></div>');

        // Build tabs from package title rows.
        var tabs = '<ul>';
        for (var i in Drupal.settings.moduleFilter.packageIDs) {
          var id = Drupal.settings.moduleFilter.packageIDs[i];

          var name = id;
          var tabClass = 'project-tab';
          var title = null;
          var summary = (Drupal.settings.moduleFilter.countEnabled) ? '<span class="count">' + Drupal.ModuleFilter.countSummary(id) + '</span>' : '';

          switch (id) {
            case 'all':
              name = Drupal.t('All');
              break;
            case 'new':
              name = Drupal.t('New');
              title = Drupal.t('Modules installed within the last week.');
              if (Drupal.settings.moduleFilter.enabledCounts['new'].total == 0) {
                tabClass += ' disabled';
                summary += '<span>' + Drupal.t('No modules added within the last week.') + '</span>';
              }
              break;
            case 'recent':
              name = Drupal.t('Recent');
              title = Drupal.t('Modules enabled/disabled within the last week.');
              if (Drupal.settings.moduleFilter.enabledCounts['recent'].total == 0) {
                tabClass += ' disabled';
                summary += '<span>' + Drupal.t('No modules were enabled or disabled within the last week.') + '</span>';
              }
              break;
            default: 
              var $row = $('#' + id + '-package');
              name = $.trim($row.text());
              $row.remove();
              break;
          }

          tabs += '<li id="' + id + '-tab" class="' + tabClass + '"><a href="#' + id + '" class="overlay-exclude"' + (title ? ' title="' + title + '"' : '') + '><strong>' + name + '</strong><span class="summary">' + summary + '</span></a></li>';
        }
        tabs += '</ul>';
        $tabsWrapper.append(tabs);
        $modules.before($tabsWrapper);

        // Index tabs.
        $('#module-filter-tabs li').each(function() {
          var $tab = $(this);
          var id = $tab.attr('id');
          Drupal.ModuleFilter.tabs[id] = new Drupal.ModuleFilter.Tab($tab, id);
        });

        $('tbody td.checkbox input', $modules).change(function() {
          var $checkbox = $(this);
          var key = $checkbox.parents('tr').data('indexKey');

          moduleFilter.index[key].status = $checkbox.is(':checked');

          if (Drupal.settings.moduleFilter.visualAid) {
            var type = ($checkbox.is(':checked')) ? 'enable' : 'disable';
            Drupal.ModuleFilter.updateVisualAid(type, $checkbox.parents('tr'));
          }
        });

        // Sort rows.
        var rows = $('tbody tr.module', table).get();
        rows.sort(function(a, b) {
          var compA = $('td:nth(1)', a).text().toLowerCase();
          var compB = $('td:nth(1)', b).text().toLowerCase();
          return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
        $.each(rows, function(idx, itm) { table.append(itm); });

        // Re-stripe rows.
        $('tr.module', table)
          .removeClass('odd even')
          .filter(':odd').addClass('even').end()
          .filter(':even').addClass('odd');

        moduleFilter.adjustHeight();

        moduleFilter.element.bind('moduleFilter:start', function() {
          moduleFilter.tabResults = {
            'all-tab': { items: {}, count: 0 },
            'recent-tab': { items: {}, count: 0 },
            'new-tab': { items: {}, count: 0 }
          };

          // Empty result info from tabs.
          for (var i in Drupal.ModuleFilter.tabs) {
            if (Drupal.ModuleFilter.tabs[i].resultInfo != undefined) {
              Drupal.ModuleFilter.tabs[i].resultInfo.empty();
            }
          }
        });

        moduleFilter.element.bind('moduleFilter:finish', function(e, data) {
          $.each(moduleFilter.index, function(key, item) {
            if (!item.element.hasClass('js-hide')) {
              var id = Drupal.ModuleFilter.getTabID(item.element);

              if (moduleFilter.tabResults[id] == undefined) {
                moduleFilter.tabResults[id] = { items: {}, count: 0 };
              }
              if (moduleFilter.tabResults[id].items[item.key] == undefined) {
                // All tab
                moduleFilter.tabResults['all-tab'].count++;

                // Recent tab
                if (item.element.hasClass('recent-module')) {
                  moduleFilter.tabResults['recent-tab'].count++;
                }

                // New tab
                if (item.element.hasClass('new-module')) {
                  moduleFilter.tabResults['new-tab'].count++;
                }

                moduleFilter.tabResults[id].items[item.key] = item;
                moduleFilter.tabResults[id].count++;
              }

              if (Drupal.ModuleFilter.activeTab != undefined && Drupal.ModuleFilter.activeTab.id != 'all-tab') {
                if ((Drupal.ModuleFilter.activeTab.id == 'recent-tab' && !item.element.hasClass('recent-module')) || (Drupal.ModuleFilter.activeTab.id == 'new-tab' && !item.element.hasClass('new-module')) || (Drupal.ModuleFilter.activeTab.id != 'recent-tab' && Drupal.ModuleFilter.activeTab.id != 'new-tab' && id != Drupal.ModuleFilter.activeTab.id)) {
                  // The item is not in the active tab, so hide it.
                  item.element.addClass('js-hide');
                }
              }
            }
          });

          if (Drupal.settings.moduleFilter.visualAid) {
            if (moduleFilter.text) {
              // Add result info to tabs.
              for (var id in moduleFilter.tabResults) {
                var tab = Drupal.ModuleFilter.tabs[id];

                if (tab.resultInfo == undefined) {
                  var resultInfo = '<span class="result-info"></span>'
                  $('a', tab.element).prepend(resultInfo);
                  tab.resultInfo = $('span.result-info', tab.element);
                }

                tab.resultInfo.append(moduleFilter.tabResults[id].count);
              }

              if (Drupal.settings.moduleFilter.hideEmptyTabs) {
                for (var id in Drupal.ModuleFilter.tabs) {
                  if (moduleFilter.tabResults[id] != undefined) {
                    Drupal.ModuleFilter.tabs[id].element.show();
                  }
                  else if (Drupal.ModuleFilter.activeTab == undefined || Drupal.ModuleFilter.activeTab.id != id) {
                    Drupal.ModuleFilter.tabs[id].element.hide();
                  }
                }
              }
            }
            else {
              // Make sure all tabs are visible.
              if (Drupal.settings.moduleFilter.hideEmptyTabs) {
                $('#module-filter-tabs li').show();
              }
            }
          }

          if ((Drupal.ModuleFilter.activeTab != undefined && (moduleFilter.tabResults[Drupal.ModuleFilter.activeTab.id] == undefined || moduleFilter.tabResults[Drupal.ModuleFilter.activeTab.id].count <= 0))) {
            // The current tab contains no results.
            moduleFilter.results = 0;
          }

          moduleFilter.adjustHeight();
        });

        if (Drupal.settings.moduleFilter.useURLFragment) {
          $(window).bind('hashchange.module-filter', $.proxy(Drupal.ModuleFilter, 'eventHandlerOperateByURLFragment')).triggerHandler('hashchange.module-filter');
        }
        else {
          Drupal.ModuleFilter.selectTab();
        }

        if (Drupal.settings.moduleFilter.useSwitch) {
          $('td.checkbox div.form-item').hide();
          $('td.checkbox').each(function(i) {
            var $cell = $(this);
            var $checkbox = $(':checkbox', $cell);
            var $switch = $('.toggle-enable', $cell);
            $switch.removeClass('js-hide').click(function() {
              if (!$(this).hasClass('disabled')) {
                if (Drupal.ModuleFilter.jQueryIsNewer()) {
                  $checkbox.click();
                }
                else {
                  $checkbox.click().change();
                }
              }
            });
            $checkbox.click(function() {
              if (!$switch.hasClass('disabled')) {
                $switch.toggleClass('off');
              }
            });
          });
        }

        var $tabs = $('#module-filter-tabs');

        function getParentTopOffset($obj, offset) {
          var $parent = $obj.offsetParent();
          if ($obj[0] != $parent[0]) {
            offset += $parent.position().top;
            return getParentTopOffset($parent, offset);
          }
          return offset;
        }

        var tabsTopOffset = null;
        function getParentsTopOffset() {
          if (tabsTopOffset === null) {
            tabsTopOffset = getParentTopOffset($tabs.parent(), 0);
          }
          return tabsTopOffset;
        }

        function viewportTop() {
          var top = $(window).scrollTop();
          return top;
        }

        function viewportBottom() {
          var top = $(window).scrollTop();
          var bottom = top + $(window).height();

          bottom -= $('#page-actions').height();

          return bottom;
        }

        function fixToTop(top) {
          if ($tabs.hasClass('bottom-fixed')) {
            $tabs.css({
              'position': 'absolute',
              'top': $tabs.position().top - getParentsTopOffset(),
              'bottom': 'auto'
            });
            $tabs.removeClass('bottom-fixed');
          }

          if (($tabs.css('position') == 'absolute' && $tabs.offset().top - top >= 0) || ($tabs.css('position') != 'absolute' && $tabs.offset().top - top <= 0)) {
            $tabs.addClass('top-fixed');
            $tabs.attr('style', '');
          }
        }

        function fixToBottom(bottom) {
          if ($tabs.hasClass('top-fixed')) {
            $tabs.css({
              'position': 'absolute',
              'top': $tabs.position().top - getParentsTopOffset(),
              'bottom': 'auto'
            });
            $tabs.removeClass('top-fixed');
          }

          if ($tabs.offset().top + $tabs.height() - bottom <= 0) {
            $tabs.addClass('bottom-fixed');
            var style = '';
            var pageActionsHeight = $('#page-actions').height();
            if (pageActionsHeight > 0) {
              style = 'bottom: ' + pageActionsHeight + 'px';
            }
            else if (Drupal.settings.moduleFilter.dynamicPosition) {
              // style = 'bottom: ' + $('#module-filter-submit', $tabs).height() + 'px';
            }
            $tabs.attr('style', style);
          }
        }

        var lastTop = 0;
        $(window).scroll(function() {
          var top = viewportTop();
          var bottom = viewportBottom();

          if ($modules.offset().top >= top) {
            $tabs.removeClass('top-fixed').attr('style', '');
          }
          else {
            if (top > lastTop) { // Downward scroll.
              if ($tabs.height() > bottom - top) {
                fixToBottom(bottom);
              }
              else {
                fixToTop(top);
              }
            }
            else { // Upward scroll.
              fixToTop(top);
            }
          }
          lastTop = top;
        });

        moduleFilter.adjustHeight();
      });
    }
  }
};

Drupal.ModuleFilter.Tab = function(element, id) {
  var self = this;

  this.id = id;
  this.hash = id.substring(0, id.length - 4);
  this.element = element;

  $('a', this.element).click(function() {
    if (!Drupal.settings.moduleFilter.useURLFragment) {
      var hash = (!self.element.hasClass('selected')) ? self.hash : 'all';
      Drupal.ModuleFilter.selectTab(hash);
      return false;
    }

    if (self.element.hasClass('selected')) {
      // Clear the active tab.
      window.location.hash = 'all';
      return false;
    }
  });

  $('tr.' + this.id, $('#system-modules')).hover(
    function() {
      self.element.addClass('suggest');
    },
    function() {
      self.element.removeClass('suggest');
    }
  );
};

Drupal.ModuleFilter.selectTab = function(hash) {
  if (!hash || Drupal.ModuleFilter.tabs[hash + '-tab'] == undefined || Drupal.settings.moduleFilter.enabledCounts[hash].total == 0) {
    if (Drupal.settings.moduleFilter.rememberActiveTab) {
      var activeTab = Drupal.ModuleFilter.getState('activeTab');
      if (activeTab && Drupal.ModuleFilter.tabs[activeTab + '-tab'] != undefined) {
        hash = activeTab;
      }
    }

    if (!hash) {
      hash = 'all';
    }
  }

  if (Drupal.ModuleFilter.activeTab != undefined) {
    Drupal.ModuleFilter.activeTab.element.removeClass('selected');
  }

  Drupal.ModuleFilter.activeTab = Drupal.ModuleFilter.tabs[hash + '-tab'];
  Drupal.ModuleFilter.activeTab.element.addClass('selected');

  var moduleFilter = $('input[name="module_filter[name]"]').data('moduleFilter');
  var filter = moduleFilter.applyFilter();

  if (!Drupal.ModuleFilter.modulesTop) {
    Drupal.ModuleFilter.modulesTop = $('#module-filter-modules').offset().top;
  }
  else {
    // Calculate header offset; this is important in case the site is using
    // admin_menu module which has fixed positioning and is on top of everything
    // else.
    var headerOffset = Drupal.settings.tableHeaderOffset ? eval(Drupal.settings.tableHeaderOffset + '()') : 0;
    // Scroll back to top of #module-filter-modules.
    $('html, body').animate({
      scrollTop: Drupal.ModuleFilter.modulesTop - headerOffset
    }, 500);
    // $('html, body').scrollTop(Drupal.ModuleFilter.modulesTop);
  }

  Drupal.ModuleFilter.setState('activeTab', hash);
};

Drupal.ModuleFilter.eventHandlerOperateByURLFragment = function(event) {
  var hash = $.param.fragment();
  Drupal.ModuleFilter.selectTab(hash);
};

Drupal.ModuleFilter.countSummary = function(id) {
  return Drupal.t('@enabled of @total', { '@enabled': Drupal.settings.moduleFilter.enabledCounts[id].enabled, '@total': Drupal.settings.moduleFilter.enabledCounts[id].total });
};

Drupal.ModuleFilter.Tab.prototype.updateEnabling = function(name, remove) {
  this.enabling = this.enabling || {};
  if (!remove) {
    this.enabling[name] = name;
  }
  else {
    delete this.enabling[name];
  }
};

Drupal.ModuleFilter.Tab.prototype.updateDisabling = function(name, remove) {
  this.disabling = this.disabling || {};
  if (!remove) {
    this.disabling[name] = name;
  }
  else {
    delete this.disabling[name];
  }
};

Drupal.ModuleFilter.Tab.prototype.updateVisualAid = function() {
  var visualAid = '';
  var enabling = new Array();
  var disabling = new Array();

  if (this.enabling != undefined) {
    for (var i in this.enabling) {
      enabling.push(this.enabling[i]);
    }
    if (enabling.length > 0) {
      enabling.sort();
      visualAid += '<span class="enabling">+' + enabling.join('</span>, <span class="enabling">') + '</span>';
    }
  }
  if (this.disabling != undefined) {
    for (var i in this.disabling) {
      disabling.push(this.disabling[i]);
    }
    if (disabling.length > 0) {
      disabling.sort();
      if (enabling.length > 0) {
        visualAid += '<br />';
      }
      visualAid += '<span class="disabling">-' + disabling.join('</span>, <span class="disabling">') + '</span>';
    }
  }

  if (this.visualAid == undefined) {
    $('a span.summary', this.element).append('<span class="visual-aid"></span>');
    this.visualAid = $('span.visual-aid', this.element);
  }

  this.visualAid.empty().append(visualAid);
};

Drupal.ModuleFilter.getTabID = function($row) {
  var id = $row.data('moduleFilterTabID');
  if (!id) {
    // Find the tab ID.
    var classes = $row.attr('class').split(' ');
    for (var i in classes) {
      if (Drupal.ModuleFilter.tabs[classes[i]] != undefined) {
        id = classes[i];
        break;
      }
    }
    $row.data('moduleFilterTabID', id);
  }
  return id;
};

Drupal.ModuleFilter.updateVisualAid = function(type, $row) {
  var id = Drupal.ModuleFilter.getTabID($row);

  if (!id) {
    return false;
  }

  var tab = Drupal.ModuleFilter.tabs[id];
  var name = $('td:nth(1) strong', $row).text();
  switch (type) {
    case 'enable':
      if (Drupal.ModuleFilter.disabling[id + name] != undefined) {
        delete Drupal.ModuleFilter.disabling[id + name];
        tab.updateDisabling(name, true);
        $row.removeClass('disabling');
      }
      else {
        Drupal.ModuleFilter.enabling[id + name] = name;
        tab.updateEnabling(name);
        $row.addClass('enabling');
      }
      break;
    case 'disable':
      if (Drupal.ModuleFilter.enabling[id + name] != undefined) {
        delete Drupal.ModuleFilter.enabling[id + name];
        tab.updateEnabling(name, true);
        $row.removeClass('enabling');
      }
      else {
        Drupal.ModuleFilter.disabling[id + name] = name;
        tab.updateDisabling(name);
        $row.addClass('disabling');
      }
      break;
  }

  tab.updateVisualAid();
};

Drupal.ModuleFilter.Filter.prototype.adjustHeight = function() {
  // Hack for adjusting the height of the modules section.
  var minHeight = $('#module-filter-tabs ul').height() + 10;
  minHeight += $('#module-filter-tabs #module-filter-submit').height();
  $('#module-filter-modules').css('min-height', minHeight);
  this.element.trigger('moduleFilter:adjustHeight');
}

})(jQuery);
;
(function($) {

Drupal.behaviors.moduleFilterDynamicPosition = {
  attach: function(context) {
    var $window = $(window);

    $('#module-filter-wrapper', context).once('dynamic-position', function() {
      // Move the submit button just below the tabs.
      $('#module-filter-tabs').append($('#module-filter-submit'));

      var positionSubmit = function() {
        var $tabs = $('#module-filter-tabs');
        var $submit = $('#module-filter-submit', $tabs);

        // Vertical movement.
        var bottom = $tabs.offset().top + $tabs.outerHeight();
        if ($submit.hasClass('fixed-bottom')) {
          bottom += $submit.height();
        }
        if (bottom >= $window.height() + $window.scrollTop()) {
          $submit.addClass('fixed fixed-bottom');
          $tabs.css('padding-bottom', $submit.height());
        }
        else {
          $submit.removeClass('fixed fixed-bottom');
          $tabs.css('padding-bottom', 0);
        }

        // Horizontal movement.
        if ($submit.hasClass('fixed-bottom') || $submit.hasClass('fixed-top')) {
          var left = $tabs.offset().left - $window.scrollLeft();
          if (left != $submit.offset().left - $window.scrollLeft()) {
            $submit.css('left', left);
          }
        }
      };

      // Control the positioning.
      $window.scroll(positionSubmit);
      $window.resize(positionSubmit);
      var moduleFilter = $('input[name="module_filter[name]"]').data('moduleFilter');
      moduleFilter.element.bind('moduleFilter:adjustHeight', positionSubmit);
      moduleFilter.adjustHeight();
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Attaches sticky table headers.
 */
Drupal.behaviors.tableHeader = {
  attach: function (context, settings) {
    if (!$.support.positionFixed) {
      return;
    }

    $('table.sticky-enabled', context).once('tableheader', function () {
      $(this).data("drupal-tableheader", new Drupal.tableHeader(this));
    });
  }
};

/**
 * Constructor for the tableHeader object. Provides sticky table headers.
 *
 * @param table
 *   DOM object for the table to add a sticky header to.
 */
Drupal.tableHeader = function (table) {
  var self = this;

  this.originalTable = $(table);
  this.originalHeader = $(table).children('thead');
  this.originalHeaderCells = this.originalHeader.find('> tr > th');
  this.displayWeight = null;

  // React to columns change to avoid making checks in the scroll callback.
  this.originalTable.bind('columnschange', function (e, display) {
    // This will force header size to be calculated on scroll.
    self.widthCalculated = (self.displayWeight !== null && self.displayWeight === display);
    self.displayWeight = display;
  });

  // Clone the table header so it inherits original jQuery properties. Hide
  // the table to avoid a flash of the header clone upon page load.
  this.stickyTable = $('<table class="sticky-header"/>')
    .insertBefore(this.originalTable)
    .css({ position: 'fixed', top: '0px' });
  this.stickyHeader = this.originalHeader.clone(true)
    .hide()
    .appendTo(this.stickyTable);
  this.stickyHeaderCells = this.stickyHeader.find('> tr > th');

  this.originalTable.addClass('sticky-table');
  $(window)
    .bind('scroll.drupal-tableheader', $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    .bind('resize.drupal-tableheader', { calculateWidth: true }, $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    // Make sure the anchor being scrolled into view is not hidden beneath the
    // sticky table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceAnchor.drupal-tableheader', function () {
      window.scrollBy(0, -self.stickyTable.outerHeight());
    })
    // Make sure the element being focused is not hidden beneath the sticky
    // table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceFocus.drupal-tableheader', function (event) {
      if (self.stickyVisible && event.clientY < (self.stickyOffsetTop + self.stickyTable.outerHeight()) && event.$target.closest('sticky-header').length === 0) {
        window.scrollBy(0, -self.stickyTable.outerHeight());
      }
    })
    .triggerHandler('resize.drupal-tableheader');

  // We hid the header to avoid it showing up erroneously on page load;
  // we need to unhide it now so that it will show up when expected.
  this.stickyHeader.show();
};

/**
 * Event handler: recalculates position of the sticky table header.
 *
 * @param event
 *   Event being triggered.
 */
Drupal.tableHeader.prototype.eventhandlerRecalculateStickyHeader = function (event) {
  var self = this;
  var calculateWidth = event.data && event.data.calculateWidth;

  // Reset top position of sticky table headers to the current top offset.
  this.stickyOffsetTop = Drupal.settings.tableHeaderOffset ? eval(Drupal.settings.tableHeaderOffset + '()') : 0;
  this.stickyTable.css('top', this.stickyOffsetTop + 'px');

  // Save positioning data.
  var viewHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  if (calculateWidth || this.viewHeight !== viewHeight) {
    this.viewHeight = viewHeight;
    this.vPosition = this.originalTable.offset().top - 4 - this.stickyOffsetTop;
    this.hPosition = this.originalTable.offset().left;
    this.vLength = this.originalTable[0].clientHeight - 100;
    calculateWidth = true;
  }

  // Track horizontal positioning relative to the viewport and set visibility.
  var hScroll = document.documentElement.scrollLeft || document.body.scrollLeft;
  var vOffset = (document.documentElement.scrollTop || document.body.scrollTop) - this.vPosition;
  this.stickyVisible = vOffset > 0 && vOffset < this.vLength;
  this.stickyTable.css({ left: (-hScroll + this.hPosition) + 'px', visibility: this.stickyVisible ? 'visible' : 'hidden' });

  // Only perform expensive calculations if the sticky header is actually
  // visible or when forced.
  if (this.stickyVisible && (calculateWidth || !this.widthCalculated)) {
    this.widthCalculated = true;
    var $that = null;
    var $stickyCell = null;
    var display = null;
    var cellWidth = null;
    // Resize header and its cell widths.
    // Only apply width to visible table cells. This prevents the header from
    // displaying incorrectly when the sticky header is no longer visible.
    for (var i = 0, il = this.originalHeaderCells.length; i < il; i += 1) {
      $that = $(this.originalHeaderCells[i]);
      $stickyCell = this.stickyHeaderCells.eq($that.index());
      display = $that.css('display');
      if (display !== 'none') {
        cellWidth = $that.css('width');
        // Exception for IE7.
        if (cellWidth === 'auto') {
          cellWidth = $that[0].clientWidth + 'px';
        }
        $stickyCell.css({'width': cellWidth, 'display': display});
      }
      else {
        $stickyCell.css('display', 'none');
      }
    }
    this.stickyTable.css('width', this.originalTable.outerWidth());
  }
};

})(jQuery);
;
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;
(function ($) {

  Drupal.personalize = Drupal.personalize || {};
  Drupal.personalize.executors = Drupal.personalize.executors || {};
  Drupal.personalize.executors.personalizeElements = {
    execute: function($option_set, choice_name, osid, preview) {
      if (typeof preview === 'undefined') { preview = false; }
      var element = Drupal.settings.personalize_elements.elements[osid];
      if (element == undefined) return;
      if (Drupal.personalizeElements.hasOwnProperty(element.variation_type) && typeof Drupal.personalizeElements[element.variation_type].execute === 'function') {
        if (preview && !element.previewable) {
          // If this variation is not previewable in the normal way, we can just reload
          // the page with the selected option.
          var base = Drupal.settings.basePath + Drupal.settings.pathPrefix;
          var path = location.pathname && /^(?:[\/\?\#])*(.*)/.exec(location.pathname)[1] || '';
          var param = Drupal.settings.personalize.optionPreselectParam;
          document.location.href = base + path + '?' + param + '=' + osid + '--' + choice_name;
        }
        else {
          // Add the personalize data attribute for the option set.
          if ($option_set.length > 0) {
            $option_set.attr('data-personalize', osid);
          }
          var choices = Drupal.settings.personalize.option_sets[osid].options,  selectedChoice = null, selectedContent = null, isControl = false, choiceIndex = null, choice = null;
          if (choice_name) {
            for (choiceIndex in choices) {
              choice = choices[choiceIndex];
              if (choice.option_id == choice_name) {
                selectedChoice = choice;
                break;
              }
            }
          }
          // This might be a "do nothing" option, either because it is the control option
          // or because it is an option with no content, in which case we treat is as the
          // control option.
          if (choice_name == Drupal.settings.personalize.controlOptionName || !selectedChoice || !selectedChoice.hasOwnProperty('personalize_elements_content')) {
            isControl = true;
          }
          else {
            selectedContent = selectedChoice.personalize_elements_content;
          }
          // runJS does not require a selector and editHtml can result in an
          // empty option set if the new html alters the DOM structure.
          if ($option_set.length == 0 && ['runJS','editHtml'].indexOf(element.variation_type) == -1) {
            return;
          } else if ($option_set.length > 1) {
            var agent_name = Drupal.settings.personalize.option_sets[osid].agent;
            Drupal.personalize.debug('Selector ' + element.selector + ' in personalization ' + agent_name + ' matches multiple DOM elements, cannot perform personalization', 5010);
            // Cannot perform personalization on sets of matched elements.
            return;
          }
          Drupal.personalizeElements[element.variation_type].execute($option_set, selectedContent, isControl, osid);
          Drupal.personalize.executorCompleted($option_set, choice_name, osid);
        }
      }
    }
  };

  Drupal.personalizeElements = {};

  Drupal.personalizeElements.runJS = {
    execute : function ($selector, selectedContent, isControl, osid) {
      if (!isControl) {
        // The contents of the selectedContent variable were written by someone
        // who was explicitly given permission to write JavaScript to be executed
        // on this site. Mitigating the evil of the eval.
        eval(selectedContent);
        Drupal.attachBehaviors();
      }
    }
  };

  Drupal.personalizeElements.replaceHtml = {
    controlContent : {},
    execute : function($selector, selectedContent, isControl, osid) {
      // We need to keep track of how we've changed the element, if only
      // to support previewing different options.
      if (!this.controlContent.hasOwnProperty(osid)) {
        this.controlContent[osid] = $selector.html();
      }
      if (isControl) {
        $selector.html(this.controlContent[osid]);
      }
      else {
        $selector.html(selectedContent);
        Drupal.attachBehaviors($selector);
      }

    }
  };

  Drupal.personalizeElements.editHtml = {
    controlContent: {},
    getOuterHtml: function ($element) {
      if ($element.length > 1) {
        $element = $element.first();
      }
      // jQuery doesn't have an outerHTML so we need to clone the child and
      // give it a parent so that we can call that parent's html function.
      // This ensures we get only the html of the $selector and not siblings.
      var $element = $element.clone().wrap('<div>').parent();

      // Now return the child html of our wrapper parent tag.
      return $element.html();
    },
    // JQuery does not provide a public way to find events so we have to resort
    // to semi-documented structures.
    // http://blog.jquery.com/2011/11/08/building-a-slimmer-jquery/
    getElementEvents: function ($element) {
      if ($element.length === 0) return {};
      if ($._data) {
        // jQuery 1.8 and higher.
        return $._data($element.get(0), "events");
      } else if ($element.data) {
        // Older jQuery version.
        return $element.data('events');
      }
      return {};
    },
    addElementEvents: function($element, events) {
      for (var type in events) {
        var i, num = events[type].length;
        for (i = 0; i < num;  i++) {
          var event = events[type][i];
          if (event.handler) {
            var eventBind = (event.namespace && event.namespace.length > 0) ? type + '.' + event.namespace : type;
            var dataBind = event.data ? event.data : {};
            $element.bind(eventBind, dataBind, event.handler);
          }
        }
      }
    },
    addElementData: function($element, data) {
      for (var key in data) {
        $.data($element.get(0), key, data[key]);
      }
      return $element;
    },
    getElement: function (osid) {
      return $('[data-personalize="' + osid + '"]');
    },
    execute : function($selector, selectedContent, isControl, osid) {
      // Keep track of how the element has been changed in order to preview
      // different options.
      if (!this.controlContent.hasOwnProperty(osid)) {
        this.controlContent[osid] = this.getOuterHtml($selector);
      }
      if ($selector.length === 0) {
        $selector = this.getElement(osid);
      }
      var events = this.getElementEvents($selector);
      var data = $selector.data();
      if (isControl) {
        // Don't do anything if the control is already being shown.
        if (this.controlContent[osid] == this.getOuterHtml($selector)) {
          return;
        }
        $selector.replaceWith(this.controlContent[osid]);
        // Reset the $selector variable to the new element.
        $selector = this.getElement(osid);
        this.addElementEvents($selector, events);
        this.addElementData($selector, data);
      } else {
        if (selectedContent.charAt(0) != '<') {
          // We need this content to be wrapped in a tag so that it can be
          // marked with the osid for later selection.
          selectedContent = '<span>' + selectedContent + '</span>';
        }
        var $newContent = $(selectedContent).replaceAll($selector);
        // Add the data attribute to the new content.
        $newContent.attr('data-personalize', osid);
        this.addElementEvents($newContent, events);
        this.addElementData($newContent, data);
        Drupal.attachBehaviors($newContent);
      }
    }
  };

  Drupal.personalizeElements.editText = {
    controlContent: {},
    execute : function($selector, selectedContent, isControl, osid) {
      // Keep track of how the element has been changed in order to preview
      // different options.
      if (!this.controlContent.hasOwnProperty(osid)) {
        this.controlContent[osid] = $selector.text();
      }
      if (isControl) {
        $selector.text(this.controlContent[osid]);
      } else {
        $selector.text(selectedContent);
      }
    }
  };

  Drupal.personalizeElements.addClass = {
    addedClasses : {},
    execute : function($selector, selectedContent, isControl, osid) {
      // We need to keep track of how we've changed the element, if only
      // to support previewing different options.
      if (!this.addedClasses.hasOwnProperty(osid)) {
        this.addedClasses[osid] = [];
      }
      for (var i in this.addedClasses[osid]) {
        if (this.addedClasses[osid].hasOwnProperty(i)) {
          $selector.removeClass(this.addedClasses[osid].shift());
        }
      }
      if (!isControl) {
        $selector.addClass(selectedContent);
        this.addedClasses[osid].push(selectedContent);
      }
    }
  };

  Drupal.personalizeElements.appendHtml = {
    execute : function($selector, selectedContent, isControl, osid) {
      var id = 'personalize-elements-append-' + osid;
      $('#' + id).remove();
      if (!isControl) {
        $selector.append('<span id="' + id + '">' + selectedContent + '</span>');
        Drupal.attachBehaviors($selector);
      }
    }
  };

  Drupal.personalizeElements.prependHtml = {
    execute : function($selector, selectedContent, isControl, osid) {
      var id = 'personalize-elements-prepend-' + osid;
      $('#' + id).remove();
      if (!isControl) {
        $selector.prepend('<span id="' + id + '">' + selectedContent + '</span>');
        Drupal.attachBehaviors($selector);
      }
    }
  };

})(jQuery);
;
(function ($) {

  var initialized = false;
  var context = 'querystring_context';

  function init() {
    for (var name in Drupal.settings.personalize_url_context.querystring_params) {
      if (Drupal.settings.personalize_url_context.querystring_params.hasOwnProperty(name)) {
        Drupal.personalize.visitor_context_write(name, context, Drupal.settings.personalize_url_context.querystring_params[name]);
      }
    }
    var baseUrl = Drupal.settings.personalize_url_context.base_url, referrer = document.referrer;
    if (referrer && referrer.indexOf(baseUrl) == -1) {
      Drupal.personalize.visitor_context_write('referrer_url', context, referrer);
      Drupal.personalize.visitor_context_write('original_referrer_url', context, referrer, false);
    }
    initialized = true;
  }

  Drupal.behaviors.personalize_url_context = {
    attach: function (context, settings) {
      if (!initialized) {
        init();
      }
    }
  };

  Drupal.personalize = Drupal.personalize || {};
  Drupal.personalize.visitor_context = Drupal.personalize.visitor_context || {};
  Drupal.personalize.visitor_context.querystring_context = {
    'getContext': function(enabled) {
      if (!initialized) {
        init();
      }
      var i, context_values = {};
      for (i in enabled) {
        if (enabled.hasOwnProperty(i)) {
          var val = Drupal.personalize.visitor_context_read(i, context);
          if (val !== null) {
            context_values[i] = val;
          }
        }
      }
      return context_values;
    }
  };

})(jQuery);
;
/**
 * @file
 * SEARCH AUTOCOMPLETE javascript mechanism.
 * 
 * Sponsored by:
 * www.axiomcafe.fr
 */

(function ($) {

  // Autocomplete
  $.ui.autocomplete.prototype._renderItem = function (ul, item) {
    var term = this.term;
    var first = ("group" in item)  ? 'first' : '';
    var innerHTML = '<div class="ui-autocomplete-fields ' + first + '">';
    if (item.fields) {
      $.each(item.fields, function(key, value) {
        var regex = new RegExp('(' + $.trim(term) + ')', 'gi');
        var output = value;
        if (value.indexOf('src=') == -1 && value.indexOf('href=') == -1) {
          output = value.replace(regex, "<span class='ui-autocomplete-field-term'>$1</span>");
        }
        innerHTML += ('<div class="ui-autocomplete-field-' + key + '">' + output + '</div>');
      });
    } else {
      innerHTML += ('<div class="ui-autocomplete-field">' + item.label + '</div>');
    }
    innerHTML += '</div>';

    var group = '';
    if ("group" in item) {
    	groupId = typeof(item.group.group_id) !== 'undefined' ? item.group.group_id : '';
    	groupName = typeof(item.group.group_name) !== 'undefined' ? item.group.group_name : '';
      group += ('<div class="ui-autocomplete-field-group ' + groupId + '">' + groupName + '</div>');
      $(group).appendTo(ul);
    }
    var elem =  $("<li class=ui-menu-item-" + first + "></li>" )
    .append("<a>" + innerHTML + "</a>");   
    if (item.value == '') {
    	elem = $("<li class='ui-state-disabled ui-menu-item-" + first + " ui-menu-item'>" + item.label + "</li>" );
    }
		elem.data("item.autocomplete", item)
    .appendTo(ul);
    
    Drupal.attachBehaviors(elem);
    return elem;
  };

  $.ui.autocomplete.prototype._resizeMenu = function() {
    var ul = this.menu.element;
    ul.outerWidth(Math.max(ul.width("").outerWidth() + 5, this.options.position.of == null ? this.element.outerWidth() : this.options.position.of.outerWidth()));
  };

  Drupal.behaviors.search_autocomplete = {
    attach: function(context) {
      if (Drupal.settings.search_autocomplete) {
        $.each(Drupal.settings.search_autocomplete, function(key, value) {
        	var no_results = Drupal.settings.search_autocomplete[key].no_results;
        	var all_results = Drupal.settings.search_autocomplete[key].all_results;
          $(Drupal.settings.search_autocomplete[key].selector).bind("mouseover", function() {
             $(Drupal.settings.search_autocomplete[key].selector).addClass('ui-autocomplete-processed ui-theme-' + Drupal.settings.search_autocomplete[key].theme).autocomplete({
            	 	minLength: Drupal.settings.search_autocomplete[key].minChars,
            	 	source: function(request, response) {
		              // External URL:
		              if (Drupal.settings.search_autocomplete[key].type == 'external') {
		                $.getJSON(Drupal.settings.search_autocomplete[key].datas, { q: request.term }, function (results) {
		                  // Only return the number of values set in the settings.
		                  if (!results.length && no_results) {
		                      results = [jQuery.parseJSON(no_results.replace(/\[search-phrase\]/g, request.term))];
		                  } else {
		                  	results.slice(0, Drupal.settings.search_autocomplete[key].max_sug);
	                  		results.push(jQuery.parseJSON(all_results.replace(/\[search-phrase\]/g, request.term)));
		                  }
		                  response(results);
		                });
		              }
		              // Internal URL:
		              else if (Drupal.settings.search_autocomplete[key].type == 'internal' || Drupal.settings.search_autocomplete[key].type == 'view') {
		                $.getJSON(Drupal.settings.search_autocomplete[key].datas + request.term, { }, function (results) {
		                  // Only return the number of values set in the settings.
		                  if (!results.length && no_results) {
		                      results = [jQuery.parseJSON(no_results.replace(/\[search-phrase\]/g, request.term))];
		                  } else {
		                  	results.slice(0, Drupal.settings.search_autocomplete[key].max_sug);
	                  		results.push(jQuery.parseJSON(all_results.replace(/\[search-phrase\]/g, request.term)));
		                  }
		                  response(results);
		                });
		              }
		              // Static resources:
		              else if (Drupal.settings.search_autocomplete[key].type == 'static') {
		                var results = $.ui.autocomplete.filter(Drupal.settings.search_autocomplete[key].datas, request.term);
	                  if (!results.length && no_results) {
	                  	results = [jQuery.parseJSON(no_results.replace(/\[search-phrase\]/g, request.term))];
	                  } else {
	                  	results.slice(0, Drupal.settings.search_autocomplete[key].max_sug);
	                		results.push(jQuery.parseJSON(all_results.replace(/\[search-phrase\]/g, request.term)));
	                  }
	                  response(results);
		              }
		            },
		            open: function(event, ui) {
		              $(".ui-autocomplete li.ui-menu-item:odd").addClass("ui-menu-item-odd");
		              $(".ui-autocomplete li.ui-menu-item:even").addClass("ui-menu-item-even");
		              $(".ui-autocomplete").prepend("<a href='#' class='close-cancel'>Cancel</a>");
              		  $( ".close-cancel" ).click(function() {
                      $( ".form-text" ).val('').focus();
                      $(".ui-autocomplete").hide();

                       });
		            },
		            select: function(event, ui) {
		              if (Drupal.settings.search_autocomplete[key].auto_redirect == 1 && ui.item.link) {
		                document.location.href = ui.item.link;
		              } else if (Drupal.settings.search_autocomplete[key].auto_submit == 1 && ui.item.value) {
		                  $(this).val(ui.item.value);
		                  $(this).closest("form").submit();
		              }
//		              } else {
//			            	event.preventDefault();
//		              }
		            },
		            focus: function (event, ui) {
		              if (ui.item.label === no_results) {
		                  event.preventDefault();
		              }
		            },
		            appendTo: $(Drupal.settings.search_autocomplete[key].selector).parent(),
             }).autocomplete("widget").attr("id", "ui-theme-" + Drupal.settings.search_autocomplete[key].theme);
        	});
          $(Drupal.settings.search_autocomplete[key].selector).trigger('mouseover');
       });
      }
    }
  };
})(jQuery);
;
