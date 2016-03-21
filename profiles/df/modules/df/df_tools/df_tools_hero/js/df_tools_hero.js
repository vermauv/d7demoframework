/**
 * @file
 * Contains all javascript logic for df_tools_hero.
 */

(function ($, Drupal) {

  // Autoplay hero videos.
  Drupal.behaviors.DFToolsHero = {
    attach: function (context) {
      // Chrome fix for autoplay support.
      var video = $('.hero .field-name-field-hero-image video')[0];
      if (video) {
        video.addEventListener('loadeddata', function () {
          this.play();
        }, false);
      }
    }
  };

})(jQuery, Drupal);
