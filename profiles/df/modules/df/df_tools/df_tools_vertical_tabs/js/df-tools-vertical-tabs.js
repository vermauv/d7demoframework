/**
 * @file
 * Responsive Vertical Tabs
 */
(function($) {

    "use strict";

    /**
     * Remove the size attibut to make text fields respect CSS sizes
     */
    $('input[size]', 'div.vertical-tabs-panes').removeAttr('size');

    $(document).ready(function() {
        $(".form-actions").appendTo($(".vertical-tabs-panes"));
    });

}(jQuery));

document.addEventListener('click', $, false);