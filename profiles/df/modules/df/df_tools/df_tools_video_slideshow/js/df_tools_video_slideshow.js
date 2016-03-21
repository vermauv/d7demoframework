(function ($, Drupal) {

    Drupal.behaviors.df_video_slideshow = {
        attach: function(context, settings) {
            // Get pager item width
            selector = ".widget_pager_bottom_wrapper > .widget_pager_bottom";
            first_child = $(selector).children()[0];
            pager_width = $(first_child).outerWidth(true);
            $(".views-slideshow-pager-next").click(function(){
                pager = $(selector);
                // Do nothing if the pager is already being animated or if there's no other children
                if (pager.is(':animated')) {
                    return;
                }
                left = parseInt(pager.css('left'), 10);
                // Calculate the minimum left value
                min_left = (pager.children().length-1) * -pager_width;
                // Check if we've reached the end of the list
                if (left-pager_width > min_left) {
                    pager.animate({"left":"-=" + pager_width});
                }
                else {
                    pager.animate({"left":min_left});
                }
            });
            $(".views-slideshow-pager-previous").click(function(){
                pager = $(selector);
                // Do nothing if the pager is already being animated
                if (pager.is(':animated')) {
                    return;
                }
                left = parseInt(pager.css('left'), 10);
                // Check to see if we're not too close to the start of the pager
                if (left+pager_width < 0) {
                    pager.animate({"left":"+=" + pager_width});
                }
                else {
                    pager.animate({"left":"0"});
                }
            });
        }
    };

})(jQuery, Drupal);
