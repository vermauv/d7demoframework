(function ($) {
  Drupal.behaviors.commerce_fancy_attributes = {
    attach: function (context, settings) {
      $('.form-type-commerce-fancy-attributes').addClass('form-type-commerce-fancy-attributes-ajax');
      $('.form-type-commerce-fancy-attributes input[type=radio]').hide();
      $('.form-type-commerce-fancy-attributes label.option').hide();

      $('.form-type-commerce-fancy-attributes-ajax .description').click(function() {
        var parent = $(this).parent();
        $('input[type=radio]', parent).click();
        $('input[type=radio]', parent).change();
      });
    }
  };
}) (jQuery);
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
/* jshint unused:false */
/* global base64_decode, CSSWizardView, window, console, jQuery */
(function(global) {
  'use strict';
  var fi = function() {

    this.cssImportStatements = [];
    this.cssKeyframeStatements = [];

    this.cssRegex = new RegExp('([\\s\\S]*?){([\\s\\S]*?)}', 'gi');
    this.cssMediaQueryRegex = '((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})';
    this.cssKeyframeRegex = '((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})';
    this.combinedCSSRegex = '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})'; //to match css & media queries together
    this.cssCommentsRegex = '(\\/\\*[\\s\\S]*?\\*\\/)';
    this.cssImportStatementRegex = new RegExp('@import .*?;', 'gi');
  };

  /*
    Strip outs css comments and returns cleaned css string

    @param css, the original css string to be stipped out of comments

    @return cleanedCSS contains no css comments
  */
  fi.prototype.stripComments = function(cssString) {
    var regex = new RegExp(this.cssCommentsRegex, 'gi');

    return cssString.replace(regex, '');
  };

  /*
    Parses given css string, and returns css object
    keys as selectors and values are css rules
    eliminates all css comments before parsing

    @param source css string to be parsed

    @return object css
  */
  fi.prototype.parseCSS = function(source) {

    if (source === undefined) {
      return [];
    }

    var css = [];
    //strip out comments
    //source = this.stripComments(source);

    //get import statements

    while (true) {
      var imports = this.cssImportStatementRegex.exec(source);
      if (imports !== null) {
        this.cssImportStatements.push(imports[0]);
        css.push({
          selector: '@imports',
          type: 'imports',
          styles: imports[0]
        });
      } else {
        break;
      }
    }
    source = source.replace(this.cssImportStatementRegex, '');
    //get keyframe statements
    var keyframesRegex = new RegExp(this.cssKeyframeRegex, 'gi');
    var arr;
    while (true) {
      arr = keyframesRegex.exec(source);
      if (arr === null) {
        break;
      }
      css.push({
        selector: '@keyframes',
        type: 'keyframes',
        styles: arr[0]
      });
    }
    source = source.replace(keyframesRegex, '');

    //unified regex
    var unified = new RegExp(this.combinedCSSRegex, 'gi');

    while (true) {
      arr = unified.exec(source);
      if (arr === null) {
        break;
      }
      var selector = '';
      if (arr[2] === undefined) {
        selector = arr[5].split('\r\n').join('\n').trim();
      } else {
        selector = arr[2].split('\r\n').join('\n').trim();
      }

      /*
        fetch comments and associate it with current selector
      */
      var commentsRegex = new RegExp(this.cssCommentsRegex, 'gi');
      var comments = commentsRegex.exec(selector);
      if (comments !== null) {
        selector = selector.replace(commentsRegex, '').trim();
      }

      // Never have more than a single line break in a row
      selector = selector.replace(/\n+/, "\n");

      //determine the type
      if (selector.indexOf('@media') !== -1) {
        //we have a media query
        var cssObject = {
          selector: selector,
          type: 'media',
          subStyles: this.parseCSS(arr[3] + '\n}') //recursively parse media query inner css
        };
        if (comments !== null) {
          cssObject.comments = comments[0];
        }
        css.push(cssObject);
      } else {
        //we have standard css
        var rules = this.parseRules(arr[6]);
        var style = {
          selector: selector,
          rules: rules
        };
        if (selector === '@font-face') {
          style.type = 'font-face';
        }
        if (comments !== null) {
          style.comments = comments[0];
        }
        css.push(style);
      }
    }

    return css;
  };

  /*
    parses given string containing css directives
    and returns an array of objects containing ruleName:ruleValue pairs

    @param rules, css directive string example
        \n\ncolor:white;\n    font-size:18px;\n
  */
  fi.prototype.parseRules = function(rules) {
    //convert all windows style line endings to unix style line endings
    rules = rules.split('\r\n').join('\n');
    var ret = [];

    rules = rules.split(';');

    //proccess rules line by line
    for (var i = 0; i < rules.length; i++) {
      var line = rules[i];

      //determine if line is a valid css directive, ie color:white;
      line = line.trim();
      if (line.indexOf(':') !== -1) {
        //line contains :
        line = line.split(':');
        var cssDirective = line[0].trim();
        var cssValue = line.slice(1).join(':').trim();

        //more checks
        if (cssDirective.length < 1 || cssValue.length < 1) {
          continue; //there is no css directive or value that is of length 1 or 0
          // PLAIN WRONG WHAT ABOUT margin:0; ?
        }

        //push rule
        ret.push({
          directive: cssDirective,
          value: cssValue
        });
      } else {
        //if there is no ':', but what if it was mis splitted value which starts with base64
        if (line.trim().substr(0, 7) === 'base64,') { //hack :)
          ret[ret.length - 1].value += line.trim();
        } else {
          //add rule, even if it is defective
          if (line.length > 0) {
            ret.push({
              directive: '',
              value: line,
              defective: true
            });
          }
        }
      }
    }

    return ret; //we are done!
  };
  /*
    just returns the rule having given directive
    if not found returns false;
  */
  fi.prototype.findCorrespondingRule = function(rules, directive, value) {
    if (value === undefined) {
      value = false;
    }
    var ret = false;
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].directive === directive) {
        ret = rules[i];
        if (value === rules[i].value) {
          break;
        }
      }
    }
    return ret;
  };

  /*
      Finds styles that have given selector, compress them,
      and returns them
  */
  fi.prototype.findBySelector = function(cssObjectArray, selector, contains) {
    if (contains === undefined) {
      contains = false;
    }

    var found = [];
    for (var i = 0; i < cssObjectArray.length; i++) {
      if (contains === false) {
        if (cssObjectArray[i].selector === selector) {
          found.push(cssObjectArray[i]);
        }
      } else {
        if (cssObjectArray[i].selector.indexOf(selector) !== -1) {
          found.push(cssObjectArray[i]);
        }
      }

    }
    if (found.length < 2) {
      return found;
    } else {
      var base = found[0];
      for (i = 1; i < found.length; i++) {
        this.intelligentCSSPush([base], found[i]);
      }
      return [base]; //we are done!! all properties merged into base!
    }
  };

  /*
    deletes cssObjects having given selector, and returns new array
  */
  fi.prototype.deleteBySelector = function(cssObjectArray, selector) {
    var ret = [];
    for (var i = 0; i < cssObjectArray.length; i++) {
      if (cssObjectArray[i].selector !== selector) {
        ret.push(cssObjectArray[i]);
      }
    }
    return ret;
  };

  /*
      Compresses given cssObjectArray and tries to minimize
      selector redundence.
  */
  fi.prototype.compressCSS = function(cssObjectArray) {
    var compressed = [];
    var done = {};
    for (var i = 0; i < cssObjectArray.length; i++) {
      var obj = cssObjectArray[i];
      if (done[obj.selector] === true) {
        continue;
      }

      var found = this.findBySelector(cssObjectArray, obj.selector); //found compressed
      if (found.length !== 0) {
        compressed.push(found[0]);
        done[obj.selector] = true;
      }
    }
    return compressed;
  };

  /*
    Received 2 css objects with following structure
      {
        rules : [{directive:"", value:""}, {directive:"", value:""}, ...]
        selector : "SOMESELECTOR"
      }

    returns the changed(new,removed,updated) values on css1 parameter, on same structure

    if two css objects are the same, then returns false

      if a css directive exists in css1 and     css2, and its value is different, it is included in diff
      if a css directive exists in css1 and not css2, it is then included in diff
      if a css directive exists in css2 but not css1, then it is deleted in css1, it would be included in diff but will be marked as type='DELETED'

      @object css1 css object
      @object css2 css object

      @return diff css object contains changed values in css1 in regards to css2 see test input output in /test/data/css.js
  */
  fi.prototype.cssDiff = function(css1, css2) {
    if (css1.selector !== css2.selector) {
      return false;
    }

    //if one of them is media query return false, because diff function can not operate on media queries
    if ((css1.type === 'media' || css2.type === 'media')) {
      return false;
    }

    var diff = {
      selector: css1.selector,
      rules: []
    };
    var rule1, rule2;
    for (var i = 0; i < css1.rules.length; i++) {
      rule1 = css1.rules[i];
      //find rule2 which has the same directive as rule1
      rule2 = this.findCorrespondingRule(css2.rules, rule1.directive, rule1.value);
      if (rule2 === false) {
        //rule1 is a new rule in css1
        diff.rules.push(rule1);
      } else {
        //rule2 was found only push if its value is different too
        if (rule1.value !== rule2.value) {
          diff.rules.push(rule1);
        }
      }
    }

    //now for rules exists in css2 but not in css1, which means deleted rules
    for (var ii = 0; ii < css2.rules.length; ii++) {
      rule2 = css2.rules[ii];
      //find rule2 which has the same directive as rule1
      rule1 = this.findCorrespondingRule(css1.rules, rule2.directive);
      if (rule1 === false) {
        //rule1 is a new rule
        rule2.type = 'DELETED'; //mark it as a deleted rule, so that other merge operations could be true
        diff.rules.push(rule2);
      }
    }


    if (diff.rules.length === 0) {
      return false;
    }
    return diff;
  };

  /*
      Merges 2 different css objects together
      using intelligentCSSPush,

      @param cssObjectArray, target css object array
      @param newArray, source array that will be pushed into cssObjectArray parameter
      @param reverse, [optional], if given true, first parameter will be traversed on reversed order
              effectively giving priority to the styles in newArray
  */
  fi.prototype.intelligentMerge = function(cssObjectArray, newArray, reverse) {
    if (reverse === undefined) {
      reverse = false;
    }


    for (var i = 0; i < newArray.length; i++) {
      this.intelligentCSSPush(cssObjectArray, newArray[i], reverse);
    }
    for (i = 0; i < cssObjectArray.length; i++) {
      var cobj = cssObjectArray[i];
      if (cobj.type === 'media' || (cobj.type === 'keyframes')) {
        continue;
      }
      cobj.rules = this.compactRules(cobj.rules);
    }
  };

  /*
    inserts new css objects into a bigger css object
    with same selectors grouped together

    @param cssObjectArray, array of bigger css object to be pushed into
    @param minimalObject, single css object
    @param reverse [optional] default is false, if given, cssObjectArray will be reversly traversed
            resulting more priority in minimalObject's styles
  */
  fi.prototype.intelligentCSSPush = function(cssObjectArray, minimalObject, reverse) {
    var pushSelector = minimalObject.selector;
    //find correct selector if not found just push minimalObject into cssObject
    var cssObject = false;

    if (reverse === undefined) {
      reverse = false;
    }

    if (reverse === false) {
      for (var i = 0; i < cssObjectArray.length; i++) {
        if (cssObjectArray[i].selector === minimalObject.selector) {
          cssObject = cssObjectArray[i];
          break;
        }
      }
    } else {
      for (var j = cssObjectArray.length - 1; j > -1; j--) {
        if (cssObjectArray[j].selector === minimalObject.selector) {
          cssObject = cssObjectArray[j];
          break;
        }
      }
    }

    if (cssObject === false) {
      cssObjectArray.push(minimalObject); //just push, because cssSelector is new
    } else {
      if (minimalObject.type !== 'media') {
        for (var ii = 0; ii < minimalObject.rules.length; ii++) {
          var rule = minimalObject.rules[ii];
          //find rule inside cssObject
          var oldRule = this.findCorrespondingRule(cssObject.rules, rule.directive);
          if (oldRule === false) {
            cssObject.rules.push(rule);
          } else if (rule.type === 'DELETED') {
            oldRule.type = 'DELETED';
          } else {
            //rule found just update value

            oldRule.value = rule.value;
          }
        }
      } else {
        cssObject.subStyles = cssObject.subStyles.concat(minimalObject.subStyles); //TODO, make this intelligent too
      }

    }
  };

  /*
    filter outs rule objects whose type param equal to DELETED

    @param rules, array of rules

    @returns rules array, compacted by deleting all unnecessary rules
  */
  fi.prototype.compactRules = function(rules) {
    var newRules = [];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].type !== 'DELETED') {
        newRules.push(rules[i]);
      }
    }
    return newRules;
  };
  /*
    computes string for ace editor using this.css or given cssBase optional parameter

    @param [optional] cssBase, if given computes cssString from cssObject array
  */
  fi.prototype.getCSSForEditor = function(cssBase, depth) {
    if (depth === undefined) {
      depth = 0;
    }
    var ret = '';
    if (cssBase === undefined) {
      cssBase = this.css;
    }
    //append imports
    for (var i = 0; i < cssBase.length; i++) {
      if (cssBase[i].type === 'imports') {
        ret += cssBase[i].styles + '\n\n';
      }
    }
    for (i = 0; i < cssBase.length; i++) {
      var tmp = cssBase[i];
      if (tmp.selector === undefined) { //temporarily omit media queries
        continue;
      }
      var comments = "";
      if (tmp.comments !== undefined) {
        comments = tmp.comments + '\n';
      }

      if (tmp.type === 'media') { //also put media queries to output
        ret += comments + tmp.selector + '{\n';
        ret += this.getCSSForEditor(tmp.subStyles, depth + 1);
        ret += '}\n\n';
      } else if (tmp.type !== 'keyframes' && tmp.type !== 'imports') {
        ret += this.getSpaces(depth) + comments + tmp.selector + ' {\n';
        ret += this.getCSSOfRules(tmp.rules, depth + 1);
        ret += this.getSpaces(depth) + '}\n\n';
      }
    }

    //append keyFrames
    for (i = 0; i < cssBase.length; i++) {
      if (cssBase[i].type === 'keyframes') {
        ret += cssBase[i].styles + '\n\n';
      }
    }

    return ret;
  };

  fi.prototype.getImports = function(cssObjectArray) {
    var imps = [];
    for (var i = 0; i < cssObjectArray.length; i++) {
      if (cssObjectArray[i].type === 'imports') {
        imps.push(cssObjectArray[i].styles);
      }
    }
    return imps;
  };
  /*
    given rules array, returns visually formatted css string
    to be used inside editor
  */
  fi.prototype.getCSSOfRules = function(rules, depth) {
    var ret = '';
    for (var i = 0; i < rules.length; i++) {
      if (rules[i] === undefined) {
        continue;
      }
      if (rules[i].defective === undefined) {
        ret += this.getSpaces(depth) + rules[i].directive + ': ' + rules[i].value + ';\n';
      } else {
        ret += this.getSpaces(depth) + rules[i].value + ';\n';
      }

    }
    return ret || '\n';
  };

  /*
      A very simple helper function returns number of spaces appended in a single string,
      the number depends input parameter, namely input*2
  */
  fi.prototype.getSpaces = function(num) {
    var ret = '';
    for (var i = 0; i < num * 4; i++) {
      ret += ' ';
    }
    return ret;
  };

  /*
    Given css string or objectArray, parses it and then for every selector,
    prepends this.cssPreviewNamespace to prevent css collision issues

    @returns css string in which this.cssPreviewNamespace prepended
  */
  fi.prototype.applyNamespacing = function(css, forcedNamespace) {
    var cssObjectArray = css;
    var namespaceClass = '.' + this.cssPreviewNamespace;
    if(forcedNamespace !== undefined){
      namespaceClass = forcedNamespace;
    }

    if (typeof css === 'string') {
      cssObjectArray = this.parseCSS(css);
    }

    for (var i = 0; i < cssObjectArray.length; i++) {
      var obj = cssObjectArray[i];

      //bypass namespacing for @font-face @keyframes @import
      if(obj.selector.indexOf('@font-face') > -1 || obj.selector.indexOf('keyframes') > -1 || obj.selector.indexOf('@import') > -1 || obj.selector.indexOf('.form-all') > -1 || obj.selector.indexOf('#stage') > -1){
        continue;
      }

      if (obj.type !== 'media') {
        var selector = obj.selector.split(',');
        var newSelector = [];
        for (var j = 0; j < selector.length; j++) {
          if (selector[j].indexOf('.supernova') === -1) { //do not apply namespacing to selectors including supernova
            newSelector.push(namespaceClass + ' ' + selector[j]);
          } else {
            newSelector.push(selector[j]);
          }
        }
        obj.selector = newSelector.join(',');
      } else {
        obj.subStyles = this.applyNamespacing(obj.subStyles, forcedNamespace); //handle media queries as well
      }
    }

    return cssObjectArray;
  };

  /*
    given css string or object array, clears possible namespacing from
    all of the selectors inside the css
  */
  fi.prototype.clearNamespacing = function(css, returnObj) {
    if (returnObj === undefined) {
      returnObj = false;
    }
    var cssObjectArray = css;
    var namespaceClass = '.' + this.cssPreviewNamespace;
    if (typeof css === 'string') {
      cssObjectArray = this.parseCSS(css);
    }

    for (var i = 0; i < cssObjectArray.length; i++) {
      var obj = cssObjectArray[i];

      if (obj.type !== 'media') {
        var selector = obj.selector.split(',');
        var newSelector = [];
        for (var j = 0; j < selector.length; j++) {
          newSelector.push(selector[j].split(namespaceClass + ' ').join(''));
        }
        obj.selector = newSelector.join(',');
      } else {
        obj.subStyles = this.clearNamespacing(obj.subStyles, true); //handle media queries as well
      }
    }
    if (returnObj === false) {
      return this.getCSSForEditor(cssObjectArray);
    } else {
      return cssObjectArray;
    }

  };

  /*
    creates a new style tag (also destroys the previous one)
    and injects given css string into that css tag
  */
  fi.prototype.createStyleElement = function(id, css, format) {
    if (format === undefined) {
      format = false;
    }

    if (this.testMode === false && format !== 'nonamespace') {
      //apply namespacing classes
      css = this.applyNamespacing(css);
    }

    if (typeof css !== 'string') {
      css = this.getCSSForEditor(css);
    }
    //apply formatting for css
    if (format === true) {
      css = this.getCSSForEditor(this.parseCSS(css));
    }

    if (this.testMode !== false) {
      return this.testMode('create style #' + id, css); //if test mode, just pass result to callback
    }

    var __el = document.getElementById(id);
    if (__el) {
      __el.parentNode.removeChild(__el);
    }

    var head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

    style.id = id;
    style.type = 'text/css';

    head.appendChild(style);

    if (style.styleSheet && !style.sheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  };

  global.cssjs = fi;

})(this);;
// Spectrum Colorpicker v1.7.0
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT

(function (factory) {
    "use strict";

    if (typeof define === 'function' && define.amd) { // AMD
        define(['jquery'], factory);
    }
    else if (typeof exports == "object" && typeof module == "object") { // CommonJS
        module.exports = factory;
    }
    else { // Browser
        factory(jQuery);
    }
})(function($, undefined) {
    "use strict";

    var defaultOpts = {

        // Callbacks
        beforeShow: noop,
        move: noop,
        change: noop,
        show: noop,
        hide: noop,

        // Options
        color: false,
        flat: false,
        showInput: false,
        allowEmpty: false,
        showButtons: true,
        clickoutFiresChange: true,
        showInitial: false,
        showPalette: false,
        showPaletteOnly: false,
        hideAfterPaletteSelect: false,
        togglePaletteOnly: false,
        showSelectionPalette: true,
        localStorageKey: false,
        appendTo: "body",
        maxSelectionSize: 7,
        cancelText: "cancel",
        chooseText: "choose",
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        clearText: "Clear Color Selection",
        noColorSelectedText: "No Color Selected",
        preferredFormat: false,
        className: "", // Deprecated - use containerClassName and replacerClassName instead.
        containerClassName: "",
        replacerClassName: "",
        showAlpha: false,
        theme: "sp-light",
        palette: [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]],
        selectionPalette: [],
        disabled: false,
        offset: null
    },
    spectrums = [],
    IE = !!/msie/i.exec( window.navigator.userAgent ),
    rgbaSupport = (function() {
        function contains( str, substr ) {
            return !!~('' + str).indexOf(substr);
        }

        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background-color:rgba(0,0,0,.5)';
        return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
    })(),
    replaceInput = [
        "<div class='sp-replacer'>",
            "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
            "<div class='sp-dd'>&#9660;</div>",
        "</div>"
    ].join(''),
    markup = (function () {

        // IE does not support gradients with multiple stops, so we need to simulate
        //  that for the rainbow slider with 8 divs that each have a single gradient
        var gradientFix = "";
        if (IE) {
            for (var i = 1; i <= 6; i++) {
                gradientFix += "<div class='sp-" + i + "'></div>";
            }
        }

        return [
            "<div class='sp-container sp-hidden'>",
                "<div class='sp-palette-container'>",
                    "<div class='sp-palette sp-thumb sp-cf'></div>",
                    "<div class='sp-palette-button-container sp-cf'>",
                        "<button type='button' class='sp-palette-toggle'></button>",
                    "</div>",
                "</div>",
                "<div class='sp-picker-container'>",
                    "<div class='sp-top sp-cf'>",
                        "<div class='sp-fill'></div>",
                        "<div class='sp-top-inner'>",
                            "<div class='sp-color'>",
                                "<div class='sp-sat'>",
                                    "<div class='sp-val'>",
                                        "<div class='sp-dragger'></div>",
                                    "</div>",
                                "</div>",
                            "</div>",
                            "<div class='sp-clear sp-clear-display'>",
                            "</div>",
                            "<div class='sp-hue'>",
                                "<div class='sp-slider'></div>",
                                gradientFix,
                            "</div>",
                        "</div>",
                        "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
                    "</div>",
                    "<div class='sp-input-container sp-cf'>",
                        "<input class='sp-input' type='text' spellcheck='false'  />",
                    "</div>",
                    "<div class='sp-initial sp-thumb sp-cf'></div>",
                    "<div class='sp-button-container sp-cf'>",
                        "<a class='sp-cancel' href='#'></a>",
                        "<button type='button' class='sp-choose'></button>",
                    "</div>",
                "</div>",
            "</div>"
        ].join("");
    })();

    function paletteTemplate (p, color, className, opts) {
        var html = [];
        for (var i = 0; i < p.length; i++) {
            var current = p[i];
            if(current) {
                var tiny = tinycolor(current);
                var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
                c += (tinycolor.equals(color, current)) ? " sp-thumb-active" : "";
                var formattedString = tiny.toString(opts.preferredFormat || "rgb");
                var swatchStyle = rgbaSupport ? ("background-color:" + tiny.toRgbString()) : "filter:" + tiny.toFilter();
                html.push('<span title="' + formattedString + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
            } else {
                var cls = 'sp-clear-display';
                html.push($('<div />')
                    .append($('<span data-color="" style="background-color:transparent;" class="' + cls + '"></span>')
                        .attr('title', opts.noColorSelectedText)
                    )
                    .html()
                );
            }
        }
        return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
    }

    function hideAll() {
        for (var i = 0; i < spectrums.length; i++) {
            if (spectrums[i]) {
                spectrums[i].hide();
            }
        }
    }

    function instanceOptions(o, callbackContext) {
        var opts = $.extend({}, defaultOpts, o);
        opts.callbacks = {
            'move': bind(opts.move, callbackContext),
            'change': bind(opts.change, callbackContext),
            'show': bind(opts.show, callbackContext),
            'hide': bind(opts.hide, callbackContext),
            'beforeShow': bind(opts.beforeShow, callbackContext)
        };

        return opts;
    }

    function spectrum(element, o) {

        var opts = instanceOptions(o, element),
            flat = opts.flat,
            showSelectionPalette = opts.showSelectionPalette,
            localStorageKey = opts.localStorageKey,
            theme = opts.theme,
            callbacks = opts.callbacks,
            resize = throttle(reflow, 10),
            visible = false,
            isDragging = false,
            dragWidth = 0,
            dragHeight = 0,
            dragHelperHeight = 0,
            slideHeight = 0,
            slideWidth = 0,
            alphaWidth = 0,
            alphaSlideHelperWidth = 0,
            slideHelperHeight = 0,
            currentHue = 0,
            currentSaturation = 0,
            currentValue = 0,
            currentAlpha = 1,
            palette = [],
            paletteArray = [],
            paletteLookup = {},
            selectionPalette = opts.selectionPalette.slice(0),
            maxSelectionSize = opts.maxSelectionSize,
            draggingClass = "sp-dragging",
            shiftMovementDirection = null;

        var doc = element.ownerDocument,
            body = doc.body,
            boundElement = $(element),
            disabled = false,
            container = $(markup, doc).addClass(theme),
            pickerContainer = container.find(".sp-picker-container"),
            dragger = container.find(".sp-color"),
            dragHelper = container.find(".sp-dragger"),
            slider = container.find(".sp-hue"),
            slideHelper = container.find(".sp-slider"),
            alphaSliderInner = container.find(".sp-alpha-inner"),
            alphaSlider = container.find(".sp-alpha"),
            alphaSlideHelper = container.find(".sp-alpha-handle"),
            textInput = container.find(".sp-input"),
            paletteContainer = container.find(".sp-palette"),
            initialColorContainer = container.find(".sp-initial"),
            cancelButton = container.find(".sp-cancel"),
            clearButton = container.find(".sp-clear"),
            chooseButton = container.find(".sp-choose"),
            toggleButton = container.find(".sp-palette-toggle"),
            isInput = boundElement.is("input"),
            isInputTypeColor = isInput && boundElement.attr("type") === "color" && inputTypeColorSupport(),
            shouldReplace = isInput && !flat,
            replacer = (shouldReplace) ? $(replaceInput).addClass(theme).addClass(opts.className).addClass(opts.replacerClassName) : $([]),
            offsetElement = (shouldReplace) ? replacer : boundElement,
            previewElement = replacer.find(".sp-preview-inner"),
            initialColor = opts.color || (isInput && boundElement.val()),
            colorOnShow = false,
            preferredFormat = opts.preferredFormat,
            currentPreferredFormat = preferredFormat,
            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange,
            isEmpty = !initialColor,
            allowEmpty = opts.allowEmpty && !isInputTypeColor;

        function applyOptions() {

            if (opts.showPaletteOnly) {
                opts.showPalette = true;
            }

            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);

            if (opts.palette) {
                palette = opts.palette.slice(0);
                paletteArray = $.isArray(palette[0]) ? palette : [palette];
                paletteLookup = {};
                for (var i = 0; i < paletteArray.length; i++) {
                    for (var j = 0; j < paletteArray[i].length; j++) {
                        var rgb = tinycolor(paletteArray[i][j]).toRgbString();
                        paletteLookup[rgb] = true;
                    }
                }
            }

            container.toggleClass("sp-flat", flat);
            container.toggleClass("sp-input-disabled", !opts.showInput);
            container.toggleClass("sp-alpha-enabled", opts.showAlpha);
            container.toggleClass("sp-clear-enabled", allowEmpty);
            container.toggleClass("sp-buttons-disabled", !opts.showButtons);
            container.toggleClass("sp-palette-buttons-disabled", !opts.togglePaletteOnly);
            container.toggleClass("sp-palette-disabled", !opts.showPalette);
            container.toggleClass("sp-palette-only", opts.showPaletteOnly);
            container.toggleClass("sp-initial-disabled", !opts.showInitial);
            container.addClass(opts.className).addClass(opts.containerClassName);

            reflow();
        }

        function initialize() {

            if (IE) {
                container.find("*:not(input)").attr("unselectable", "on");
            }

            applyOptions();

            if (shouldReplace) {
                boundElement.after(replacer).hide();
            }

            if (!allowEmpty) {
                clearButton.hide();
            }

            if (flat) {
                boundElement.after(container).hide();
            }
            else {

                var appendTo = opts.appendTo === "parent" ? boundElement.parent() : $(opts.appendTo);
                if (appendTo.length !== 1) {
                    appendTo = $("body");
                }

                appendTo.append(container);
            }

            updateSelectionPaletteFromStorage();

            offsetElement.bind("click.spectrum touchstart.spectrum", function (e) {
                if (!disabled) {
                    toggle();
                }

                e.stopPropagation();

                if (!$(e.target).is("input")) {
                    e.preventDefault();
                }
            });

            if(boundElement.is(":disabled") || (opts.disabled === true)) {
                disable();
            }

            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
            container.click(stopPropagation);

            // Handle user typed input
            textInput.change(setFromTextInput);
            textInput.bind("paste", function () {
                setTimeout(setFromTextInput, 1);
            });
            textInput.keydown(function (e) { if (e.keyCode == 13) { setFromTextInput(); } });

            cancelButton.text(opts.cancelText);
            cancelButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                revert();
                hide();
            });

            clearButton.attr("title", opts.clearText);
            clearButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                isEmpty = true;
                move();

                if(flat) {
                    //for the flat style, this is a change event
                    updateOriginalInput(true);
                }
            });

            chooseButton.text(opts.chooseText);
            chooseButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (IE && textInput.is(":focus")) {
                    textInput.trigger('change');
                }

                if (isValid()) {
                    updateOriginalInput(true);
                    hide();
                }
            });

            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);
            toggleButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                opts.showPaletteOnly = !opts.showPaletteOnly;

                // To make sure the Picker area is drawn on the right, next to the
                // Palette area (and not below the palette), first move the Palette
                // to the left to make space for the picker, plus 5px extra.
                // The 'applyOptions' function puts the whole container back into place
                // and takes care of the button-text and the sp-palette-only CSS class.
                if (!opts.showPaletteOnly && !flat) {
                    container.css('left', '-=' + (pickerContainer.outerWidth(true) + 5));
                }
                applyOptions();
            });

            draggable(alphaSlider, function (dragX, dragY, e) {
                currentAlpha = (dragX / alphaWidth);
                isEmpty = false;
                if (e.shiftKey) {
                    currentAlpha = Math.round(currentAlpha * 10) / 10;
                }

                move();
            }, dragStart, dragStop);

            draggable(slider, function (dragX, dragY) {
                currentHue = parseFloat(dragY / slideHeight);
                isEmpty = false;
                if (!opts.showAlpha) {
                    currentAlpha = 1;
                }
                move();
            }, dragStart, dragStop);

            draggable(dragger, function (dragX, dragY, e) {

                // shift+drag should snap the movement to either the x or y axis.
                if (!e.shiftKey) {
                    shiftMovementDirection = null;
                }
                else if (!shiftMovementDirection) {
                    var oldDragX = currentSaturation * dragWidth;
                    var oldDragY = dragHeight - (currentValue * dragHeight);
                    var furtherFromX = Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);

                    shiftMovementDirection = furtherFromX ? "x" : "y";
                }

                var setSaturation = !shiftMovementDirection || shiftMovementDirection === "x";
                var setValue = !shiftMovementDirection || shiftMovementDirection === "y";

                if (setSaturation) {
                    currentSaturation = parseFloat(dragX / dragWidth);
                }
                if (setValue) {
                    currentValue = parseFloat((dragHeight - dragY) / dragHeight);
                }

                isEmpty = false;
                if (!opts.showAlpha) {
                    currentAlpha = 1;
                }

                move();

            }, dragStart, dragStop);

            if (!!initialColor) {
                set(initialColor);

                // In case color was black - update the preview UI and set the format
                // since the set function will not run (default color is black).
                updateUI();
                currentPreferredFormat = preferredFormat || tinycolor(initialColor).format;

                addColorToSelectionPalette(initialColor);
            }
            else {
                updateUI();
            }

            if (flat) {
                show();
            }

            function paletteElementClick(e) {
                if (e.data && e.data.ignore) {
                    set($(e.target).closest(".sp-thumb-el").data("color"));
                    move();
                }
                else {
                    set($(e.target).closest(".sp-thumb-el").data("color"));
                    move();
                    updateOriginalInput(true);
                    if (opts.hideAfterPaletteSelect) {
                      hide();
                    }
                }

                return false;
            }

            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            paletteContainer.delegate(".sp-thumb-el", paletteEvent, paletteElementClick);
            initialColorContainer.delegate(".sp-thumb-el:nth-child(1)", paletteEvent, { ignore: true }, paletteElementClick);
        }

        function updateSelectionPaletteFromStorage() {

            if (localStorageKey && window.localStorage) {

                // Migrate old palettes over to new format.  May want to remove this eventually.
                try {
                    var oldPalette = window.localStorage[localStorageKey].split(",#");
                    if (oldPalette.length > 1) {
                        delete window.localStorage[localStorageKey];
                        $.each(oldPalette, function(i, c) {
                             addColorToSelectionPalette(c);
                        });
                    }
                }
                catch(e) { }

                try {
                    selectionPalette = window.localStorage[localStorageKey].split(";");
                }
                catch (e) { }
            }
        }

        function addColorToSelectionPalette(color) {
            if (showSelectionPalette) {
                var rgb = tinycolor(color).toRgbString();
                if (!paletteLookup[rgb] && $.inArray(rgb, selectionPalette) === -1) {
                    selectionPalette.push(rgb);
                    while(selectionPalette.length > maxSelectionSize) {
                        selectionPalette.shift();
                    }
                }

                if (localStorageKey && window.localStorage) {
                    try {
                        window.localStorage[localStorageKey] = selectionPalette.join(";");
                    }
                    catch(e) { }
                }
            }
        }

        function getUniqueSelectionPalette() {
            var unique = [];
            if (opts.showPalette) {
                for (var i = 0; i < selectionPalette.length; i++) {
                    var rgb = tinycolor(selectionPalette[i]).toRgbString();

                    if (!paletteLookup[rgb]) {
                        unique.push(selectionPalette[i]);
                    }
                }
            }

            return unique.reverse().slice(0, opts.maxSelectionSize);
        }

        function drawPalette() {

            var currentColor = get();

            var html = $.map(paletteArray, function (palette, i) {
                return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i, opts);
            });

            updateSelectionPaletteFromStorage();

            if (selectionPalette) {
                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection", opts));
            }

            paletteContainer.html(html.join(""));
        }

        function drawInitial() {
            if (opts.showInitial) {
                var initial = colorOnShow;
                var current = get();
                initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial", opts));
            }
        }

        function dragStart() {
            if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
                reflow();
            }
            isDragging = true;
            container.addClass(draggingClass);
            shiftMovementDirection = null;
            boundElement.trigger('dragstart.spectrum', [ get() ]);
        }

        function dragStop() {
            isDragging = false;
            container.removeClass(draggingClass);
            boundElement.trigger('dragstop.spectrum', [ get() ]);
        }

        function setFromTextInput() {

            var value = textInput.val();

            if ((value === null || value === "") && allowEmpty) {
                set(null);
                updateOriginalInput(true);
            }
            else {
                var tiny = tinycolor(value);
                if (tiny.isValid()) {
                    set(tiny);
                    updateOriginalInput(true);
                }
                else {
                    textInput.addClass("sp-validation-error");
                }
            }
        }

        function toggle() {
            if (visible) {
                hide();
            }
            else {
                show();
            }
        }

        function show() {
            var event = $.Event('beforeShow.spectrum');

            if (visible) {
                reflow();
                return;
            }

            boundElement.trigger(event, [ get() ]);

            if (callbacks.beforeShow(get()) === false || event.isDefaultPrevented()) {
                return;
            }

            hideAll();
            visible = true;

            $(doc).bind("keydown.spectrum", onkeydown);
            $(doc).bind("click.spectrum", clickout);
            $(window).bind("resize.spectrum", resize);
            replacer.addClass("sp-active");
            container.removeClass("sp-hidden");

            reflow();
            updateUI();

            colorOnShow = get();

            drawInitial();
            callbacks.show(colorOnShow);
            boundElement.trigger('show.spectrum', [ colorOnShow ]);
        }

        function onkeydown(e) {
            // Close on ESC
            if (e.keyCode === 27) {
                hide();
            }
        }

        function clickout(e) {
            // Return on right click.
            if (e.button == 2) { return; }

            // If a drag event was happening during the mouseup, don't hide
            // on click.
            if (isDragging) { return; }

            if (clickoutFiresChange) {
                updateOriginalInput(true);
            }
            else {
                revert();
            }
            hide();
        }

        function hide() {
            // Return if hiding is unnecessary
            if (!visible || flat) { return; }
            visible = false;

            $(doc).unbind("keydown.spectrum", onkeydown);
            $(doc).unbind("click.spectrum", clickout);
            $(window).unbind("resize.spectrum", resize);

            replacer.removeClass("sp-active");
            container.addClass("sp-hidden");

            callbacks.hide(get());
            boundElement.trigger('hide.spectrum', [ get() ]);
        }

        function revert() {
            set(colorOnShow, true);
        }

        function set(color, ignoreFormatChange) {
            if (tinycolor.equals(color, get())) {
                // Update UI just in case a validation error needs
                // to be cleared.
                updateUI();
                return;
            }

            var newColor, newHsv;
            if (!color && allowEmpty) {
                isEmpty = true;
            } else {
                isEmpty = false;
                newColor = tinycolor(color);
                newHsv = newColor.toHsv();

                currentHue = (newHsv.h % 360) / 360;
                currentSaturation = newHsv.s;
                currentValue = newHsv.v;
                currentAlpha = newHsv.a;
            }
            updateUI();

            if (newColor && newColor.isValid() && !ignoreFormatChange) {
                currentPreferredFormat = preferredFormat || newColor.getFormat();
            }
        }

        function get(opts) {
            opts = opts || { };

            if (allowEmpty && isEmpty) {
                return null;
            }

            return tinycolor.fromRatio({
                h: currentHue,
                s: currentSaturation,
                v: currentValue,
                a: Math.round(currentAlpha * 100) / 100
            }, { format: opts.format || currentPreferredFormat });
        }

        function isValid() {
            return !textInput.hasClass("sp-validation-error");
        }

        function move() {
            updateUI();

            callbacks.move(get());
            boundElement.trigger('move.spectrum', [ get() ]);
        }

        function updateUI() {

            textInput.removeClass("sp-validation-error");

            updateHelperLocations();

            // Update dragger background color (gradients take care of saturation and value).
            var flatColor = tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
            dragger.css("background-color", flatColor.toHexString());

            // Get a format that alpha will be included in (hex and names ignore alpha)
            var format = currentPreferredFormat;
            if (currentAlpha < 1 && !(currentAlpha === 0 && format === "name")) {
                if (format === "hex" || format === "hex3" || format === "hex6" || format === "name") {
                    format = "rgb";
                }
            }

            var realColor = get({ format: format }),
                displayColor = '';

             //reset background info for preview element
            previewElement.removeClass("sp-clear-display");
            previewElement.css('background-color', 'transparent');

            if (!realColor && allowEmpty) {
                // Update the replaced elements background with icon indicating no color selection
                previewElement.addClass("sp-clear-display");
            }
            else {
                var realHex = realColor.toHexString(),
                    realRgb = realColor.toRgbString();

                // Update the replaced elements background color (with actual selected color)
                if (rgbaSupport || realColor.alpha === 1) {
                    previewElement.css("background-color", realRgb);
                }
                else {
                    previewElement.css("background-color", "transparent");
                    previewElement.css("filter", realColor.toFilter());
                }

                if (opts.showAlpha) {
                    var rgb = realColor.toRgb();
                    rgb.a = 0;
                    var realAlpha = tinycolor(rgb).toRgbString();
                    var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

                    if (IE) {
                        alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
                    }
                    else {
                        alphaSliderInner.css("background", "-webkit-" + gradient);
                        alphaSliderInner.css("background", "-moz-" + gradient);
                        alphaSliderInner.css("background", "-ms-" + gradient);
                        // Use current syntax gradient on unprefixed property.
                        alphaSliderInner.css("background",
                            "linear-gradient(to right, " + realAlpha + ", " + realHex + ")");
                    }
                }

                displayColor = realColor.toString(format);
            }

            // Update the text entry input as it changes happen
            if (opts.showInput) {
                textInput.val(displayColor);
            }

            if (opts.showPalette) {
                drawPalette();
            }

            drawInitial();
        }

        function updateHelperLocations() {
            var s = currentSaturation;
            var v = currentValue;

            if(allowEmpty && isEmpty) {
                //if selected color is empty, hide the helpers
                alphaSlideHelper.hide();
                slideHelper.hide();
                dragHelper.hide();
            }
            else {
                //make sure helpers are visible
                alphaSlideHelper.show();
                slideHelper.show();
                dragHelper.show();

                // Where to show the little circle in that displays your current selected color
                var dragX = s * dragWidth;
                var dragY = dragHeight - (v * dragHeight);
                dragX = Math.max(
                    -dragHelperHeight,
                    Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight)
                );
                dragY = Math.max(
                    -dragHelperHeight,
                    Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight)
                );
                dragHelper.css({
                    "top": dragY + "px",
                    "left": dragX + "px"
                });

                var alphaX = currentAlpha * alphaWidth;
                alphaSlideHelper.css({
                    "left": (alphaX - (alphaSlideHelperWidth / 2)) + "px"
                });

                // Where to show the bar that displays your current selected hue
                var slideY = (currentHue) * slideHeight;
                slideHelper.css({
                    "top": (slideY - slideHelperHeight) + "px"
                });
            }
        }

        function updateOriginalInput(fireCallback) {
            var color = get(),
                displayColor = '',
                hasChanged = !tinycolor.equals(color, colorOnShow);

            if (color) {
                displayColor = color.toString(currentPreferredFormat);
                // Update the selection palette with the current color
                addColorToSelectionPalette(color);
            }

            if (isInput) {
                boundElement.val(displayColor);
            }

            if (fireCallback && hasChanged) {
                callbacks.change(color);
                boundElement.trigger('change', [ color ]);
            }
        }

        function reflow() {
            dragWidth = dragger.width();
            dragHeight = dragger.height();
            dragHelperHeight = dragHelper.height();
            slideWidth = slider.width();
            slideHeight = slider.height();
            slideHelperHeight = slideHelper.height();
            alphaWidth = alphaSlider.width();
            alphaSlideHelperWidth = alphaSlideHelper.width();

            if (!flat) {
                container.css("position", "absolute");
                if (opts.offset) {
                    container.offset(opts.offset);
                } else {
                    container.offset(getOffset(container, offsetElement));
                }
            }

            updateHelperLocations();

            if (opts.showPalette) {
                drawPalette();
            }

            boundElement.trigger('reflow.spectrum');
        }

        function destroy() {
            boundElement.show();
            offsetElement.unbind("click.spectrum touchstart.spectrum");
            container.remove();
            replacer.remove();
            spectrums[spect.id] = null;
        }

        function option(optionName, optionValue) {
            if (optionName === undefined) {
                return $.extend({}, opts);
            }
            if (optionValue === undefined) {
                return opts[optionName];
            }

            opts[optionName] = optionValue;
            applyOptions();
        }

        function enable() {
            disabled = false;
            boundElement.attr("disabled", false);
            offsetElement.removeClass("sp-disabled");
        }

        function disable() {
            hide();
            disabled = true;
            boundElement.attr("disabled", true);
            offsetElement.addClass("sp-disabled");
        }

        function setOffset(coord) {
            opts.offset = coord;
            reflow();
        }

        initialize();

        var spect = {
            show: show,
            hide: hide,
            toggle: toggle,
            reflow: reflow,
            option: option,
            enable: enable,
            disable: disable,
            offset: setOffset,
            set: function (c) {
                set(c);
                updateOriginalInput();
            },
            get: get,
            destroy: destroy,
            container: container
        };

        spect.id = spectrums.push(spect) - 1;

        return spect;
    }

    /**
    * checkOffset - get the offset below/above and left/right element depending on screen position
    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
    */
    function getOffset(picker, input) {
        var extraY = 0;
        var dpWidth = picker.outerWidth();
        var dpHeight = picker.outerHeight();
        var inputHeight = input.outerHeight();
        var doc = picker[0].ownerDocument;
        var docElem = doc.documentElement;
        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
        var offset = input.offset();
        offset.top += inputHeight;

        offset.left -=
            Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offset.left + dpWidth - viewWidth) : 0);

        offset.top -=
            Math.min(offset.top, ((offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
            Math.abs(dpHeight + inputHeight - extraY) : extraY));

        return offset;
    }

    /**
    * noop - do nothing
    */
    function noop() {

    }

    /**
    * stopPropagation - makes the code only doing this a little easier to read in line
    */
    function stopPropagation(e) {
        e.stopPropagation();
    }

    /**
    * Create a function bound to a given object
    * Thanks to underscore.js
    */
    function bind(func, obj) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 2);
        return function () {
            return func.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    /**
    * Lightweight drag helper.  Handles containment within the element, so that
    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
    */
    function draggable(element, onmove, onstart, onstop) {
        onmove = onmove || function () { };
        onstart = onstart || function () { };
        onstop = onstop || function () { };
        var doc = document;
        var dragging = false;
        var offset = {};
        var maxHeight = 0;
        var maxWidth = 0;
        var hasTouch = ('ontouchstart' in window);

        var duringDragEvents = {};
        duringDragEvents["selectstart"] = prevent;
        duringDragEvents["dragstart"] = prevent;
        duringDragEvents["touchmove mousemove"] = move;
        duringDragEvents["touchend mouseup"] = stop;

        function prevent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        function move(e) {
            if (dragging) {
                // Mouseup happened outside of window
                if (IE && doc.documentMode < 9 && !e.button) {
                    return stop();
                }

                var t0 = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
                var pageX = t0 && t0.pageX || e.pageX;
                var pageY = t0 && t0.pageY || e.pageY;

                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

                if (hasTouch) {
                    // Stop scrolling in iOS
                    prevent(e);
                }

                onmove.apply(element, [dragX, dragY, e]);
            }
        }

        function start(e) {
            var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);

            if (!rightclick && !dragging) {
                if (onstart.apply(element, arguments) !== false) {
                    dragging = true;
                    maxHeight = $(element).height();
                    maxWidth = $(element).width();
                    offset = $(element).offset();

                    $(doc).bind(duringDragEvents);
                    $(doc.body).addClass("sp-dragging");

                    move(e);

                    prevent(e);
                }
            }
        }

        function stop() {
            if (dragging) {
                $(doc).unbind(duringDragEvents);
                $(doc.body).removeClass("sp-dragging");

                // Wait a tick before notifying observers to allow the click event
                // to fire in Chrome.
                setTimeout(function() {
                    onstop.apply(element, arguments);
                }, 0);
            }
            dragging = false;
        }

        $(element).bind("touchstart mousedown", start);
    }

    function throttle(func, wait, debounce) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var throttler = function () {
                timeout = null;
                func.apply(context, args);
            };
            if (debounce) clearTimeout(timeout);
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    }

    function inputTypeColorSupport() {
        return $.fn.spectrum.inputTypeColorSupport();
    }

    /**
    * Define a jQuery plugin
    */
    var dataID = "spectrum.id";
    $.fn.spectrum = function (opts, extra) {

        if (typeof opts == "string") {

            var returnValue = this;
            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function () {
                var spect = spectrums[$(this).data(dataID)];
                if (spect) {
                    var method = spect[opts];
                    if (!method) {
                        throw new Error( "Spectrum: no such method: '" + opts + "'" );
                    }

                    if (opts == "get") {
                        returnValue = spect.get();
                    }
                    else if (opts == "container") {
                        returnValue = spect.container;
                    }
                    else if (opts == "option") {
                        returnValue = spect.option.apply(spect, args);
                    }
                    else if (opts == "destroy") {
                        spect.destroy();
                        $(this).removeData(dataID);
                    }
                    else {
                        method.apply(spect, args);
                    }
                }
            });

            return returnValue;
        }

        // Initializing a new instance of spectrum
        return this.spectrum("destroy").each(function () {
            var options = $.extend({}, opts, $(this).data());
            var spect = spectrum(this, options);
            $(this).data(dataID, spect.id);
        });
    };

    $.fn.spectrum.load = true;
    $.fn.spectrum.loadOpts = {};
    $.fn.spectrum.draggable = draggable;
    $.fn.spectrum.defaults = defaultOpts;
    $.fn.spectrum.inputTypeColorSupport = function inputTypeColorSupport() {
        if (typeof inputTypeColorSupport._cachedResult === "undefined") {
            var colorInput = $("<input type='color' value='!' />")[0];
            inputTypeColorSupport._cachedResult = colorInput.type === "color" && colorInput.value !== "!";
        }
        return inputTypeColorSupport._cachedResult;
    };

    $.spectrum = { };
    $.spectrum.localization = { };
    $.spectrum.palettes = { };

    $.fn.spectrum.processNativeColorInputs = function () {
        var colorInputs = $("input[type=color]");
        if (colorInputs.length && !inputTypeColorSupport()) {
            colorInputs.spectrum({
                preferredFormat: "hex6"
            });
        }
    };

    // TinyColor v1.1.2
    // https://github.com/bgrins/TinyColor
    // Brian Grinstead, MIT License

    (function() {

    var trimLeft = /^[\s,#]+/,
        trimRight = /\s+$/,
        tinyCounter = 0,
        math = Math,
        mathRound = math.round,
        mathMin = math.min,
        mathMax = math.max,
        mathRandom = math.random;

    var tinycolor = function(color, opts) {

        color = (color) ? color : '';
        opts = opts || { };

        // If input is already a tinycolor, return itself
        if (color instanceof tinycolor) {
           return color;
        }
        // If we are called as a function, call using new instead
        if (!(this instanceof tinycolor)) {
            return new tinycolor(color, opts);
        }

        var rgb = inputToRGB(color);
        this._originalInput = color,
        this._r = rgb.r,
        this._g = rgb.g,
        this._b = rgb.b,
        this._a = rgb.a,
        this._roundA = mathRound(100*this._a) / 100,
        this._format = opts.format || rgb.format;
        this._gradientType = opts.gradientType;

        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (this._r < 1) { this._r = mathRound(this._r); }
        if (this._g < 1) { this._g = mathRound(this._g); }
        if (this._b < 1) { this._b = mathRound(this._b); }

        this._ok = rgb.ok;
        this._tc_id = tinyCounter++;
    };

    tinycolor.prototype = {
        isDark: function() {
            return this.getBrightness() < 128;
        },
        isLight: function() {
            return !this.isDark();
        },
        isValid: function() {
            return this._ok;
        },
        getOriginalInput: function() {
          return this._originalInput;
        },
        getFormat: function() {
            return this._format;
        },
        getAlpha: function() {
            return this._a;
        },
        getBrightness: function() {
            var rgb = this.toRgb();
            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        },
        setAlpha: function(value) {
            this._a = boundAlpha(value);
            this._roundA = mathRound(100*this._a) / 100;
            return this;
        },
        toHsv: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
        },
        toHsvString: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
            return (this._a == 1) ?
              "hsv("  + h + ", " + s + "%, " + v + "%)" :
              "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
        },
        toHsl: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
        },
        toHslString: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
            return (this._a == 1) ?
              "hsl("  + h + ", " + s + "%, " + l + "%)" :
              "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
        },
        toHex: function(allow3Char) {
            return rgbToHex(this._r, this._g, this._b, allow3Char);
        },
        toHexString: function(allow3Char) {
            return '#' + this.toHex(allow3Char);
        },
        toHex8: function() {
            return rgbaToHex(this._r, this._g, this._b, this._a);
        },
        toHex8String: function() {
            return '#' + this.toHex8();
        },
        toRgb: function() {
            return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
        },
        toRgbString: function() {
            return (this._a == 1) ?
              "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
              "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
        },
        toPercentageRgb: function() {
            return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
        },
        toPercentageRgbString: function() {
            return (this._a == 1) ?
              "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
              "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
        },
        toName: function() {
            if (this._a === 0) {
                return "transparent";
            }

            if (this._a < 1) {
                return false;
            }

            return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
        },
        toFilter: function(secondColor) {
            var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
            var secondHex8String = hex8String;
            var gradientType = this._gradientType ? "GradientType = 1, " : "";

            if (secondColor) {
                var s = tinycolor(secondColor);
                secondHex8String = s.toHex8String();
            }

            return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
        },
        toString: function(format) {
            var formatSet = !!format;
            format = format || this._format;

            var formattedString = false;
            var hasAlpha = this._a < 1 && this._a >= 0;
            var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");

            if (needsAlphaFormat) {
                // Special case for "transparent", all other non-alpha formats
                // will return rgba when there is transparency.
                if (format === "name" && this._a === 0) {
                    return this.toName();
                }
                return this.toRgbString();
            }
            if (format === "rgb") {
                formattedString = this.toRgbString();
            }
            if (format === "prgb") {
                formattedString = this.toPercentageRgbString();
            }
            if (format === "hex" || format === "hex6") {
                formattedString = this.toHexString();
            }
            if (format === "hex3") {
                formattedString = this.toHexString(true);
            }
            if (format === "hex8") {
                formattedString = this.toHex8String();
            }
            if (format === "name") {
                formattedString = this.toName();
            }
            if (format === "hsl") {
                formattedString = this.toHslString();
            }
            if (format === "hsv") {
                formattedString = this.toHsvString();
            }

            return formattedString || this.toHexString();
        },

        _applyModification: function(fn, args) {
            var color = fn.apply(null, [this].concat([].slice.call(args)));
            this._r = color._r;
            this._g = color._g;
            this._b = color._b;
            this.setAlpha(color._a);
            return this;
        },
        lighten: function() {
            return this._applyModification(lighten, arguments);
        },
        brighten: function() {
            return this._applyModification(brighten, arguments);
        },
        darken: function() {
            return this._applyModification(darken, arguments);
        },
        desaturate: function() {
            return this._applyModification(desaturate, arguments);
        },
        saturate: function() {
            return this._applyModification(saturate, arguments);
        },
        greyscale: function() {
            return this._applyModification(greyscale, arguments);
        },
        spin: function() {
            return this._applyModification(spin, arguments);
        },

        _applyCombination: function(fn, args) {
            return fn.apply(null, [this].concat([].slice.call(args)));
        },
        analogous: function() {
            return this._applyCombination(analogous, arguments);
        },
        complement: function() {
            return this._applyCombination(complement, arguments);
        },
        monochromatic: function() {
            return this._applyCombination(monochromatic, arguments);
        },
        splitcomplement: function() {
            return this._applyCombination(splitcomplement, arguments);
        },
        triad: function() {
            return this._applyCombination(triad, arguments);
        },
        tetrad: function() {
            return this._applyCombination(tetrad, arguments);
        }
    };

    // If input is an object, force 1 into "1.0" to handle ratios properly
    // String input requires "1.0" as input, so 1 will be treated as 1
    tinycolor.fromRatio = function(color, opts) {
        if (typeof color == "object") {
            var newColor = {};
            for (var i in color) {
                if (color.hasOwnProperty(i)) {
                    if (i === "a") {
                        newColor[i] = color[i];
                    }
                    else {
                        newColor[i] = convertToPercentage(color[i]);
                    }
                }
            }
            color = newColor;
        }

        return tinycolor(color, opts);
    };

    // Given a string or object, convert that input to RGB
    // Possible string inputs:
    //
    //     "red"
    //     "#f00" or "f00"
    //     "#ff0000" or "ff0000"
    //     "#ff000000" or "ff000000"
    //     "rgb 255 0 0" or "rgb (255, 0, 0)"
    //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
    //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
    //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
    //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
    //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
    //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
    //
    function inputToRGB(color) {

        var rgb = { r: 0, g: 0, b: 0 };
        var a = 1;
        var ok = false;
        var format = false;

        if (typeof color == "string") {
            color = stringInputToObject(color);
        }

        if (typeof color == "object") {
            if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
                rgb = rgbToRgb(color.r, color.g, color.b);
                ok = true;
                format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
            }
            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
                color.s = convertToPercentage(color.s);
                color.v = convertToPercentage(color.v);
                rgb = hsvToRgb(color.h, color.s, color.v);
                ok = true;
                format = "hsv";
            }
            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
                color.s = convertToPercentage(color.s);
                color.l = convertToPercentage(color.l);
                rgb = hslToRgb(color.h, color.s, color.l);
                ok = true;
                format = "hsl";
            }

            if (color.hasOwnProperty("a")) {
                a = color.a;
            }
        }

        a = boundAlpha(a);

        return {
            ok: ok,
            format: color.format || format,
            r: mathMin(255, mathMax(rgb.r, 0)),
            g: mathMin(255, mathMax(rgb.g, 0)),
            b: mathMin(255, mathMax(rgb.b, 0)),
            a: a
        };
    }


    // Conversion Functions
    // --------------------

    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

    // `rgbToRgb`
    // Handle bounds / percentage checking to conform to CSS color spec
    // <http://www.w3.org/TR/css3-color/>
    // *Assumes:* r, g, b in [0, 255] or [0, 1]
    // *Returns:* { r, g, b } in [0, 255]
    function rgbToRgb(r, g, b){
        return {
            r: bound01(r, 255) * 255,
            g: bound01(g, 255) * 255,
            b: bound01(b, 255) * 255
        };
    }

    // `rgbToHsl`
    // Converts an RGB color value to HSL.
    // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
    // *Returns:* { h, s, l } in [0,1]
    function rgbToHsl(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min) {
            h = s = 0; // achromatic
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return { h: h, s: s, l: l };
    }

    // `hslToRgb`
    // Converts an HSL color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hslToRgb(h, s, l) {
        var r, g, b;

        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);

        function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        if(s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHsv`
    // Converts an RGB color value to HSV
    // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
    // *Returns:* { h, s, v } in [0,1]
    function rgbToHsv(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max === 0 ? 0 : d / max;

        if(max == min) {
            h = 0; // achromatic
        }
        else {
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h, s: s, v: v };
    }

    // `hsvToRgb`
    // Converts an HSV color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
     function hsvToRgb(h, s, v) {

        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);

        var i = math.floor(h),
            f = h - i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s),
            mod = i % 6,
            r = [v, q, p, p, t, v][mod],
            g = [t, v, v, q, p, p][mod],
            b = [p, p, t, v, v, q][mod];

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHex`
    // Converts an RGB color to hex
    // Assumes r, g, and b are contained in the set [0, 255]
    // Returns a 3 or 6 character hex
    function rgbToHex(r, g, b, allow3Char) {

        var hex = [
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];

        // Return a 3 character hex if possible
        if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }

        return hex.join("");
    }
        // `rgbaToHex`
        // Converts an RGBA color plus alpha transparency to hex
        // Assumes r, g, b and a are contained in the set [0, 255]
        // Returns an 8 character hex
        function rgbaToHex(r, g, b, a) {

            var hex = [
                pad2(convertDecimalToHex(a)),
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];

            return hex.join("");
        }

    // `equals`
    // Can be called with any tinycolor input
    tinycolor.equals = function (color1, color2) {
        if (!color1 || !color2) { return false; }
        return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
    };
    tinycolor.random = function() {
        return tinycolor.fromRatio({
            r: mathRandom(),
            g: mathRandom(),
            b: mathRandom()
        });
    };


    // Modification Functions
    // ----------------------
    // Thanks to less.js for some of the basics here
    // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

    function desaturate(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }

    function saturate(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }

    function greyscale(color) {
        return tinycolor(color).desaturate(100);
    }

    function lighten (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }

    function brighten(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var rgb = tinycolor(color).toRgb();
        rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
        rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
        rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
        return tinycolor(rgb);
    }

    function darken (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }

    // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
    // Values outside of this range will be wrapped into this range.
    function spin(color, amount) {
        var hsl = tinycolor(color).toHsl();
        var hue = (mathRound(hsl.h) + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return tinycolor(hsl);
    }

    // Combination Functions
    // ---------------------
    // Thanks to jQuery xColor for some of the ideas behind these
    // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

    function complement(color) {
        var hsl = tinycolor(color).toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return tinycolor(hsl);
    }

    function triad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
        ];
    }

    function tetrad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
        ];
    }

    function splitcomplement(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
            tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
        ];
    }

    function analogous(color, results, slices) {
        results = results || 6;
        slices = slices || 30;

        var hsl = tinycolor(color).toHsl();
        var part = 360 / slices;
        var ret = [tinycolor(color)];

        for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(tinycolor(hsl));
        }
        return ret;
    }

    function monochromatic(color, results) {
        results = results || 6;
        var hsv = tinycolor(color).toHsv();
        var h = hsv.h, s = hsv.s, v = hsv.v;
        var ret = [];
        var modification = 1 / results;

        while (results--) {
            ret.push(tinycolor({ h: h, s: s, v: v}));
            v = (v + modification) % 1;
        }

        return ret;
    }

    // Utility Functions
    // ---------------------

    tinycolor.mix = function(color1, color2, amount) {
        amount = (amount === 0) ? 0 : (amount || 50);

        var rgb1 = tinycolor(color1).toRgb();
        var rgb2 = tinycolor(color2).toRgb();

        var p = amount / 100;
        var w = p * 2 - 1;
        var a = rgb2.a - rgb1.a;

        var w1;

        if (w * a == -1) {
            w1 = w;
        } else {
            w1 = (w + a) / (1 + w * a);
        }

        w1 = (w1 + 1) / 2;

        var w2 = 1 - w1;

        var rgba = {
            r: rgb2.r * w1 + rgb1.r * w2,
            g: rgb2.g * w1 + rgb1.g * w2,
            b: rgb2.b * w1 + rgb1.b * w2,
            a: rgb2.a * p  + rgb1.a * (1 - p)
        };

        return tinycolor(rgba);
    };


    // Readability Functions
    // ---------------------
    // <http://www.w3.org/TR/AERT#color-contrast>

    // `readability`
    // Analyze the 2 colors and returns an object with the following properties:
    //    `brightness`: difference in brightness between the two colors
    //    `color`: difference in color/hue between the two colors
    tinycolor.readability = function(color1, color2) {
        var c1 = tinycolor(color1);
        var c2 = tinycolor(color2);
        var rgb1 = c1.toRgb();
        var rgb2 = c2.toRgb();
        var brightnessA = c1.getBrightness();
        var brightnessB = c2.getBrightness();
        var colorDiff = (
            Math.max(rgb1.r, rgb2.r) - Math.min(rgb1.r, rgb2.r) +
            Math.max(rgb1.g, rgb2.g) - Math.min(rgb1.g, rgb2.g) +
            Math.max(rgb1.b, rgb2.b) - Math.min(rgb1.b, rgb2.b)
        );

        return {
            brightness: Math.abs(brightnessA - brightnessB),
            color: colorDiff
        };
    };

    // `readable`
    // http://www.w3.org/TR/AERT#color-contrast
    // Ensure that foreground and background color combinations provide sufficient contrast.
    // *Example*
    //    tinycolor.isReadable("#000", "#111") => false
    tinycolor.isReadable = function(color1, color2) {
        var readability = tinycolor.readability(color1, color2);
        return readability.brightness > 125 && readability.color > 500;
    };

    // `mostReadable`
    // Given a base color and a list of possible foreground or background
    // colors for that base, returns the most readable color.
    // *Example*
    //    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
    tinycolor.mostReadable = function(baseColor, colorList) {
        var bestColor = null;
        var bestScore = 0;
        var bestIsReadable = false;
        for (var i=0; i < colorList.length; i++) {

            // We normalize both around the "acceptable" breaking point,
            // but rank brightness constrast higher than hue.

            var readability = tinycolor.readability(baseColor, colorList[i]);
            var readable = readability.brightness > 125 && readability.color > 500;
            var score = 3 * (readability.brightness / 125) + (readability.color / 500);

            if ((readable && ! bestIsReadable) ||
                (readable && bestIsReadable && score > bestScore) ||
                ((! readable) && (! bestIsReadable) && score > bestScore)) {
                bestIsReadable = readable;
                bestScore = score;
                bestColor = tinycolor(colorList[i]);
            }
        }
        return bestColor;
    };


    // Big List of Colors
    // ------------------
    // <http://www.w3.org/TR/css3-color/#svg-color>
    var names = tinycolor.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    };

    // Make it easy to access colors via `hexNames[hex]`
    var hexNames = tinycolor.hexNames = flip(names);


    // Utilities
    // ---------

    // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
    function flip(o) {
        var flipped = { };
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                flipped[o[i]] = i;
            }
        }
        return flipped;
    }

    // Return a valid alpha value [0,1] with all invalid values being set to 1
    function boundAlpha(a) {
        a = parseFloat(a);

        if (isNaN(a) || a < 0 || a > 1) {
            a = 1;
        }

        return a;
    }

    // Take input from [0, n] and return it as [0, 1]
    function bound01(n, max) {
        if (isOnePointZero(n)) { n = "100%"; }

        var processPercent = isPercentage(n);
        n = mathMin(max, mathMax(0, parseFloat(n)));

        // Automatically convert percentage into number
        if (processPercent) {
            n = parseInt(n * max, 10) / 100;
        }

        // Handle floating point rounding errors
        if ((math.abs(n - max) < 0.000001)) {
            return 1;
        }

        // Convert into [0, 1] range if it isn't already
        return (n % max) / parseFloat(max);
    }

    // Force a number between 0 and 1
    function clamp01(val) {
        return mathMin(1, mathMax(0, val));
    }

    // Parse a base-16 hex value into a base-10 integer
    function parseIntFromHex(val) {
        return parseInt(val, 16);
    }

    // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
    // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
    function isOnePointZero(n) {
        return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
    }

    // Check to see if string passed in is a percentage
    function isPercentage(n) {
        return typeof n === "string" && n.indexOf('%') != -1;
    }

    // Force a hex value to have 2 characters
    function pad2(c) {
        return c.length == 1 ? '0' + c : '' + c;
    }

    // Replace a decimal with it's percentage value
    function convertToPercentage(n) {
        if (n <= 1) {
            n = (n * 100) + "%";
        }

        return n;
    }

    // Converts a decimal to a hex value
    function convertDecimalToHex(d) {
        return Math.round(parseFloat(d) * 255).toString(16);
    }
    // Converts a hex value to a decimal
    function convertHexToDecimal(h) {
        return (parseIntFromHex(h) / 255);
    }

    var matchers = (function() {

        // <http://www.w3.org/TR/css3-values/#integers>
        var CSS_INTEGER = "[-\\+]?\\d+%?";

        // <http://www.w3.org/TR/css3-values/#number-value>
        var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

        // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
        var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

        // Actual matching.
        // Parentheses and commas are optional, but not required.
        // Whitespace can take the place of commas or opening paren
        var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

        return {
            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
            hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
            hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    })();

    // `stringInputToObject`
    // Permissive string parsing.  Take in a number of formats, and output an object
    // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
    function stringInputToObject(color) {

        color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
        var named = false;
        if (names[color]) {
            color = names[color];
            named = true;
        }
        else if (color == 'transparent') {
            return { r: 0, g: 0, b: 0, a: 0, format: "name" };
        }

        // Try to match string input using regular expressions.
        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
        // Just return an object and let the conversion functions handle that.
        // This way the result will be the same whether the tinycolor is initialized with string or object.
        var match;
        if ((match = matchers.rgb.exec(color))) {
            return { r: match[1], g: match[2], b: match[3] };
        }
        if ((match = matchers.rgba.exec(color))) {
            return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        if ((match = matchers.hsl.exec(color))) {
            return { h: match[1], s: match[2], l: match[3] };
        }
        if ((match = matchers.hsla.exec(color))) {
            return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        if ((match = matchers.hsv.exec(color))) {
            return { h: match[1], s: match[2], v: match[3] };
        }
        if ((match = matchers.hsva.exec(color))) {
            return { h: match[1], s: match[2], v: match[3], a: match[4] };
        }
        if ((match = matchers.hex8.exec(color))) {
            return {
                a: convertHexToDecimal(match[1]),
                r: parseIntFromHex(match[2]),
                g: parseIntFromHex(match[3]),
                b: parseIntFromHex(match[4]),
                format: named ? "name" : "hex8"
            };
        }
        if ((match = matchers.hex6.exec(color))) {
            return {
                r: parseIntFromHex(match[1]),
                g: parseIntFromHex(match[2]),
                b: parseIntFromHex(match[3]),
                format: named ? "name" : "hex"
            };
        }
        if ((match = matchers.hex3.exec(color))) {
            return {
                r: parseIntFromHex(match[1] + '' + match[1]),
                g: parseIntFromHex(match[2] + '' + match[2]),
                b: parseIntFromHex(match[3] + '' + match[3]),
                format: named ? "name" : "hex"
            };
        }

        return false;
    }

    window.tinycolor = tinycolor;
    })();

    $(function () {
        if ($.fn.spectrum.load) {
            $.fn.spectrum.processNativeColorInputs();
        }
    });

});
;
/*
  html2canvas 0.5.0-alpha2 <http://html2canvas.hertzen.com>
  Copyright (c) 2015 Niklas von Hertzen

  Released under MIT License
*/
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.html2canvas=e()}}(function(){var e;return function n(e,f,o){function d(t,l){if(!f[t]){if(!e[t]){var s="function"==typeof require&&require;if(!l&&s)return s(t,!0);if(i)return i(t,!0);var u=new Error("Cannot find module '"+t+"'");throw u.code="MODULE_NOT_FOUND",u}var a=f[t]={exports:{}};e[t][0].call(a.exports,function(n){var f=e[t][1][n];return d(f?f:n)},a,a.exports,n,e,f,o)}return f[t].exports}for(var i="function"==typeof require&&require,t=0;t<o.length;t++)d(o[t]);return d}({1:[function(n,f){(function(n,o){(function(){"use strict";function d(e){return"function"==typeof e||"object"==typeof e&&null!==e}function i(e){return"function"==typeof e}function t(e){return"object"==typeof e&&null!==e}function l(){}function s(){return function(){n.nextTick(c)}}function u(){var e=0,n=new P(c),f=document.createTextNode("");return n.observe(f,{characterData:!0}),function(){f.data=e=++e%2}}function a(){var e=new MessageChannel;return e.port1.onmessage=c,function(){e.port2.postMessage(0)}}function p(){return function(){setTimeout(c,1)}}function c(){for(var e=0;M>e;e+=2){var n=R[e],f=R[e+1];n(f),R[e]=void 0,R[e+1]=void 0}M=0}function y(){}function m(){return new TypeError("You cannot resolve a promise with itself")}function r(){return new TypeError("A promises callback cannot return that same promise.")}function v(e){try{return e.then}catch(n){return V.error=n,V}}function w(e,n,f,o){try{e.call(n,f,o)}catch(d){return d}}function b(e,n,f){N(function(e){var o=!1,d=w(f,n,function(f){o||(o=!0,n!==f?x(e,f):k(e,f))},function(n){o||(o=!0,q(e,n))},"Settle: "+(e._label||" unknown promise"));!o&&d&&(o=!0,q(e,d))},e)}function g(e,n){n._state===T?k(e,n._result):e._state===U?q(e,n._result):z(n,void 0,function(n){x(e,n)},function(n){q(e,n)})}function h(e,n){if(n.constructor===e.constructor)g(e,n);else{var f=v(n);f===V?q(e,V.error):void 0===f?k(e,n):i(f)?b(e,n,f):k(e,n)}}function x(e,n){e===n?q(e,m()):d(n)?h(e,n):k(e,n)}function j(e){e._onerror&&e._onerror(e._result),A(e)}function k(e,n){e._state===S&&(e._result=n,e._state=T,0===e._subscribers.length||N(A,e))}function q(e,n){e._state===S&&(e._state=U,e._result=n,N(j,e))}function z(e,n,f,o){var d=e._subscribers,i=d.length;e._onerror=null,d[i]=n,d[i+T]=f,d[i+U]=o,0===i&&e._state&&N(A,e)}function A(e){var n=e._subscribers,f=e._state;if(0!==n.length){for(var o,d,i=e._result,t=0;t<n.length;t+=3)o=n[t],d=n[t+f],o?D(f,o,d,i):d(i);e._subscribers.length=0}}function B(){this.error=null}function C(e,n){try{return e(n)}catch(f){return W.error=f,W}}function D(e,n,f,o){var d,t,l,s,u=i(f);if(u){if(d=C(f,o),d===W?(s=!0,t=d.error,d=null):l=!0,n===d)return void q(n,r())}else d=o,l=!0;n._state!==S||(u&&l?x(n,d):s?q(n,t):e===T?k(n,d):e===U&&q(n,d))}function E(e,n){try{n(function(n){x(e,n)},function(n){q(e,n)})}catch(f){q(e,f)}}function F(e,n,f,o){this._instanceConstructor=e,this.promise=new e(y,o),this._abortOnReject=f,this._validateInput(n)?(this._input=n,this.length=n.length,this._remaining=n.length,this._init(),0===this.length?k(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&k(this.promise,this._result))):q(this.promise,this._validationError())}function G(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function H(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function I(e){this._id=en++,this._state=void 0,this._result=void 0,this._subscribers=[],y!==e&&(i(e)||G(),this instanceof I||H(),E(this,e))}var J;J=Array.isArray?Array.isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)};var K,L=J,M=(Date.now||function(){return(new Date).getTime()},Object.create||function(e){if(arguments.length>1)throw new Error("Second argument not supported");if("object"!=typeof e)throw new TypeError("Argument must be an object");return l.prototype=e,new l},0),N=function(e,n){R[M]=e,R[M+1]=n,M+=2,2===M&&K()},O="undefined"!=typeof window?window:{},P=O.MutationObserver||O.WebKitMutationObserver,Q="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,R=new Array(1e3);K="undefined"!=typeof n&&"[object process]"==={}.toString.call(n)?s():P?u():Q?a():p();var S=void 0,T=1,U=2,V=new B,W=new B;F.prototype._validateInput=function(e){return L(e)},F.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")},F.prototype._init=function(){this._result=new Array(this.length)};var X=F;F.prototype._enumerate=function(){for(var e=this.length,n=this.promise,f=this._input,o=0;n._state===S&&e>o;o++)this._eachEntry(f[o],o)},F.prototype._eachEntry=function(e,n){var f=this._instanceConstructor;t(e)?e.constructor===f&&e._state!==S?(e._onerror=null,this._settledAt(e._state,n,e._result)):this._willSettleAt(f.resolve(e),n):(this._remaining--,this._result[n]=this._makeResult(T,n,e))},F.prototype._settledAt=function(e,n,f){var o=this.promise;o._state===S&&(this._remaining--,this._abortOnReject&&e===U?q(o,f):this._result[n]=this._makeResult(e,n,f)),0===this._remaining&&k(o,this._result)},F.prototype._makeResult=function(e,n,f){return f},F.prototype._willSettleAt=function(e,n){var f=this;z(e,void 0,function(e){f._settledAt(T,n,e)},function(e){f._settledAt(U,n,e)})};var Y=function(e,n){return new X(this,e,!0,n).promise},Z=function(e,n){function f(e){x(i,e)}function o(e){q(i,e)}var d=this,i=new d(y,n);if(!L(e))return q(i,new TypeError("You must pass an array to race.")),i;for(var t=e.length,l=0;i._state===S&&t>l;l++)z(d.resolve(e[l]),void 0,f,o);return i},$=function(e,n){var f=this;if(e&&"object"==typeof e&&e.constructor===f)return e;var o=new f(y,n);return x(o,e),o},_=function(e,n){var f=this,o=new f(y,n);return q(o,e),o},en=0,nn=I;I.all=Y,I.race=Z,I.resolve=$,I.reject=_,I.prototype={constructor:I,then:function(e,n){var f=this,o=f._state;if(o===T&&!e||o===U&&!n)return this;var d=new this.constructor(y),i=f._result;if(o){var t=arguments[o-1];N(function(){D(o,d,t,i)})}else z(f,d,e,n);return d},"catch":function(e){return this.then(null,e)}};var fn=function(){var e;e="undefined"!=typeof o?o:"undefined"!=typeof window&&window.document?window:self;var n="Promise"in e&&"resolve"in e.Promise&&"reject"in e.Promise&&"all"in e.Promise&&"race"in e.Promise&&function(){var n;return new e.Promise(function(e){n=e}),i(n)}();n||(e.Promise=nn)},on={Promise:nn,polyfill:fn};"function"==typeof e&&e.amd?e(function(){return on}):"undefined"!=typeof f&&f.exports?f.exports=on:"undefined"!=typeof this&&(this.ES6Promise=on)}).call(this)}).call(this,n("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{_process:2}],2:[function(e,n){function f(){if(!t){t=!0;for(var e,n=i.length;n;){e=i,i=[];for(var f=-1;++f<n;)e[f]();n=i.length}t=!1}}function o(){}var d=n.exports={},i=[],t=!1;d.nextTick=function(e){i.push(e),t||setTimeout(f,0)},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.on=o,d.addListener=o,d.once=o,d.off=o,d.removeListener=o,d.removeAllListeners=o,d.emit=o,d.binding=function(){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(){throw new Error("process.chdir is not supported")},d.umask=function(){return 0}},{}],3:[function(n,f,o){(function(n){!function(d){function i(e){throw RangeError(I[e])}function t(e,n){for(var f=e.length;f--;)e[f]=n(e[f]);return e}function l(e,n){return t(e.split(H),n).join(".")}function s(e){for(var n,f,o=[],d=0,i=e.length;i>d;)n=e.charCodeAt(d++),n>=55296&&56319>=n&&i>d?(f=e.charCodeAt(d++),56320==(64512&f)?o.push(((1023&n)<<10)+(1023&f)+65536):(o.push(n),d--)):o.push(n);return o}function u(e){return t(e,function(e){var n="";return e>65535&&(e-=65536,n+=L(e>>>10&1023|55296),e=56320|1023&e),n+=L(e)}).join("")}function a(e){return 10>e-48?e-22:26>e-65?e-65:26>e-97?e-97:k}function p(e,n){return e+22+75*(26>e)-((0!=n)<<5)}function c(e,n,f){var o=0;for(e=f?K(e/B):e>>1,e+=K(e/n);e>J*z>>1;o+=k)e=K(e/J);return K(o+(J+1)*e/(e+A))}function y(e){var n,f,o,d,t,l,s,p,y,m,r=[],v=e.length,w=0,b=D,g=C;for(f=e.lastIndexOf(E),0>f&&(f=0),o=0;f>o;++o)e.charCodeAt(o)>=128&&i("not-basic"),r.push(e.charCodeAt(o));for(d=f>0?f+1:0;v>d;){for(t=w,l=1,s=k;d>=v&&i("invalid-input"),p=a(e.charCodeAt(d++)),(p>=k||p>K((j-w)/l))&&i("overflow"),w+=p*l,y=g>=s?q:s>=g+z?z:s-g,!(y>p);s+=k)m=k-y,l>K(j/m)&&i("overflow"),l*=m;n=r.length+1,g=c(w-t,n,0==t),K(w/n)>j-b&&i("overflow"),b+=K(w/n),w%=n,r.splice(w++,0,b)}return u(r)}function m(e){var n,f,o,d,t,l,u,a,y,m,r,v,w,b,g,h=[];for(e=s(e),v=e.length,n=D,f=0,t=C,l=0;v>l;++l)r=e[l],128>r&&h.push(L(r));for(o=d=h.length,d&&h.push(E);v>o;){for(u=j,l=0;v>l;++l)r=e[l],r>=n&&u>r&&(u=r);for(w=o+1,u-n>K((j-f)/w)&&i("overflow"),f+=(u-n)*w,n=u,l=0;v>l;++l)if(r=e[l],n>r&&++f>j&&i("overflow"),r==n){for(a=f,y=k;m=t>=y?q:y>=t+z?z:y-t,!(m>a);y+=k)g=a-m,b=k-m,h.push(L(p(m+g%b,0))),a=K(g/b);h.push(L(p(a,0))),t=c(f,w,o==d),f=0,++o}++f,++n}return h.join("")}function r(e){return l(e,function(e){return F.test(e)?y(e.slice(4).toLowerCase()):e})}function v(e){return l(e,function(e){return G.test(e)?"xn--"+m(e):e})}var w="object"==typeof o&&o,b="object"==typeof f&&f&&f.exports==w&&f,g="object"==typeof n&&n;(g.global===g||g.window===g)&&(d=g);var h,x,j=2147483647,k=36,q=1,z=26,A=38,B=700,C=72,D=128,E="-",F=/^xn--/,G=/[^ -~]/,H=/\x2E|\u3002|\uFF0E|\uFF61/g,I={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},J=k-q,K=Math.floor,L=String.fromCharCode;if(h={version:"1.2.4",ucs2:{decode:s,encode:u},decode:y,encode:m,toASCII:v,toUnicode:r},"function"==typeof e&&"object"==typeof e.amd&&e.amd)e("punycode",function(){return h});else if(w&&!w.nodeType)if(b)b.exports=h;else for(x in h)h.hasOwnProperty(x)&&(w[x]=h[x]);else d.punycode=h}(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],4:[function(e,n){function f(e,n,f){!e.defaultView||n===e.defaultView.pageXOffset&&f===e.defaultView.pageYOffset||e.defaultView.scrollTo(n,f)}function o(e,n){try{n&&(n.width=e.width,n.height=e.height,n.getContext("2d").putImageData(e.getContext("2d").getImageData(0,0,e.width,e.height),0,0))}catch(f){t("Unable to copy canvas content from",e,f)}}function d(e,n){for(var f=3===e.nodeType?document.createTextNode(e.nodeValue):e.cloneNode(!1),i=e.firstChild;i;)(n===!0||1!==i.nodeType||"SCRIPT"!==i.nodeName)&&f.appendChild(d(i,n)),i=i.nextSibling;return 1===e.nodeType&&(f._scrollTop=e.scrollTop,f._scrollLeft=e.scrollLeft,"CANVAS"===e.nodeName?o(e,f):("TEXTAREA"===e.nodeName||"SELECT"===e.nodeName)&&(f.value=e.value)),f}function i(e){if(1===e.nodeType){e.scrollTop=e._scrollTop,e.scrollLeft=e._scrollLeft;for(var n=e.firstChild;n;)i(n),n=n.nextSibling}}var t=e("./log"),l=e("./promise");n.exports=function(e,n,o,t,s,u,a){var p=d(e.documentElement,s.javascriptEnabled),c=n.createElement("iframe");return c.className="html2canvas-container",c.style.visibility="hidden",c.style.position="fixed",c.style.left="-10000px",c.style.top="0px",c.style.border="0",c.width=o,c.height=t,c.scrolling="no",n.body.appendChild(c),new l(function(n){var o=c.contentWindow.document;c.contentWindow.onload=c.onload=function(){var e=setInterval(function(){o.body.childNodes.length>0&&(i(o.documentElement),clearInterval(e),"view"===s.type&&(c.contentWindow.scrollTo(u,a),!/(iPad|iPhone|iPod)/g.test(navigator.userAgent)||c.contentWindow.scrollY===a&&c.contentWindow.scrollX===u||(o.documentElement.style.top=-a+"px",o.documentElement.style.left=-u+"px",o.documentElement.style.position="absolute")),n(c))},50)},o.open(),o.write("<!DOCTYPE html><html></html>"),f(e,u,a),o.replaceChild(o.adoptNode(p),o.documentElement),o.close()})}},{"./log":15,"./promise":18}],5:[function(e,n){function f(e){this.r=0,this.g=0,this.b=0,this.a=null;this.fromArray(e)||this.namedColor(e)||this.rgb(e)||this.rgba(e)||this.hex6(e)||this.hex3(e)}f.prototype.darken=function(e){var n=1-e;return new f([Math.round(this.r*n),Math.round(this.g*n),Math.round(this.b*n),this.a])},f.prototype.isTransparent=function(){return 0===this.a},f.prototype.isBlack=function(){return 0===this.r&&0===this.g&&0===this.b},f.prototype.fromArray=function(e){return Array.isArray(e)&&(this.r=Math.min(e[0],255),this.g=Math.min(e[1],255),this.b=Math.min(e[2],255),e.length>3&&(this.a=e[3])),Array.isArray(e)};var o=/^#([a-f0-9]{3})$/i;f.prototype.hex3=function(e){var n=null;return null!==(n=e.match(o))&&(this.r=parseInt(n[1][0]+n[1][0],16),this.g=parseInt(n[1][1]+n[1][1],16),this.b=parseInt(n[1][2]+n[1][2],16)),null!==n};var d=/^#([a-f0-9]{6})$/i;f.prototype.hex6=function(e){var n=null;return null!==(n=e.match(d))&&(this.r=parseInt(n[1].substring(0,2),16),this.g=parseInt(n[1].substring(2,4),16),this.b=parseInt(n[1].substring(4,6),16)),null!==n};var i=/^rgb\((\d{1,3}) *, *(\d{1,3}) *, *(\d{1,3})\)$/;f.prototype.rgb=function(e){var n=null;return null!==(n=e.match(i))&&(this.r=Number(n[1]),this.g=Number(n[2]),this.b=Number(n[3])),null!==n};var t=/^rgba\((\d{1,3}) *, *(\d{1,3}) *, *(\d{1,3}) *, *(\d+\.?\d*)\)$/;f.prototype.rgba=function(e){var n=null;return null!==(n=e.match(t))&&(this.r=Number(n[1]),this.g=Number(n[2]),this.b=Number(n[3]),this.a=Number(n[4])),null!==n},f.prototype.toString=function(){return null!==this.a&&1!==this.a?"rgba("+[this.r,this.g,this.b,this.a].join(",")+")":"rgb("+[this.r,this.g,this.b].join(",")+")"},f.prototype.namedColor=function(e){var n=l[e.toLowerCase()];if(n)this.r=n[0],this.g=n[1],this.b=n[2];else if("transparent"===e.toLowerCase())return this.r=this.g=this.b=this.a=0,!0;return!!n},f.prototype.isColor=!0;var l={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]};n.exports=f},{}],6:[function(n,f){function o(e,n){var f=k++;if(n=n||{},n.logging&&(window.html2canvas.logging=!0,window.html2canvas.start=Date.now()),n.async="undefined"==typeof n.async?!0:n.async,n.allowTaint="undefined"==typeof n.allowTaint?!1:n.allowTaint,n.removeContainer="undefined"==typeof n.removeContainer?!0:n.removeContainer,n.javascriptEnabled="undefined"==typeof n.javascriptEnabled?!1:n.javascriptEnabled,n.imageTimeout="undefined"==typeof n.imageTimeout?1e4:n.imageTimeout,n.renderer="function"==typeof n.renderer?n.renderer:y,n.strict=!!n.strict,"string"==typeof e){if("string"!=typeof n.proxy)return p.reject("Proxy must be used when rendering url");var o=null!=n.width?n.width:window.innerWidth,t=null!=n.height?n.height:window.innerHeight;return h(a(e),n.proxy,document,o,t,n).then(function(e){return i(e.contentWindow.document.documentElement,e,n,o,t)})}var l=(void 0===e?[document.documentElement]:e.length?e:[e])[0];return l.setAttribute(j+f,f),d(l.ownerDocument,n,l.ownerDocument.defaultView.innerWidth,l.ownerDocument.defaultView.innerHeight,f).then(function(e){return"function"==typeof n.onrendered&&(w("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas"),n.onrendered(e)),e})}function d(e,n,f,o,d){return g(e,e,f,o,n,e.defaultView.pageXOffset,e.defaultView.pageYOffset).then(function(t){w("Document cloned");var l=j+d,s="["+l+"='"+d+"']";e.querySelector(s).removeAttribute(l);var u=t.contentWindow,a=u.document.querySelector(s),c=p.resolve("function"==typeof n.onclone?n.onclone(u.document):!0);return c.then(function(){return i(a,t,n,f,o)})})}function i(e,n,f,o,d){var i=n.contentWindow,a=new c(i.document),p=new m(f,a),y=x(e),v="view"===f.type?o:s(i.document),b="view"===f.type?d:u(i.document),g=new f.renderer(v,b,p,f,document),h=new r(e,g,a,p,f);return h.ready.then(function(){w("Finished rendering");var o;return o="view"===f.type?l(g.canvas,{width:g.canvas.width,height:g.canvas.height,top:0,left:0,x:0,y:0}):e===i.document.body||e===i.document.documentElement||null!=f.canvas?g.canvas:l(g.canvas,{width:null!=f.width?f.width:y.width,height:null!=f.height?f.height:y.height,top:y.top,left:y.left,x:i.pageXOffset,y:i.pageYOffset}),t(n,f),o})}function t(e,n){n.removeContainer&&(e.parentNode.removeChild(e),w("Cleaned up container"))}function l(e,n){var f=document.createElement("canvas"),o=Math.min(e.width-1,Math.max(0,n.left)),d=Math.min(e.width,Math.max(1,n.left+n.width)),i=Math.min(e.height-1,Math.max(0,n.top)),t=Math.min(e.height,Math.max(1,n.top+n.height));return f.width=n.width,f.height=n.height,w("Cropping canvas at:","left:",n.left,"top:",n.top,"width:",d-o,"height:",t-i),w("Resulting crop with width",n.width,"and height",n.height," with x",o,"and y",i),f.getContext("2d").drawImage(e,o,i,d-o,t-i,n.x,n.y,d-o,t-i),f}function s(e){return Math.max(Math.max(e.body.scrollWidth,e.documentElement.scrollWidth),Math.max(e.body.offsetWidth,e.documentElement.offsetWidth),Math.max(e.body.clientWidth,e.documentElement.clientWidth))}function u(e){return Math.max(Math.max(e.body.scrollHeight,e.documentElement.scrollHeight),Math.max(e.body.offsetHeight,e.documentElement.offsetHeight),Math.max(e.body.clientHeight,e.documentElement.clientHeight))}function a(e){var n=document.createElement("a");return n.href=e,n.href=n.href,n}var p=n("./promise"),c=n("./support"),y=n("./renderers/canvas"),m=n("./imageloader"),r=n("./nodeparser"),v=n("./nodecontainer"),w=n("./log"),b=n("./utils"),g=n("./clone"),h=n("./proxy").loadUrlDocument,x=b.getBounds,j="data-html2canvas-node",k=0;o.Promise=p,o.CanvasRenderer=y,o.NodeContainer=v,o.log=w,o.utils=b;var q="undefined"==typeof document||"function"!=typeof Object.create||"function"!=typeof document.createElement("canvas").getContext?function(){return p.reject("No canvas support")}:o;f.exports=q,"function"==typeof e&&e.amd&&e("html2canvas",[],function(){return q})},{"./clone":4,"./imageloader":13,"./log":15,"./nodecontainer":16,"./nodeparser":17,"./promise":18,"./proxy":19,"./renderers/canvas":23,"./support":25,"./utils":29}],7:[function(e,n){function f(e){if(this.src=e,d("DummyImageContainer for",e),!this.promise||!this.image){d("Initiating DummyImageContainer"),f.prototype.image=new Image;var n=this.image;f.prototype.promise=new o(function(e,f){n.onload=e,n.onerror=f,n.src=i(),n.complete===!0&&e(n)})}}var o=e("./promise"),d=e("./log"),i=e("./utils").smallImage;n.exports=f},{"./log":15,"./promise":18,"./utils":29}],8:[function(e,n){function f(e,n){var f,d,i=document.createElement("div"),t=document.createElement("img"),l=document.createElement("span"),s="Hidden Text";i.style.visibility="hidden",i.style.fontFamily=e,i.style.fontSize=n,i.style.margin=0,i.style.padding=0,document.body.appendChild(i),t.src=o(),t.width=1,t.height=1,t.style.margin=0,t.style.padding=0,t.style.verticalAlign="baseline",l.style.fontFamily=e,l.style.fontSize=n,l.style.margin=0,l.style.padding=0,l.appendChild(document.createTextNode(s)),i.appendChild(l),i.appendChild(t),f=t.offsetTop-l.offsetTop+1,i.removeChild(l),i.appendChild(document.createTextNode(s)),i.style.lineHeight="normal",t.style.verticalAlign="super",d=t.offsetTop-i.offsetTop+1,document.body.removeChild(i),this.baseline=f,this.lineWidth=1,this.middle=d}var o=e("./utils").smallImage;n.exports=f},{"./utils":29}],9:[function(e,n){function f(){this.data={}}var o=e("./font");f.prototype.getMetrics=function(e,n){return void 0===this.data[e+"-"+n]&&(this.data[e+"-"+n]=new o(e,n)),this.data[e+"-"+n]},n.exports=f},{"./font":8}],10:[function(e,n){function f(n,f,o){this.image=null,this.src=n;var t=this,l=i(n);this.promise=(f?new d(function(e){"about:blank"===n.contentWindow.document.URL||null==n.contentWindow.document.documentElement?n.contentWindow.onload=n.onload=function(){e(n)}:e(n)}):this.proxyLoad(o.proxy,l,o)).then(function(n){var f=e("./core");return f(n.contentWindow.document.documentElement,{type:"view",width:n.width,height:n.height,proxy:o.proxy,javascriptEnabled:o.javascriptEnabled,removeContainer:o.removeContainer,allowTaint:o.allowTaint,imageTimeout:o.imageTimeout/2})}).then(function(e){return t.image=e})}var o=e("./utils"),d=e("./promise"),i=o.getBounds,t=e("./proxy").loadUrlDocument;f.prototype.proxyLoad=function(e,n,f){var o=this.src;return t(o.src,e,o.ownerDocument,n.width,n.height,f)},n.exports=f},{"./core":6,"./promise":18,"./proxy":19,"./utils":29}],11:[function(e,n){function f(e){this.src=e.value,this.colorStops=[],this.type=null,this.x0=.5,this.y0=.5,this.x1=.5,this.y1=.5,this.promise=o.resolve(!0)}var o=e("./promise");f.prototype.TYPES={LINEAR:1,RADIAL:2},n.exports=f},{"./promise":18}],12:[function(e,n){function f(e,n){this.src=e,this.image=new Image;var f=this;this.tainted=null,this.promise=new o(function(o,d){f.image.onload=o,f.image.onerror=d,n&&(f.image.crossOrigin="anonymous"),f.image.src=e,f.image.complete===!0&&o(f.image)})}var o=e("./promise");n.exports=f},{"./promise":18}],13:[function(e,n){function f(e,n){this.link=null,this.options=e,this.support=n,this.origin=this.getOrigin(window.location.href)}var o=e("./promise"),d=e("./log"),i=e("./imagecontainer"),t=e("./dummyimagecontainer"),l=e("./proxyimagecontainer"),s=e("./framecontainer"),u=e("./svgcontainer"),a=e("./svgnodecontainer"),p=e("./lineargradientcontainer"),c=e("./webkitgradientcontainer"),y=e("./utils").bind;f.prototype.findImages=function(e){var n=[];return e.reduce(function(e,n){switch(n.node.nodeName){case"IMG":return e.concat([{args:[n.node.src],method:"url"}]);case"svg":case"IFRAME":return e.concat([{args:[n.node],method:n.node.nodeName}])}return e},[]).forEach(this.addImage(n,this.loadImage),this),n},f.prototype.findBackgroundImage=function(e,n){return n.parseBackgroundImages().filter(this.hasImageBackground).forEach(this.addImage(e,this.loadImage),this),e},f.prototype.addImage=function(e,n){return function(f){f.args.forEach(function(o){this.imageExists(e,o)||(e.splice(0,0,n.call(this,f)),d("Added image #"+e.length,"string"==typeof o?o.substring(0,100):o))},this)}},f.prototype.hasImageBackground=function(e){return"none"!==e.method},f.prototype.loadImage=function(e){if("url"===e.method){var n=e.args[0];return!this.isSVG(n)||this.support.svg||this.options.allowTaint?n.match(/data:image\/.*;base64,/i)?new i(n.replace(/url\(['"]{0,}|['"]{0,}\)$/gi,""),!1):this.isSameOrigin(n)||this.options.allowTaint===!0||this.isSVG(n)?new i(n,!1):this.support.cors&&!this.options.allowTaint&&this.options.useCORS?new i(n,!0):this.options.proxy?new l(n,this.options.proxy):new t(n):new u(n)}return"linear-gradient"===e.method?new p(e):"gradient"===e.method?new c(e):"svg"===e.method?new a(e.args[0],this.support.svg):"IFRAME"===e.method?new s(e.args[0],this.isSameOrigin(e.args[0].src),this.options):new t(e)},f.prototype.isSVG=function(e){return"svg"===e.substring(e.length-3).toLowerCase()||u.prototype.isInline(e)},f.prototype.imageExists=function(e,n){return e.some(function(e){return e.src===n})},f.prototype.isSameOrigin=function(e){return this.getOrigin(e)===this.origin},f.prototype.getOrigin=function(e){var n=this.link||(this.link=document.createElement("a"));return n.href=e,n.href=n.href,n.protocol+n.hostname+n.port},f.prototype.getPromise=function(e){return this.timeout(e,this.options.imageTimeout)["catch"](function(){var n=new t(e.src);return n.promise.then(function(n){e.image=n})})},f.prototype.get=function(e){var n=null;return this.images.some(function(f){return(n=f).src===e})?n:null},f.prototype.fetch=function(e){return this.images=e.reduce(y(this.findBackgroundImage,this),this.findImages(e)),this.images.forEach(function(e,n){e.promise.then(function(){d("Succesfully loaded image #"+(n+1),e)},function(f){d("Failed loading image #"+(n+1),e,f)})}),this.ready=o.all(this.images.map(this.getPromise,this)),d("Finished searching images"),this},f.prototype.timeout=function(e,n){var f,i=o.race([e.promise,new o(function(o,i){f=setTimeout(function(){d("Timed out loading image",e),i(e)},n)})]).then(function(e){return clearTimeout(f),e});return i["catch"](function(){clearTimeout(f)}),i},n.exports=f},{"./dummyimagecontainer":7,"./framecontainer":10,"./imagecontainer":12,"./lineargradientcontainer":14,"./log":15,"./promise":18,"./proxyimagecontainer":20,"./svgcontainer":26,"./svgnodecontainer":27,"./utils":29,"./webkitgradientcontainer":30}],14:[function(e,n){function f(e){o.apply(this,arguments),this.type=this.TYPES.LINEAR;var n=null===e.args[0].match(this.stepRegExp);n?e.args[0].split(" ").reverse().forEach(function(e){switch(e){case"left":this.x0=0,this.x1=1;break;case"top":this.y0=0,this.y1=1;break;case"right":this.x0=1,this.x1=0;break;case"bottom":this.y0=1,this.y1=0;break;case"to":var n=this.y0,f=this.x0;this.y0=this.y1,this.x0=this.x1,this.x1=f,this.y1=n}},this):(this.y0=0,this.y1=1),this.colorStops=e.args.slice(n?1:0).map(function(e){return e.match(i)}).filter(function(e){return!!e}).map(function(e){return{color:new d(e[1]),stop:"%"===e[3]?e[2]/100:null}}),null===this.colorStops[0].stop&&(this.colorStops[0].stop=0),null===this.colorStops[this.colorStops.length-1].stop&&(this.colorStops[this.colorStops.length-1].stop=1),this.colorStops.forEach(function(e,n){null===e.stop&&this.colorStops.slice(n).some(function(f,o){return null!==f.stop?(e.stop=(f.stop-this.colorStops[n-1].stop)/(o+1)+this.colorStops[n-1].stop,!0):!1},this)},this)}var o=e("./gradientcontainer"),d=e("./color"),i=/^\s*(.*)\s*(\d{1,3})?(%|px)?$/;f.prototype=Object.create(o.prototype),f.prototype.stepRegExp=/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/,n.exports=f},{"./color":5,"./gradientcontainer":11}],15:[function(e,n){n.exports=function(){window.html2canvas.logging&&window.console&&window.console.log&&Function.prototype.bind.call(window.console.log,window.console).apply(window.console,[Date.now()-window.html2canvas.start+"ms","html2canvas:"].concat([].slice.call(arguments,0)))}},{}],16:[function(e,n){function f(e,n){this.node=e,this.parent=n,this.stack=null,this.bounds=null,this.borders=null,this.clip=[],this.backgroundClip=[],this.offsetBounds=null,this.visible=null,this.computedStyles=null,this.colors={},this.styles={},this.backgroundImages=null,this.transformData=null,this.transformMatrix=null,this.isPseudoElement=!1,this.opacity=null}function o(e){var n=e.options[e.selectedIndex||0];return n?n.text||"":""}function d(e){if(e&&"matrix"===e[1])return e[2].split(",").map(function(e){return parseFloat(e.trim())});if(e&&"matrix3d"===e[1]){var n=e[2].split(",").map(function(e){return parseFloat(e.trim())});return[n[0],n[1],n[4],n[5],n[12],n[13]]}}function i(e){return-1!==e.toString().indexOf("%")}function t(e){return e.replace("px","")}function l(e){return parseFloat(e)}var s=e("./color"),u=e("./utils"),a=u.getBounds,p=u.parseBackgrounds,c=u.offsetBounds;f.prototype.cloneTo=function(e){e.visible=this.visible,e.borders=this.borders,e.bounds=this.bounds,e.clip=this.clip,e.backgroundClip=this.backgroundClip,e.computedStyles=this.computedStyles,e.styles=this.styles,e.backgroundImages=this.backgroundImages,e.opacity=this.opacity},f.prototype.getOpacity=function(){return null===this.opacity?this.opacity=this.cssFloat("opacity"):this.opacity},f.prototype.assignStack=function(e){this.stack=e,e.children.push(this)},f.prototype.isElementVisible=function(){return this.node.nodeType===Node.TEXT_NODE?this.parent.visible:"none"!==this.css("display")&&"hidden"!==this.css("visibility")&&!this.node.hasAttribute("data-html2canvas-ignore")&&("INPUT"!==this.node.nodeName||"hidden"!==this.node.getAttribute("type"))},f.prototype.css=function(e){return this.computedStyles||(this.computedStyles=this.isPseudoElement?this.parent.computedStyle(this.before?":before":":after"):this.computedStyle(null)),this.styles[e]||(this.styles[e]=this.computedStyles[e])},f.prototype.prefixedCss=function(e){var n=["webkit","moz","ms","o"],f=this.css(e);return void 0===f&&n.some(function(n){return f=this.css(n+e.substr(0,1).toUpperCase()+e.substr(1)),void 0!==f},this),void 0===f?null:f},f.prototype.computedStyle=function(e){return this.node.ownerDocument.defaultView.getComputedStyle(this.node,e)},f.prototype.cssInt=function(e){var n=parseInt(this.css(e),10);return isNaN(n)?0:n},f.prototype.color=function(e){return this.colors[e]||(this.colors[e]=new s(this.css(e)))},f.prototype.cssFloat=function(e){var n=parseFloat(this.css(e));return isNaN(n)?0:n},f.prototype.fontWeight=function(){var e=this.css("fontWeight");switch(parseInt(e,10)){case 401:e="bold";break;case 400:e="normal"}return e},f.prototype.parseClip=function(){var e=this.css("clip").match(this.CLIP);return e?{top:parseInt(e[1],10),right:parseInt(e[2],10),bottom:parseInt(e[3],10),left:parseInt(e[4],10)}:null
},f.prototype.parseBackgroundImages=function(){return this.backgroundImages||(this.backgroundImages=p(this.css("backgroundImage")))},f.prototype.cssList=function(e,n){var f=(this.css(e)||"").split(",");return f=f[n||0]||f[0]||"auto",f=f.trim().split(" "),1===f.length&&(f=[f[0],i(f[0])?"auto":f[0]]),f},f.prototype.parseBackgroundSize=function(e,n,f){var o,d,t=this.cssList("backgroundSize",f);if(i(t[0]))o=e.width*parseFloat(t[0])/100;else{if(/contain|cover/.test(t[0])){var l=e.width/e.height,s=n.width/n.height;return s>l^"contain"===t[0]?{width:e.height*s,height:e.height}:{width:e.width,height:e.width/s}}o=parseInt(t[0],10)}return d="auto"===t[0]&&"auto"===t[1]?n.height:"auto"===t[1]?o/n.width*n.height:i(t[1])?e.height*parseFloat(t[1])/100:parseInt(t[1],10),"auto"===t[0]&&(o=d/n.height*n.width),{width:o,height:d}},f.prototype.parseBackgroundPosition=function(e,n,f,o){var d,t,l=this.cssList("backgroundPosition",f);return d=i(l[0])?(e.width-(o||n).width)*(parseFloat(l[0])/100):parseInt(l[0],10),t="auto"===l[1]?d/n.width*n.height:i(l[1])?(e.height-(o||n).height)*parseFloat(l[1])/100:parseInt(l[1],10),"auto"===l[0]&&(d=t/n.height*n.width),{left:d,top:t}},f.prototype.parseBackgroundRepeat=function(e){return this.cssList("backgroundRepeat",e)[0]},f.prototype.parseTextShadows=function(){var e=this.css("textShadow"),n=[];if(e&&"none"!==e)for(var f=e.match(this.TEXT_SHADOW_PROPERTY),o=0;f&&o<f.length;o++){var d=f[o].match(this.TEXT_SHADOW_VALUES);n.push({color:new s(d[0]),offsetX:d[1]?parseFloat(d[1].replace("px","")):0,offsetY:d[2]?parseFloat(d[2].replace("px","")):0,blur:d[3]?d[3].replace("px",""):0})}return n},f.prototype.parseTransform=function(){if(!this.transformData)if(this.hasTransform()){var e=this.parseBounds(),n=this.prefixedCss("transformOrigin").split(" ").map(t).map(l);n[0]+=e.left,n[1]+=e.top,this.transformData={origin:n,matrix:this.parseTransformMatrix()}}else this.transformData={origin:[0,0],matrix:[1,0,0,1,0,0]};return this.transformData},f.prototype.parseTransformMatrix=function(){if(!this.transformMatrix){var e=this.prefixedCss("transform"),n=e?d(e.match(this.MATRIX_PROPERTY)):null;this.transformMatrix=n?n:[1,0,0,1,0,0]}return this.transformMatrix},f.prototype.parseBounds=function(){return this.bounds||(this.bounds=this.hasTransform()?c(this.node):a(this.node))},f.prototype.hasTransform=function(){return"1,0,0,1,0,0"!==this.parseTransformMatrix().join(",")||this.parent&&this.parent.hasTransform()},f.prototype.getValue=function(){var e=this.node.value||"";return"SELECT"===this.node.tagName?e=o(this.node):"password"===this.node.type&&(e=Array(e.length+1).join("•")),0===e.length?this.node.placeholder||"":e},f.prototype.MATRIX_PROPERTY=/(matrix|matrix3d)\((.+)\)/,f.prototype.TEXT_SHADOW_PROPERTY=/((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g,f.prototype.TEXT_SHADOW_VALUES=/(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g,f.prototype.CLIP=/^rect\((\d+)px,? (\d+)px,? (\d+)px,? (\d+)px\)$/,n.exports=f},{"./color":5,"./utils":29}],17:[function(e,n){function f(e,n,f,o,d){N("Starting NodeParser"),this.renderer=n,this.options=d,this.range=null,this.support=f,this.renderQueue=[],this.stack=new V(!0,1,e.ownerDocument,null);var i=new P(e,null);if(d.background&&n.rectangle(0,0,n.width,n.height,new T(d.background)),e===e.ownerDocument.documentElement){var t=new P(i.color("backgroundColor").isTransparent()?e.ownerDocument.body:e.ownerDocument.documentElement,null);n.rectangle(0,0,n.width,n.height,t.color("backgroundColor"))}i.visibile=i.isElementVisible(),this.createPseudoHideStyles(e.ownerDocument),this.disableAnimations(e.ownerDocument),this.nodes=I([i].concat(this.getChildren(i)).filter(function(e){return e.visible=e.isElementVisible()}).map(this.getPseudoElements,this)),this.fontMetrics=new S,N("Fetched nodes, total:",this.nodes.length),N("Calculate overflow clips"),this.calculateOverflowClips(),N("Start fetching images"),this.images=o.fetch(this.nodes.filter(A)),this.ready=this.images.ready.then(X(function(){return N("Images loaded, starting parsing"),N("Creating stacking contexts"),this.createStackingContexts(),N("Sorting stacking contexts"),this.sortStackingContexts(this.stack),this.parse(this.stack),N("Render queue created with "+this.renderQueue.length+" items"),new U(X(function(e){d.async?"function"==typeof d.async?d.async.call(this,this.renderQueue,e):this.renderQueue.length>0?(this.renderIndex=0,this.asyncRenderer(this.renderQueue,e)):e():(this.renderQueue.forEach(this.paint,this),e())},this))},this))}function o(e){return e.parent&&e.parent.clip.length}function d(e){return e.replace(/(\-[a-z])/g,function(e){return e.toUpperCase().replace("-","")})}function i(){}function t(e,n,f,o){return e.map(function(d,i){if(d.width>0){var t=n.left,l=n.top,s=n.width,u=n.height-e[2].width;switch(i){case 0:u=e[0].width,d.args=a({c1:[t,l],c2:[t+s,l],c3:[t+s-e[1].width,l+u],c4:[t+e[3].width,l+u]},o[0],o[1],f.topLeftOuter,f.topLeftInner,f.topRightOuter,f.topRightInner);break;case 1:t=n.left+n.width-e[1].width,s=e[1].width,d.args=a({c1:[t+s,l],c2:[t+s,l+u+e[2].width],c3:[t,l+u],c4:[t,l+e[0].width]},o[1],o[2],f.topRightOuter,f.topRightInner,f.bottomRightOuter,f.bottomRightInner);break;case 2:l=l+n.height-e[2].width,u=e[2].width,d.args=a({c1:[t+s,l+u],c2:[t,l+u],c3:[t+e[3].width,l],c4:[t+s-e[3].width,l]},o[2],o[3],f.bottomRightOuter,f.bottomRightInner,f.bottomLeftOuter,f.bottomLeftInner);break;case 3:s=e[3].width,d.args=a({c1:[t,l+u+e[2].width],c2:[t,l],c3:[t+s,l+e[0].width],c4:[t+s,l+u]},o[3],o[0],f.bottomLeftOuter,f.bottomLeftInner,f.topLeftOuter,f.topLeftInner)}}return d})}function l(e,n,f,o){var d=4*((Math.sqrt(2)-1)/3),i=f*d,t=o*d,l=e+f,s=n+o;return{topLeft:u({x:e,y:s},{x:e,y:s-t},{x:l-i,y:n},{x:l,y:n}),topRight:u({x:e,y:n},{x:e+i,y:n},{x:l,y:s-t},{x:l,y:s}),bottomRight:u({x:l,y:n},{x:l,y:n+t},{x:e+i,y:s},{x:e,y:s}),bottomLeft:u({x:l,y:s},{x:l-i,y:s},{x:e,y:n+t},{x:e,y:n})}}function s(e,n,f){var o=e.left,d=e.top,i=e.width,t=e.height,s=n[0][0]<i/2?n[0][0]:i/2,u=n[0][1]<t/2?n[0][1]:t/2,a=n[1][0]<i/2?n[1][0]:i/2,p=n[1][1]<t/2?n[1][1]:t/2,c=n[2][0]<i/2?n[2][0]:i/2,y=n[2][1]<t/2?n[2][1]:t/2,m=n[3][0]<i/2?n[3][0]:i/2,r=n[3][1]<t/2?n[3][1]:t/2,v=i-a,w=t-y,b=i-c,g=t-r;return{topLeftOuter:l(o,d,s,u).topLeft.subdivide(.5),topLeftInner:l(o+f[3].width,d+f[0].width,Math.max(0,s-f[3].width),Math.max(0,u-f[0].width)).topLeft.subdivide(.5),topRightOuter:l(o+v,d,a,p).topRight.subdivide(.5),topRightInner:l(o+Math.min(v,i+f[3].width),d+f[0].width,v>i+f[3].width?0:a-f[3].width,p-f[0].width).topRight.subdivide(.5),bottomRightOuter:l(o+b,d+w,c,y).bottomRight.subdivide(.5),bottomRightInner:l(o+Math.min(b,i-f[3].width),d+Math.min(w,t+f[0].width),Math.max(0,c-f[1].width),y-f[2].width).bottomRight.subdivide(.5),bottomLeftOuter:l(o,d+g,m,r).bottomLeft.subdivide(.5),bottomLeftInner:l(o+f[3].width,d+g,Math.max(0,m-f[3].width),r-f[2].width).bottomLeft.subdivide(.5)}}function u(e,n,f,o){var d=function(e,n,f){return{x:e.x+(n.x-e.x)*f,y:e.y+(n.y-e.y)*f}};return{start:e,startControl:n,endControl:f,end:o,subdivide:function(i){var t=d(e,n,i),l=d(n,f,i),s=d(f,o,i),a=d(t,l,i),p=d(l,s,i),c=d(a,p,i);return[u(e,t,a,c),u(c,p,s,o)]},curveTo:function(e){e.push(["bezierCurve",n.x,n.y,f.x,f.y,o.x,o.y])},curveToReversed:function(o){o.push(["bezierCurve",f.x,f.y,n.x,n.y,e.x,e.y])}}}function a(e,n,f,o,d,i,t){var l=[];return n[0]>0||n[1]>0?(l.push(["line",o[1].start.x,o[1].start.y]),o[1].curveTo(l)):l.push(["line",e.c1[0],e.c1[1]]),f[0]>0||f[1]>0?(l.push(["line",i[0].start.x,i[0].start.y]),i[0].curveTo(l),l.push(["line",t[0].end.x,t[0].end.y]),t[0].curveToReversed(l)):(l.push(["line",e.c2[0],e.c2[1]]),l.push(["line",e.c3[0],e.c3[1]])),n[0]>0||n[1]>0?(l.push(["line",d[1].end.x,d[1].end.y]),d[1].curveToReversed(l)):l.push(["line",e.c4[0],e.c4[1]]),l}function p(e,n,f,o,d,i,t){n[0]>0||n[1]>0?(e.push(["line",o[0].start.x,o[0].start.y]),o[0].curveTo(e),o[1].curveTo(e)):e.push(["line",i,t]),(f[0]>0||f[1]>0)&&e.push(["line",d[0].start.x,d[0].start.y])}function c(e){return e.cssInt("zIndex")<0}function y(e){return e.cssInt("zIndex")>0}function m(e){return 0===e.cssInt("zIndex")}function r(e){return-1!==["inline","inline-block","inline-table"].indexOf(e.css("display"))}function v(e){return e instanceof V}function w(e){return e.node.data.trim().length>0}function b(e){return/^(normal|none|0px)$/.test(e.parent.css("letterSpacing"))}function g(e){return["TopLeft","TopRight","BottomRight","BottomLeft"].map(function(n){var f=e.css("border"+n+"Radius"),o=f.split(" ");return o.length<=1&&(o[1]=o[0]),o.map(F)})}function h(e){return e.nodeType===Node.TEXT_NODE||e.nodeType===Node.ELEMENT_NODE}function x(e){var n=e.css("position"),f=-1!==["absolute","relative","fixed"].indexOf(n)?e.css("zIndex"):"auto";return"auto"!==f}function j(e){return"static"!==e.css("position")}function k(e){return"none"!==e.css("float")}function q(e){return-1!==["inline-block","inline-table"].indexOf(e.css("display"))}function z(e){var n=this;return function(){return!e.apply(n,arguments)}}function A(e){return e.node.nodeType===Node.ELEMENT_NODE}function B(e){return e.isPseudoElement===!0}function C(e){return e.node.nodeType===Node.TEXT_NODE}function D(e){return function(n,f){return n.cssInt("zIndex")+e.indexOf(n)/e.length-(f.cssInt("zIndex")+e.indexOf(f)/e.length)}}function E(e){return e.getOpacity()<1}function F(e){return parseInt(e,10)}function G(e){return e.width}function H(e){return e.node.nodeType!==Node.ELEMENT_NODE||-1===["SCRIPT","HEAD","TITLE","OBJECT","BR","OPTION"].indexOf(e.node.nodeName)}function I(e){return[].concat.apply([],e)}function J(e){var n=e.substr(0,1);return n===e.substr(e.length-1)&&n.match(/'|"/)?e.substr(1,e.length-2):e}function K(e){for(var n,f=[],o=0,d=!1;e.length;)L(e[o])===d?(n=e.splice(0,o),n.length&&f.push(O.ucs2.encode(n)),d=!d,o=0):o++,o>=e.length&&(n=e.splice(0,o),n.length&&f.push(O.ucs2.encode(n)));return f}function L(e){return-1!==[32,13,10,9,45].indexOf(e)}function M(e){return/[^\u0000-\u00ff]/.test(e)}var N=e("./log"),O=e("punycode"),P=e("./nodecontainer"),Q=e("./textcontainer"),R=e("./pseudoelementcontainer"),S=e("./fontmetrics"),T=e("./color"),U=e("./promise"),V=e("./stackingcontext"),W=e("./utils"),X=W.bind,Y=W.getBounds,Z=W.parseBackgrounds,$=W.offsetBounds;f.prototype.calculateOverflowClips=function(){this.nodes.forEach(function(e){if(A(e)){B(e)&&e.appendToDOM(),e.borders=this.parseBorders(e);var n="hidden"===e.css("overflow")?[e.borders.clip]:[],f=e.parseClip();f&&-1!==["absolute","fixed"].indexOf(e.css("position"))&&n.push([["rect",e.bounds.left+f.left,e.bounds.top+f.top,f.right-f.left,f.bottom-f.top]]),e.clip=o(e)?e.parent.clip.concat(n):n,e.backgroundClip="hidden"!==e.css("overflow")?e.clip.concat([e.borders.clip]):e.clip,B(e)&&e.cleanDOM()}else C(e)&&(e.clip=o(e)?e.parent.clip:[]);B(e)||(e.bounds=null)},this)},f.prototype.asyncRenderer=function(e,n,f){f=f||Date.now(),this.paint(e[this.renderIndex++]),e.length===this.renderIndex?n():f+20>Date.now()?this.asyncRenderer(e,n,f):setTimeout(X(function(){this.asyncRenderer(e,n)},this),0)},f.prototype.createPseudoHideStyles=function(e){this.createStyles(e,"."+R.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE+':before { content: "" !important; display: none !important; }.'+R.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER+':after { content: "" !important; display: none !important; }')},f.prototype.disableAnimations=function(e){this.createStyles(e,"* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}")},f.prototype.createStyles=function(e,n){var f=e.createElement("style");f.innerHTML=n,e.body.appendChild(f)},f.prototype.getPseudoElements=function(e){var n=[[e]];if(e.node.nodeType===Node.ELEMENT_NODE){var f=this.getPseudoElement(e,":before"),o=this.getPseudoElement(e,":after");f&&n.push(f),o&&n.push(o)}return I(n)},f.prototype.getPseudoElement=function(e,n){var f=e.computedStyle(n);if(!f||!f.content||"none"===f.content||"-moz-alt-content"===f.content||"none"===f.display)return null;for(var o=J(f.content),i="url"===o.substr(0,3),t=document.createElement(i?"img":"html2canvaspseudoelement"),l=new R(t,e,n),s=f.length-1;s>=0;s--){var u=d(f.item(s));t.style[u]=f[u]}if(t.className=R.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE+" "+R.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER,i)return t.src=Z(o)[0].args[0],[l];var a=document.createTextNode(o);return t.appendChild(a),[l,new Q(a,l)]},f.prototype.getChildren=function(e){return I([].filter.call(e.node.childNodes,h).map(function(n){var f=[n.nodeType===Node.TEXT_NODE?new Q(n,e):new P(n,e)].filter(H);return n.nodeType===Node.ELEMENT_NODE&&f.length&&"TEXTAREA"!==n.tagName?f[0].isElementVisible()?f.concat(this.getChildren(f[0])):[]:f},this))},f.prototype.newStackingContext=function(e,n){var f=new V(n,e.getOpacity(),e.node,e.parent);e.cloneTo(f);var o=n?f.getParentStack(this):f.parent.stack;o.contexts.push(f),e.stack=f},f.prototype.createStackingContexts=function(){this.nodes.forEach(function(e){A(e)&&(this.isRootElement(e)||E(e)||x(e)||this.isBodyWithTransparentRoot(e)||e.hasTransform())?this.newStackingContext(e,!0):A(e)&&(j(e)&&m(e)||q(e)||k(e))?this.newStackingContext(e,!1):e.assignStack(e.parent.stack)},this)},f.prototype.isBodyWithTransparentRoot=function(e){return"BODY"===e.node.nodeName&&e.parent.color("backgroundColor").isTransparent()},f.prototype.isRootElement=function(e){return null===e.parent},f.prototype.sortStackingContexts=function(e){e.contexts.sort(D(e.contexts.slice(0))),e.contexts.forEach(this.sortStackingContexts,this)},f.prototype.parseTextBounds=function(e){return function(n,f,o){if("none"!==e.parent.css("textDecoration").substr(0,4)||0!==n.trim().length){if(this.support.rangeBounds&&!e.parent.hasTransform()){var d=o.slice(0,f).join("").length;return this.getRangeBounds(e.node,d,n.length)}if(e.node&&"string"==typeof e.node.data){var i=e.node.splitText(n.length),t=this.getWrapperBounds(e.node,e.parent.hasTransform());return e.node=i,t}}else(!this.support.rangeBounds||e.parent.hasTransform())&&(e.node=e.node.splitText(n.length));return{}}},f.prototype.getWrapperBounds=function(e,n){var f=e.ownerDocument.createElement("html2canvaswrapper"),o=e.parentNode,d=e.cloneNode(!0);f.appendChild(e.cloneNode(!0)),o.replaceChild(f,e);var i=n?$(f):Y(f);return o.replaceChild(d,f),i},f.prototype.getRangeBounds=function(e,n,f){var o=this.range||(this.range=e.ownerDocument.createRange());return o.setStart(e,n),o.setEnd(e,n+f),o.getBoundingClientRect()},f.prototype.parse=function(e){var n=e.contexts.filter(c),f=e.children.filter(A),o=f.filter(z(k)),d=o.filter(z(j)).filter(z(r)),t=f.filter(z(j)).filter(k),l=o.filter(z(j)).filter(r),s=e.contexts.concat(o.filter(j)).filter(m),u=e.children.filter(C).filter(w),a=e.contexts.filter(y);n.concat(d).concat(t).concat(l).concat(s).concat(u).concat(a).forEach(function(e){this.renderQueue.push(e),v(e)&&(this.parse(e),this.renderQueue.push(new i))},this)},f.prototype.paint=function(e){try{e instanceof i?this.renderer.ctx.restore():C(e)?(B(e.parent)&&e.parent.appendToDOM(),this.paintText(e),B(e.parent)&&e.parent.cleanDOM()):this.paintNode(e)}catch(n){if(N(n),this.options.strict)throw n}},f.prototype.paintNode=function(e){v(e)&&(this.renderer.setOpacity(e.opacity),this.renderer.ctx.save(),e.hasTransform()&&this.renderer.setTransform(e.parseTransform())),"INPUT"===e.node.nodeName&&"checkbox"===e.node.type?this.paintCheckbox(e):"INPUT"===e.node.nodeName&&"radio"===e.node.type?this.paintRadio(e):this.paintElement(e)},f.prototype.paintElement=function(e){var n=e.parseBounds();this.renderer.clip(e.backgroundClip,function(){this.renderer.renderBackground(e,n,e.borders.borders.map(G))},this),this.renderer.clip(e.clip,function(){this.renderer.renderBorders(e.borders.borders)},this),this.renderer.clip(e.backgroundClip,function(){switch(e.node.nodeName){case"svg":case"IFRAME":var f=this.images.get(e.node);f?this.renderer.renderImage(e,n,e.borders,f):N("Error loading <"+e.node.nodeName+">",e.node);break;case"IMG":var o=this.images.get(e.node.src);o?this.renderer.renderImage(e,n,e.borders,o):N("Error loading <img>",e.node.src);break;case"CANVAS":this.renderer.renderImage(e,n,e.borders,{image:e.node});break;case"SELECT":case"INPUT":case"TEXTAREA":this.paintFormValue(e)}},this)},f.prototype.paintCheckbox=function(e){var n=e.parseBounds(),f=Math.min(n.width,n.height),o={width:f-1,height:f-1,top:n.top,left:n.left},d=[3,3],i=[d,d,d,d],l=[1,1,1,1].map(function(e){return{color:new T("#A5A5A5"),width:e}}),u=s(o,i,l);this.renderer.clip(e.backgroundClip,function(){this.renderer.rectangle(o.left+1,o.top+1,o.width-2,o.height-2,new T("#DEDEDE")),this.renderer.renderBorders(t(l,o,u,i)),e.node.checked&&(this.renderer.font(new T("#424242"),"normal","normal","bold",f-3+"px","arial"),this.renderer.text("✔",o.left+f/6,o.top+f-1))},this)},f.prototype.paintRadio=function(e){var n=e.parseBounds(),f=Math.min(n.width,n.height)-2;this.renderer.clip(e.backgroundClip,function(){this.renderer.circleStroke(n.left+1,n.top+1,f,new T("#DEDEDE"),1,new T("#A5A5A5")),e.node.checked&&this.renderer.circle(Math.ceil(n.left+f/4)+1,Math.ceil(n.top+f/4)+1,Math.floor(f/2),new T("#424242"))},this)},f.prototype.paintFormValue=function(e){var n=e.getValue();if(n.length>0){var f=e.node.ownerDocument,o=f.createElement("html2canvaswrapper"),d=["lineHeight","textAlign","fontFamily","fontWeight","fontSize","color","paddingLeft","paddingTop","paddingRight","paddingBottom","width","height","borderLeftStyle","borderTopStyle","borderLeftWidth","borderTopWidth","boxSizing","whiteSpace","wordWrap"];d.forEach(function(n){try{o.style[n]=e.css(n)}catch(f){N("html2canvas: Parse: Exception caught in renderFormValue: "+f.message)}});var i=e.parseBounds();o.style.position="fixed",o.style.left=i.left+"px",o.style.top=i.top+"px",o.textContent=n,f.body.appendChild(o),this.paintText(new Q(o.firstChild,e)),f.body.removeChild(o)}},f.prototype.paintText=function(e){e.applyTextTransform();var n=O.ucs2.decode(e.node.data),f=this.options.letterRendering&&!b(e)||M(e.node.data)?n.map(function(e){return O.ucs2.encode([e])}):K(n),o=e.parent.fontWeight(),d=e.parent.css("fontSize"),i=e.parent.css("fontFamily"),t=e.parent.parseTextShadows();this.renderer.font(e.parent.color("color"),e.parent.css("fontStyle"),e.parent.css("fontVariant"),o,d,i),t.length?this.renderer.fontShadow(t[0].color,t[0].offsetX,t[0].offsetY,t[0].blur):this.renderer.clearShadow(),this.renderer.clip(e.parent.clip,function(){f.map(this.parseTextBounds(e),this).forEach(function(n,o){n&&(this.renderer.text(f[o],n.left,n.bottom),this.renderTextDecoration(e.parent,n,this.fontMetrics.getMetrics(i,d)))},this)},this)},f.prototype.renderTextDecoration=function(e,n,f){switch(e.css("textDecoration").split(" ")[0]){case"underline":this.renderer.rectangle(n.left,Math.round(n.top+f.baseline+f.lineWidth),n.width,1,e.color("color"));break;case"overline":this.renderer.rectangle(n.left,Math.round(n.top),n.width,1,e.color("color"));break;case"line-through":this.renderer.rectangle(n.left,Math.ceil(n.top+f.middle+f.lineWidth),n.width,1,e.color("color"))}};var _={inset:[["darken",.6],["darken",.1],["darken",.1],["darken",.6]]};f.prototype.parseBorders=function(e){var n=e.parseBounds(),f=g(e),o=["Top","Right","Bottom","Left"].map(function(n,f){var o=e.css("border"+n+"Style"),d=e.color("border"+n+"Color");"inset"===o&&d.isBlack()&&(d=new T([255,255,255,d.a]));var i=_[o]?_[o][f]:null;return{width:e.cssInt("border"+n+"Width"),color:i?d[i[0]](i[1]):d,args:null}}),d=s(n,f,o);return{clip:this.parseBackgroundClip(e,d,o,f,n),borders:t(o,n,d,f)}},f.prototype.parseBackgroundClip=function(e,n,f,o,d){var i=e.css("backgroundClip"),t=[];switch(i){case"content-box":case"padding-box":p(t,o[0],o[1],n.topLeftInner,n.topRightInner,d.left+f[3].width,d.top+f[0].width),p(t,o[1],o[2],n.topRightInner,n.bottomRightInner,d.left+d.width-f[1].width,d.top+f[0].width),p(t,o[2],o[3],n.bottomRightInner,n.bottomLeftInner,d.left+d.width-f[1].width,d.top+d.height-f[2].width),p(t,o[3],o[0],n.bottomLeftInner,n.topLeftInner,d.left+f[3].width,d.top+d.height-f[2].width);break;default:p(t,o[0],o[1],n.topLeftOuter,n.topRightOuter,d.left,d.top),p(t,o[1],o[2],n.topRightOuter,n.bottomRightOuter,d.left+d.width,d.top),p(t,o[2],o[3],n.bottomRightOuter,n.bottomLeftOuter,d.left+d.width,d.top+d.height),p(t,o[3],o[0],n.bottomLeftOuter,n.topLeftOuter,d.left,d.top+d.height)}return t},n.exports=f},{"./color":5,"./fontmetrics":9,"./log":15,"./nodecontainer":16,"./promise":18,"./pseudoelementcontainer":21,"./stackingcontext":24,"./textcontainer":28,"./utils":29,punycode:3}],18:[function(e,n){n.exports=e("es6-promise").Promise},{"es6-promise":1}],19:[function(e,n,f){function o(e,n,f){var o="withCredentials"in new XMLHttpRequest;if(!n)return a.reject("No proxy configured");var d=t(o),s=l(n,e,d);return o?p(s):i(f,s,d).then(function(e){return r(e.content)})}function d(e,n,f){var o="crossOrigin"in new Image,d=t(o),s=l(n,e,d);return o?a.resolve(s):i(f,s,d).then(function(e){return"data:"+e.type+";base64,"+e.content})}function i(e,n,f){return new a(function(o,d){var i=e.createElement("script"),t=function(){delete window.html2canvas.proxy[f],e.body.removeChild(i)};window.html2canvas.proxy[f]=function(e){t(),o(e)},i.src=n,i.onerror=function(e){t(),d(e)},e.body.appendChild(i)})}function t(e){return e?"":"html2canvas_"+Date.now()+"_"+ ++v+"_"+Math.round(1e5*Math.random())}function l(e,n,f){return e+"?url="+encodeURIComponent(n)+(f.length?"&callback=html2canvas.proxy."+f:"")}function s(e){return function(n){var f,o=new DOMParser;try{f=o.parseFromString(n,"text/html")}catch(d){y("DOMParser not supported, falling back to createHTMLDocument"),f=document.implementation.createHTMLDocument("");try{f.open(),f.write(n),f.close()}catch(i){y("createHTMLDocument write not supported, falling back to document.body.innerHTML"),f.body.innerHTML=n}}var t=f.querySelector("base");if(!t||!t.href.host){var l=f.createElement("base");l.href=e,f.head.insertBefore(l,f.head.firstChild)}return f}}function u(e,n,f,d,i,t){return new o(e,n,window.document).then(s(e)).then(function(e){return m(e,f,d,i,t,0,0)})}var a=e("./promise"),p=e("./xhr"),c=e("./utils"),y=e("./log"),m=e("./clone"),r=c.decode64,v=0;f.Proxy=o,f.ProxyURL=d,f.loadUrlDocument=u},{"./clone":4,"./log":15,"./promise":18,"./utils":29,"./xhr":31}],20:[function(e,n){function f(e,n){var f=document.createElement("a");f.href=e,e=f.href,this.src=e,this.image=new Image;var i=this;this.promise=new d(function(f,d){i.image.crossOrigin="Anonymous",i.image.onload=f,i.image.onerror=d,new o(e,n,document).then(function(e){i.image.src=e})["catch"](d)})}var o=e("./proxy").ProxyURL,d=e("./promise");n.exports=f},{"./promise":18,"./proxy":19}],21:[function(e,n){function f(e,n,f){o.call(this,e,n),this.isPseudoElement=!0,this.before=":before"===f}var o=e("./nodecontainer");f.prototype.cloneTo=function(e){f.prototype.cloneTo.call(this,e),e.isPseudoElement=!0,e.before=this.before},f.prototype=Object.create(o.prototype),f.prototype.appendToDOM=function(){this.before?this.parent.node.insertBefore(this.node,this.parent.node.firstChild):this.parent.node.appendChild(this.node),this.parent.node.className+=" "+this.getHideClass()},f.prototype.cleanDOM=function(){this.node.parentNode.removeChild(this.node),this.parent.node.className=this.parent.node.className.replace(this.getHideClass(),"")},f.prototype.getHideClass=function(){return this["PSEUDO_HIDE_ELEMENT_CLASS_"+(this.before?"BEFORE":"AFTER")]},f.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE="___html2canvas___pseudoelement_before",f.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER="___html2canvas___pseudoelement_after",n.exports=f},{"./nodecontainer":16}],22:[function(e,n){function f(e,n,f,o,d){this.width=e,this.height=n,this.images=f,this.options=o,this.document=d}var o=e("./log");f.prototype.renderImage=function(e,n,f,o){var d=e.cssInt("paddingLeft"),i=e.cssInt("paddingTop"),t=e.cssInt("paddingRight"),l=e.cssInt("paddingBottom"),s=f.borders,u=n.width-(s[1].width+s[3].width+d+t),a=n.height-(s[0].width+s[2].width+i+l);this.drawImage(o,0,0,o.image.width||u,o.image.height||a,n.left+d+s[3].width,n.top+i+s[0].width,u,a)},f.prototype.renderBackground=function(e,n,f){n.height>0&&n.width>0&&(this.renderBackgroundColor(e,n),this.renderBackgroundImage(e,n,f))},f.prototype.renderBackgroundColor=function(e,n){var f=e.color("backgroundColor");f.isTransparent()||this.rectangle(n.left,n.top,n.width,n.height,f)},f.prototype.renderBorders=function(e){e.forEach(this.renderBorder,this)},f.prototype.renderBorder=function(e){e.color.isTransparent()||null===e.args||this.drawShape(e.args,e.color)},f.prototype.renderBackgroundImage=function(e,n,f){var d=e.parseBackgroundImages();d.reverse().forEach(function(d,i,t){switch(d.method){case"url":var l=this.images.get(d.args[0]);l?this.renderBackgroundRepeating(e,n,l,t.length-(i+1),f):o("Error loading background-image",d.args[0]);break;case"linear-gradient":case"gradient":var s=this.images.get(d.value);s?this.renderBackgroundGradient(s,n,f):o("Error loading background-image",d.args[0]);break;case"none":break;default:o("Unknown background-image type",d.args[0])}},this)},f.prototype.renderBackgroundRepeating=function(e,n,f,o,d){var i=e.parseBackgroundSize(n,f.image,o),t=e.parseBackgroundPosition(n,f.image,o,i),l=e.parseBackgroundRepeat(o);switch(l){case"repeat-x":case"repeat no-repeat":this.backgroundRepeatShape(f,t,i,n,n.left+d[3],n.top+t.top+d[0],99999,i.height,d);break;case"repeat-y":case"no-repeat repeat":this.backgroundRepeatShape(f,t,i,n,n.left+t.left+d[3],n.top+d[0],i.width,99999,d);break;case"no-repeat":this.backgroundRepeatShape(f,t,i,n,n.left+t.left+d[3],n.top+t.top+d[0],i.width,i.height,d);break;default:this.renderBackgroundRepeat(f,t,i,{top:n.top,left:n.left},d[3],d[0])}},n.exports=f},{"./log":15}],23:[function(e,n){function f(e,n){d.apply(this,arguments),this.canvas=this.options.canvas||this.document.createElement("canvas"),this.options.canvas||(this.canvas.width=e,this.canvas.height=n),this.ctx=this.canvas.getContext("2d"),this.taintCtx=this.document.createElement("canvas").getContext("2d"),this.ctx.textBaseline="bottom",this.variables={},t("Initialized CanvasRenderer with size",e,"x",n)}function o(e){return e.length>0}var d=e("../renderer"),i=e("../lineargradientcontainer"),t=e("../log");f.prototype=Object.create(d.prototype),f.prototype.setFillStyle=function(e){return this.ctx.fillStyle="object"==typeof e&&e.isColor?e.toString():e,this.ctx},f.prototype.rectangle=function(e,n,f,o,d){this.setFillStyle(d).fillRect(e,n,f,o)},f.prototype.circle=function(e,n,f,o){this.setFillStyle(o),this.ctx.beginPath(),this.ctx.arc(e+f/2,n+f/2,f/2,0,2*Math.PI,!0),this.ctx.closePath(),this.ctx.fill()},f.prototype.circleStroke=function(e,n,f,o,d,i){this.circle(e,n,f,o),this.ctx.strokeStyle=i.toString(),this.ctx.stroke()},f.prototype.drawShape=function(e,n){this.shape(e),this.setFillStyle(n).fill()},f.prototype.taints=function(e){if(null===e.tainted){this.taintCtx.drawImage(e.image,0,0);try{this.taintCtx.getImageData(0,0,1,1),e.tainted=!1}catch(n){this.taintCtx=document.createElement("canvas").getContext("2d"),e.tainted=!0}}return e.tainted},f.prototype.drawImage=function(e,n,f,o,d,i,t,l,s){(!this.taints(e)||this.options.allowTaint)&&this.ctx.drawImage(e.image,n,f,o,d,i,t,l,s)},f.prototype.clip=function(e,n,f){this.ctx.save(),e.filter(o).forEach(function(e){this.shape(e).clip()},this),n.call(f),this.ctx.restore()},f.prototype.shape=function(e){return this.ctx.beginPath(),e.forEach(function(e,n){"rect"===e[0]?this.ctx.rect.apply(this.ctx,e.slice(1)):this.ctx[0===n?"moveTo":e[0]+"To"].apply(this.ctx,e.slice(1))},this),this.ctx.closePath(),this.ctx},f.prototype.font=function(e,n,f,o,d,i){this.setFillStyle(e).font=[n,f,o,d,i].join(" ").split(",")[0]},f.prototype.fontShadow=function(e,n,f,o){this.setVariable("shadowColor",e.toString()).setVariable("shadowOffsetY",n).setVariable("shadowOffsetX",f).setVariable("shadowBlur",o)},f.prototype.clearShadow=function(){this.setVariable("shadowColor","rgba(0,0,0,0)")},f.prototype.setOpacity=function(e){this.ctx.globalAlpha=e},f.prototype.setTransform=function(e){this.ctx.translate(e.origin[0],e.origin[1]),this.ctx.transform.apply(this.ctx,e.matrix),this.ctx.translate(-e.origin[0],-e.origin[1])},f.prototype.setVariable=function(e,n){return this.variables[e]!==n&&(this.variables[e]=this.ctx[e]=n),this},f.prototype.text=function(e,n,f){this.ctx.fillText(e,n,f)},f.prototype.backgroundRepeatShape=function(e,n,f,o,d,i,t,l,s){var u=[["line",Math.round(d),Math.round(i)],["line",Math.round(d+t),Math.round(i)],["line",Math.round(d+t),Math.round(l+i)],["line",Math.round(d),Math.round(l+i)]];this.clip([u],function(){this.renderBackgroundRepeat(e,n,f,o,s[3],s[0])},this)},f.prototype.renderBackgroundRepeat=function(e,n,f,o,d,i){var t=Math.round(o.left+n.left+d),l=Math.round(o.top+n.top+i);this.setFillStyle(this.ctx.createPattern(this.resizeImage(e,f),"repeat")),this.ctx.translate(t,l),this.ctx.fill(),this.ctx.translate(-t,-l)},f.prototype.renderBackgroundGradient=function(e,n){if(e instanceof i){var f=this.ctx.createLinearGradient(n.left+n.width*e.x0,n.top+n.height*e.y0,n.left+n.width*e.x1,n.top+n.height*e.y1);e.colorStops.forEach(function(e){f.addColorStop(e.stop,e.color.toString())}),this.rectangle(n.left,n.top,n.width,n.height,f)}},f.prototype.resizeImage=function(e,n){var f=e.image;if(f.width===n.width&&f.height===n.height)return f;var o,d=document.createElement("canvas");return d.width=n.width,d.height=n.height,o=d.getContext("2d"),o.drawImage(f,0,0,f.width,f.height,0,0,n.width,n.height),d},n.exports=f},{"../lineargradientcontainer":14,"../log":15,"../renderer":22}],24:[function(e,n){function f(e,n,f,d){o.call(this,f,d),this.ownStacking=e,this.contexts=[],this.children=[],this.opacity=(this.parent?this.parent.stack.opacity:1)*n}var o=e("./nodecontainer");f.prototype=Object.create(o.prototype),f.prototype.getParentStack=function(e){var n=this.parent?this.parent.stack:null;return n?n.ownStacking?n:n.getParentStack(e):e.stack},n.exports=f},{"./nodecontainer":16}],25:[function(e,n){function f(e){this.rangeBounds=this.testRangeBounds(e),this.cors=this.testCORS(),this.svg=this.testSVG()}f.prototype.testRangeBounds=function(e){var n,f,o,d,i=!1;return e.createRange&&(n=e.createRange(),n.getBoundingClientRect&&(f=e.createElement("boundtest"),f.style.height="123px",f.style.display="block",e.body.appendChild(f),n.selectNode(f),o=n.getBoundingClientRect(),d=o.height,123===d&&(i=!0),e.body.removeChild(f))),i},f.prototype.testCORS=function(){return"undefined"!=typeof(new Image).crossOrigin},f.prototype.testSVG=function(){var e=new Image,n=document.createElement("canvas"),f=n.getContext("2d");e.src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";try{f.drawImage(e,0,0),n.toDataURL()}catch(o){return!1}return!0},n.exports=f},{}],26:[function(e,n){function f(e){this.src=e,this.image=null;var n=this;this.promise=this.hasFabric().then(function(){return n.isInline(e)?o.resolve(n.inlineFormatting(e)):d(e)}).then(function(e){return new o(function(f){window.html2canvas.svg.fabric.loadSVGFromString(e,n.createCanvas.call(n,f))})})}var o=e("./promise"),d=e("./xhr"),i=e("./utils").decode64;f.prototype.hasFabric=function(){return window.html2canvas.svg&&window.html2canvas.svg.fabric?o.resolve():o.reject(new Error("html2canvas.svg.js is not loaded, cannot render svg"))},f.prototype.inlineFormatting=function(e){return/^data:image\/svg\+xml;base64,/.test(e)?this.decode64(this.removeContentType(e)):this.removeContentType(e)},f.prototype.removeContentType=function(e){return e.replace(/^data:image\/svg\+xml(;base64)?,/,"")},f.prototype.isInline=function(e){return/^data:image\/svg\+xml/i.test(e)},f.prototype.createCanvas=function(e){var n=this;return function(f,o){var d=new window.html2canvas.svg.fabric.StaticCanvas("c");n.image=d.lowerCanvasEl,d.setWidth(o.width).setHeight(o.height).add(window.html2canvas.svg.fabric.util.groupSVGElements(f,o)).renderAll(),e(d.lowerCanvasEl)}},f.prototype.decode64=function(e){return"function"==typeof window.atob?window.atob(e):i(e)
},n.exports=f},{"./promise":18,"./utils":29,"./xhr":31}],27:[function(e,n){function f(e,n){this.src=e,this.image=null;var f=this;this.promise=n?new d(function(n,o){f.image=new Image,f.image.onload=n,f.image.onerror=o,f.image.src="data:image/svg+xml,"+(new XMLSerializer).serializeToString(e),f.image.complete===!0&&n(f.image)}):this.hasFabric().then(function(){return new d(function(n){window.html2canvas.svg.fabric.parseSVGDocument(e,f.createCanvas.call(f,n))})})}var o=e("./svgcontainer"),d=e("./promise");f.prototype=Object.create(o.prototype),n.exports=f},{"./promise":18,"./svgcontainer":26}],28:[function(e,n){function f(e,n){d.call(this,e,n)}function o(e,n,f){return e.length>0?n+f.toUpperCase():void 0}var d=e("./nodecontainer");f.prototype=Object.create(d.prototype),f.prototype.applyTextTransform=function(){this.node.data=this.transform(this.parent.css("textTransform"))},f.prototype.transform=function(e){var n=this.node.data;switch(e){case"lowercase":return n.toLowerCase();case"capitalize":return n.replace(/(^|\s|:|-|\(|\))([a-z])/g,o);case"uppercase":return n.toUpperCase();default:return n}},n.exports=f},{"./nodecontainer":16}],29:[function(e,n,f){f.smallImage=function(){return"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"},f.bind=function(e,n){return function(){return e.apply(n,arguments)}},f.decode64=function(e){var n,f,o,d,i,t,l,s,u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=e.length,p="";for(n=0;a>n;n+=4)f=u.indexOf(e[n]),o=u.indexOf(e[n+1]),d=u.indexOf(e[n+2]),i=u.indexOf(e[n+3]),t=f<<2|o>>4,l=(15&o)<<4|d>>2,s=(3&d)<<6|i,p+=64===d?String.fromCharCode(t):64===i||-1===i?String.fromCharCode(t,l):String.fromCharCode(t,l,s);return p},f.getBounds=function(e){if(e.getBoundingClientRect){var n=e.getBoundingClientRect(),f=null==e.offsetWidth?n.width:e.offsetWidth;return{top:n.top,bottom:n.bottom||n.top+n.height,right:n.left+f,left:n.left,width:f,height:null==e.offsetHeight?n.height:e.offsetHeight}}return{}},f.offsetBounds=function(e){var n=e.offsetParent?f.offsetBounds(e.offsetParent):{top:0,left:0};return{top:e.offsetTop+n.top,bottom:e.offsetTop+e.offsetHeight+n.top,right:e.offsetLeft+n.left+e.offsetWidth,left:e.offsetLeft+n.left,width:e.offsetWidth,height:e.offsetHeight}},f.parseBackgrounds=function(e){var n,f,o,d,i,t,l,s=" \r\n	",u=[],a=0,p=0,c=function(){n&&('"'===f.substr(0,1)&&(f=f.substr(1,f.length-2)),f&&l.push(f),"-"===n.substr(0,1)&&(d=n.indexOf("-",1)+1)>0&&(o=n.substr(0,d),n=n.substr(d)),u.push({prefix:o,method:n.toLowerCase(),value:i,args:l,image:null})),l=[],n=o=f=i=""};return l=[],n=o=f=i="",e.split("").forEach(function(e){if(!(0===a&&s.indexOf(e)>-1)){switch(e){case'"':t?t===e&&(t=null):t=e;break;case"(":if(t)break;if(0===a)return a=1,void(i+=e);p++;break;case")":if(t)break;if(1===a){if(0===p)return a=0,i+=e,void c();p--}break;case",":if(t)break;if(0===a)return void c();if(1===a&&0===p&&!n.match(/^url$/i))return l.push(f),f="",void(i+=e)}i+=e,0===a?n+=e:f+=e}}),c(),u}},{}],30:[function(e,n){function f(e){o.apply(this,arguments),this.type="linear"===e.args[0]?this.TYPES.LINEAR:this.TYPES.RADIAL}var o=e("./gradientcontainer");f.prototype=Object.create(o.prototype),n.exports=f},{"./gradientcontainer":11}],31:[function(e,n){function f(e){return new o(function(n,f){var o=new XMLHttpRequest;o.open("GET",e),o.onload=function(){200===o.status?n(o.responseText):f(new Error(o.statusText))},o.onerror=function(){f(new Error("Network Error"))},o.send()})}var o=e("./promise");n.exports=f},{"./promise":18}]},{},[6])(6)});;
/*!
 * Color Thief v2.0
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * License
 * -------
 * Copyright 2011, 2015 Lokesh Dhakar
 * Released under the MIT license
 * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
 *
 */


/*
  CanvasImage Class
  Class that wraps the html image element and canvas.
  It also simplifies some of the canvas context manipulation
  with a set of helper functions.
*/
var CanvasImage = function (image) {
    this.canvas  = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    this.width  = this.canvas.width  = image.width;
    this.height = this.canvas.height = image.height;

    this.context.drawImage(image, 0, 0, this.width, this.height);
};

CanvasImage.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
};

CanvasImage.prototype.update = function (imageData) {
    this.context.putImageData(imageData, 0, 0);
};

CanvasImage.prototype.getPixelCount = function () {
    return this.width * this.height;
};

CanvasImage.prototype.getImageData = function () {
    return this.context.getImageData(0, 0, this.width, this.height);
};

CanvasImage.prototype.removeCanvas = function () {
    this.canvas.parentNode.removeChild(this.canvas);
};


var ColorThief = function () {};

/*
 * getColor(sourceImage[, quality])
 * returns {r: num, g: num, b: num}
 *
 * Use the median cut algorithm provided by quantize.js to cluster similar
 * colors and return the base color from the largest cluster.
 *
 * Quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
 * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
 * faster a color will be returned but the greater the likelihood that it will not be the visually
 * most dominant color.
 *
 * */
ColorThief.prototype.getColor = function(sourceImage, quality) {
    var palette       = this.getPalette(sourceImage, 5, quality);
    var dominantColor = palette[0];
    return dominantColor;
};


/*
 * getPalette(sourceImage[, colorCount, quality])
 * returns array[ {r: num, g: num, b: num}, {r: num, g: num, b: num}, ...]
 *
 * Use the median cut algorithm provided by quantize.js to cluster similar colors.
 *
 * colorCount determines the size of the palette; the number of colors returned. If not set, it
 * defaults to 10.
 *
 * BUGGY: Function does not always return the requested amount of colors. It can be +/- 2.
 *
 * quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
 * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
 * faster the palette generation but the greater the likelihood that colors will be missed.
 *
 *
 */
ColorThief.prototype.getPalette = function(sourceImage, colorCount, quality) {

    if (typeof colorCount === 'undefined') {
        colorCount = 10;
    }
    if (typeof quality === 'undefined' || quality < 1) {
        quality = 10;
    }

    // Create custom CanvasImage object
    var image      = new CanvasImage(sourceImage);
    var imageData  = image.getImageData();
    var pixels     = imageData.data;
    var pixelCount = image.getPixelCount();

    // Store the RGB values in an array format suitable for quantize function
    var pixelArray = [];
    for (var i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
        offset = i * 4;
        r = pixels[offset + 0];
        g = pixels[offset + 1];
        b = pixels[offset + 2];
        a = pixels[offset + 3];
        // If pixel is mostly opaque and not white
        if (a >= 125) {
            if (!(r > 250 && g > 250 && b > 250)) {
                pixelArray.push([r, g, b]);
            }
        }
    }

    // Send array to quantize function which clusters values
    // using median cut algorithm
    var cmap    = MMCQ.quantize(pixelArray, colorCount);
    var palette = cmap? cmap.palette() : null;

    // Clean up
    image.removeCanvas();

    return palette;
};




/*!
 * quantize.js Copyright 2008 Nick Rabinowitz.
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

// fill out a couple protovis dependencies
/*!
 * Block below copied from Protovis: http://mbostock.github.com/protovis/
 * Copyright 2010 Stanford Visualization Group
 * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
 */
if (!pv) {
    var pv = {
        map: function(array, f) {
          var o = {};
          return f ? array.map(function(d, i) { o.index = i; return f.call(o, d); }) : array.slice();
        },
        naturalOrder: function(a, b) {
            return (a < b) ? -1 : ((a > b) ? 1 : 0);
        },
        sum: function(array, f) {
          var o = {};
          return array.reduce(f ? function(p, d, i) { o.index = i; return p + f.call(o, d); } : function(p, d) { return p + d; }, 0);
        },
        max: function(array, f) {
          return Math.max.apply(null, f ? pv.map(array, f) : array);
        }
    };
}



/**
 * Basic Javascript port of the MMCQ (modified median cut quantization)
 * algorithm from the Leptonica library (http://www.leptonica.com/).
 * Returns a color map you can use to map original pixels to the reduced
 * palette. Still a work in progress.
 *
 * @author Nick Rabinowitz
 * @example

// array of pixels as [R,G,B] arrays
var myPixels = [[190,197,190], [202,204,200], [207,214,210], [211,214,211], [205,207,207]
                // etc
                ];
var maxColors = 4;

var cmap = MMCQ.quantize(myPixels, maxColors);
var newPalette = cmap.palette();
var newPixels = myPixels.map(function(p) {
    return cmap.map(p);
});

 */
var MMCQ = (function() {
    // private constants
    var sigbits = 5,
        rshift = 8 - sigbits,
        maxIterations = 1000,
        fractByPopulations = 0.75;

    // get reduced-space color index for a pixel
    function getColorIndex(r, g, b) {
        return (r << (2 * sigbits)) + (g << sigbits) + b;
    }

    // Simple priority queue
    function PQueue(comparator) {
        var contents = [],
            sorted = false;

        function sort() {
            contents.sort(comparator);
            sorted = true;
        }

        return {
            push: function(o) {
                contents.push(o);
                sorted = false;
            },
            peek: function(index) {
                if (!sorted) sort();
                if (index===undefined) index = contents.length - 1;
                return contents[index];
            },
            pop: function() {
                if (!sorted) sort();
                return contents.pop();
            },
            size: function() {
                return contents.length;
            },
            map: function(f) {
                return contents.map(f);
            },
            debug: function() {
                if (!sorted) sort();
                return contents;
            }
        };
    }

    // 3d color space box
    function VBox(r1, r2, g1, g2, b1, b2, histo) {
        var vbox = this;
        vbox.r1 = r1;
        vbox.r2 = r2;
        vbox.g1 = g1;
        vbox.g2 = g2;
        vbox.b1 = b1;
        vbox.b2 = b2;
        vbox.histo = histo;
    }
    VBox.prototype = {
        volume: function(force) {
            var vbox = this;
            if (!vbox._volume || force) {
                vbox._volume = ((vbox.r2 - vbox.r1 + 1) * (vbox.g2 - vbox.g1 + 1) * (vbox.b2 - vbox.b1 + 1));
            }
            return vbox._volume;
        },
        count: function(force) {
            var vbox = this,
                histo = vbox.histo;
            if (!vbox._count_set || force) {
                var npix = 0,
                    i, j, k;
                for (i = vbox.r1; i <= vbox.r2; i++) {
                    for (j = vbox.g1; j <= vbox.g2; j++) {
                        for (k = vbox.b1; k <= vbox.b2; k++) {
                             index = getColorIndex(i,j,k);
                             npix += (histo[index] || 0);
                        }
                    }
                }
                vbox._count = npix;
                vbox._count_set = true;
            }
            return vbox._count;
        },
        copy: function() {
            var vbox = this;
            return new VBox(vbox.r1, vbox.r2, vbox.g1, vbox.g2, vbox.b1, vbox.b2, vbox.histo);
        },
        avg: function(force) {
            var vbox = this,
                histo = vbox.histo;
            if (!vbox._avg || force) {
                var ntot = 0,
                    mult = 1 << (8 - sigbits),
                    rsum = 0,
                    gsum = 0,
                    bsum = 0,
                    hval,
                    i, j, k, histoindex;
                for (i = vbox.r1; i <= vbox.r2; i++) {
                    for (j = vbox.g1; j <= vbox.g2; j++) {
                        for (k = vbox.b1; k <= vbox.b2; k++) {
                             histoindex = getColorIndex(i,j,k);
                             hval = histo[histoindex] || 0;
                             ntot += hval;
                             rsum += (hval * (i + 0.5) * mult);
                             gsum += (hval * (j + 0.5) * mult);
                             bsum += (hval * (k + 0.5) * mult);
                        }
                    }
                }
                if (ntot) {
                    vbox._avg = [~~(rsum/ntot), ~~(gsum/ntot), ~~(bsum/ntot)];
                } else {
//                    console.log('empty box');
                    vbox._avg = [
                        ~~(mult * (vbox.r1 + vbox.r2 + 1) / 2),
                        ~~(mult * (vbox.g1 + vbox.g2 + 1) / 2),
                        ~~(mult * (vbox.b1 + vbox.b2 + 1) / 2)
                    ];
                }
            }
            return vbox._avg;
        },
        contains: function(pixel) {
            var vbox = this,
                rval = pixel[0] >> rshift;
                gval = pixel[1] >> rshift;
                bval = pixel[2] >> rshift;
            return (rval >= vbox.r1 && rval <= vbox.r2 &&
                    gval >= vbox.g1 && gval <= vbox.g2 &&
                    bval >= vbox.b1 && bval <= vbox.b2);
        }
    };

    // Color map
    function CMap() {
        this.vboxes = new PQueue(function(a,b) {
            return pv.naturalOrder(
                a.vbox.count()*a.vbox.volume(),
                b.vbox.count()*b.vbox.volume()
            );
        });
    }
    CMap.prototype = {
        push: function(vbox) {
            this.vboxes.push({
                vbox: vbox,
                color: vbox.avg()
            });
        },
        palette: function() {
            return this.vboxes.map(function(vb) { return vb.color; });
        },
        size: function() {
            return this.vboxes.size();
        },
        map: function(color) {
            var vboxes = this.vboxes;
            for (var i=0; i<vboxes.size(); i++) {
                if (vboxes.peek(i).vbox.contains(color)) {
                    return vboxes.peek(i).color;
                }
            }
            return this.nearest(color);
        },
        nearest: function(color) {
            var vboxes = this.vboxes,
                d1, d2, pColor;
            for (var i=0; i<vboxes.size(); i++) {
                d2 = Math.sqrt(
                    Math.pow(color[0] - vboxes.peek(i).color[0], 2) +
                    Math.pow(color[1] - vboxes.peek(i).color[1], 2) +
                    Math.pow(color[2] - vboxes.peek(i).color[2], 2)
                );
                if (d2 < d1 || d1 === undefined) {
                    d1 = d2;
                    pColor = vboxes.peek(i).color;
                }
            }
            return pColor;
        },
        forcebw: function() {
            // XXX: won't  work yet
            var vboxes = this.vboxes;
            vboxes.sort(function(a,b) { return pv.naturalOrder(pv.sum(a.color), pv.sum(b.color));});

            // force darkest color to black if everything < 5
            var lowest = vboxes[0].color;
            if (lowest[0] < 5 && lowest[1] < 5 && lowest[2] < 5)
                vboxes[0].color = [0,0,0];

            // force lightest color to white if everything > 251
            var idx = vboxes.length-1,
                highest = vboxes[idx].color;
            if (highest[0] > 251 && highest[1] > 251 && highest[2] > 251)
                vboxes[idx].color = [255,255,255];
        }
    };

    // histo (1-d array, giving the number of pixels in
    // each quantized region of color space), or null on error
    function getHisto(pixels) {
        var histosize = 1 << (3 * sigbits),
            histo = new Array(histosize),
            index, rval, gval, bval;
        pixels.forEach(function(pixel) {
            rval = pixel[0] >> rshift;
            gval = pixel[1] >> rshift;
            bval = pixel[2] >> rshift;
            index = getColorIndex(rval, gval, bval);
            histo[index] = (histo[index] || 0) + 1;
        });
        return histo;
    }

    function vboxFromPixels(pixels, histo) {
        var rmin=1000000, rmax=0,
            gmin=1000000, gmax=0,
            bmin=1000000, bmax=0,
            rval, gval, bval;
        // find min/max
        pixels.forEach(function(pixel) {
            rval = pixel[0] >> rshift;
            gval = pixel[1] >> rshift;
            bval = pixel[2] >> rshift;
            if (rval < rmin) rmin = rval;
            else if (rval > rmax) rmax = rval;
            if (gval < gmin) gmin = gval;
            else if (gval > gmax) gmax = gval;
            if (bval < bmin) bmin = bval;
            else if (bval > bmax)  bmax = bval;
        });
        return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);
    }

    function medianCutApply(histo, vbox) {
        if (!vbox.count()) return;

        var rw = vbox.r2 - vbox.r1 + 1,
            gw = vbox.g2 - vbox.g1 + 1,
            bw = vbox.b2 - vbox.b1 + 1,
            maxw = pv.max([rw, gw, bw]);
        // only one pixel, no split
        if (vbox.count() == 1) {
            return [vbox.copy()];
        }
        /* Find the partial sum arrays along the selected axis. */
        var total = 0,
            partialsum = [],
            lookaheadsum = [],
            i, j, k, sum, index;
        if (maxw == rw) {
            for (i = vbox.r1; i <= vbox.r2; i++) {
                sum = 0;
                for (j = vbox.g1; j <= vbox.g2; j++) {
                    for (k = vbox.b1; k <= vbox.b2; k++) {
                        index = getColorIndex(i,j,k);
                        sum += (histo[index] || 0);
                    }
                }
                total += sum;
                partialsum[i] = total;
            }
        }
        else if (maxw == gw) {
            for (i = vbox.g1; i <= vbox.g2; i++) {
                sum = 0;
                for (j = vbox.r1; j <= vbox.r2; j++) {
                    for (k = vbox.b1; k <= vbox.b2; k++) {
                        index = getColorIndex(j,i,k);
                        sum += (histo[index] || 0);
                    }
                }
                total += sum;
                partialsum[i] = total;
            }
        }
        else {  /* maxw == bw */
            for (i = vbox.b1; i <= vbox.b2; i++) {
                sum = 0;
                for (j = vbox.r1; j <= vbox.r2; j++) {
                    for (k = vbox.g1; k <= vbox.g2; k++) {
                        index = getColorIndex(j,k,i);
                        sum += (histo[index] || 0);
                    }
                }
                total += sum;
                partialsum[i] = total;
            }
        }
        partialsum.forEach(function(d,i) {
            lookaheadsum[i] = total-d;
        });
        function doCut(color) {
            var dim1 = color + '1',
                dim2 = color + '2',
                left, right, vbox1, vbox2, d2, count2=0;
            for (i = vbox[dim1]; i <= vbox[dim2]; i++) {
                if (partialsum[i] > total / 2) {
                    vbox1 = vbox.copy();
                    vbox2 = vbox.copy();
                    left = i - vbox[dim1];
                    right = vbox[dim2] - i;
                    if (left <= right)
                        d2 = Math.min(vbox[dim2] - 1, ~~(i + right / 2));
                    else d2 = Math.max(vbox[dim1], ~~(i - 1 - left / 2));
                    // avoid 0-count boxes
                    while (!partialsum[d2]) d2++;
                    count2 = lookaheadsum[d2];
                    while (!count2 && partialsum[d2-1]) count2 = lookaheadsum[--d2];
                    // set dimensions
                    vbox1[dim2] = d2;
                    vbox2[dim1] = vbox1[dim2] + 1;
//                    console.log('vbox counts:', vbox.count(), vbox1.count(), vbox2.count());
                    return [vbox1, vbox2];
                }
            }

        }
        // determine the cut planes
        return maxw == rw ? doCut('r') :
            maxw == gw ? doCut('g') :
            doCut('b');
    }

    function quantize(pixels, maxcolors) {
        // short-circuit
        if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
//            console.log('wrong number of maxcolors');
            return false;
        }

        // XXX: check color content and convert to grayscale if insufficient

        var histo = getHisto(pixels),
            histosize = 1 << (3 * sigbits);

        // check that we aren't below maxcolors already
        var nColors = 0;
        histo.forEach(function() { nColors++; });
        if (nColors <= maxcolors) {
            // XXX: generate the new colors from the histo and return
        }

        // get the beginning vbox from the colors
        var vbox = vboxFromPixels(pixels, histo),
            pq = new PQueue(function(a,b) { return pv.naturalOrder(a.count(), b.count()); });
        pq.push(vbox);

        // inner function to do the iteration
        function iter(lh, target) {
            var ncolors = 1,
                niters = 0,
                vbox;
            while (niters < maxIterations) {
                vbox = lh.pop();
                if (!vbox.count())  { /* just put it back */
                    lh.push(vbox);
                    niters++;
                    continue;
                }
                // do the cut
                var vboxes = medianCutApply(histo, vbox),
                    vbox1 = vboxes[0],
                    vbox2 = vboxes[1];

                if (!vbox1) {
//                    console.log("vbox1 not defined; shouldn't happen!");
                    return;
                }
                lh.push(vbox1);
                if (vbox2) {  /* vbox2 can be null */
                    lh.push(vbox2);
                    ncolors++;
                }
                if (ncolors >= target) return;
                if (niters++ > maxIterations) {
//                    console.log("infinite loop; perhaps too few pixels!");
                    return;
                }
            }
        }

        // first set of colors, sorted by population
        iter(pq, fractByPopulations * maxcolors);

        // Re-sort by the product of pixel occupancy times the size in color space.
        var pq2 = new PQueue(function(a,b) {
            return pv.naturalOrder(a.count()*a.volume(), b.count()*b.volume());
        });
        while (pq.size()) {
            pq2.push(pq.pop());
        }

        // next set - generate the median cuts using the (npix * vol) sorting.
        iter(pq2, maxcolors - pq2.size());

        // calculate the actual colors
        var cmap = new CMap();
        while (pq2.size()) {
            cmap.push(pq2.pop());
        }

        return cmap;
    }

    return {
        quantize: quantize
    };
})();
;
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
