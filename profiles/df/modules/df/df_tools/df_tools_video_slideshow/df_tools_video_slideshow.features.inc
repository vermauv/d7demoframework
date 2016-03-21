<?php
/**
 * @file
 * df_tools_video_slideshow.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function df_tools_video_slideshow_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "strongarm" && $api == "strongarm") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_views_api().
 */
function df_tools_video_slideshow_views_api($module = NULL, $api = NULL) {
  return array("api" => "3.0");
}

/**
 * Implements hook_node_info().
 */
function df_tools_video_slideshow_node_info() {
  $items = array(
    'video_slide' => array(
      'name' => t('Video Slide'),
      'base' => 'node_content',
      'description' => t('A Video Slide, which will automatically be displayed in the Video Slideshow.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
