(function ($, Drupal) {

  Drupal.behaviors.bbc = {
    attach: function(context, settings) {
    	$(window).bind('resize', function() {
        $('.views-slideshow-cycle-main-frame').height(
        $('.views-slideshow-cycle-main-frame').children().height()
       );
     });
    
  	$(window).bind('resize', function() {
				$('.collection-meta').height(
				$('.collection-hero-image').height()
  			);
		});
    
    var $menuClone = $("#main-menu").clone();
      $menuClone.attr( "id", "main-mobile-menu" );
      $menuClone.mmenu({
           classes: "mm-light mm-zoom-panels",
           counters  : true,
           slidingSubmenus: false,
           offCanvas: {
               position  : "right",
               zposition : "next",
            },
            header: {
                add     : true,
                update    : true,
                title   : "Genres"
              }
      });

//some bug in mmenus is causing these to be hidden even when clicked, this solves that
      $("#main-mobile-menu ul li ul").css("display", "");
      $("#main-mobile-menu ul li ul").css("visibility","visible");
  

//remove all the nice menus classes from the cloned menu
    $("#main-mobile-menu>ul").removeClass (function (index, css) {
    return (css.match (/\bnice-\S+/g) || []).join(' ');
});



	}
  };

})(jQuery, Drupal);


