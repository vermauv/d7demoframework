<?php
/**
 * @file
 * dfs_med_slideshow.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function dfs_med_slideshow_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "panelizer" && $api == "panelizer") {
    return array("version" => "1");
  }
  if ($module == "strongarm" && $api == "strongarm") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_views_api().
 */
function dfs_med_slideshow_views_api($module = NULL, $api = NULL) {
  return array("api" => "3.0");
}

/**
 * Implements hook_image_default_styles().
 */
function dfs_med_slideshow_image_default_styles() {
  $styles = array();

  // Exported image style: home-slide.
  $styles['home-slide'] = array(
    'label' => 'home-slide',
    'effects' => array(
      8 => array(
        'name' => 'focal_point_scale_and_crop',
        'data' => array(
          'width' => 1200,
          'height' => 470,
          '#imageinfo_cache_effect_callback' => 'focal_point_scale_and_crop_effect',
        ),
        'weight' => 2,
      ),
      9 => array(
        'name' => 'image_scale_and_crop',
        'data' => array(
          'width' => 1200,
          'height' => 470,
        ),
        'weight' => 2,
      ),
    ),
  );

  return $styles;
}

/**
 * Implements hook_node_info().
 */
function dfs_med_slideshow_node_info() {
  $items = array(
    'slideshow_slide' => array(
      'name' => t('Slideshow Slide'),
      'base' => 'node_content',
      'description' => t('Add a slide to the homepage slideshow.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
