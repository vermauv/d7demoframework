<?php
/**
 * @file
 * dfs_wem.features.inc
 */

/**
 * Implements hook_default_collection().
 */
function dfs_wem_default_collection() {
  $items = array();
  $items['wem_munich_calling'] = entity_import('collection', '{
    "name" : "wem_munich_calling",
    "label" : "Munich Calling",
    "rdf_mapping" : [],
    "entity_type" : "collection"
  }');
  return $items;
}

/**
 * Implements hook_ctools_plugin_api().
 */
function dfs_wem_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "field_group" && $api == "field_group") {
    return array("version" => "1");
  }
  if ($module == "page_manager" && $api == "pages_default") {
    return array("version" => "1");
  }
  if ($module == "panelizer" && $api == "panelizer") {
    return array("version" => "1");
  }
  if ($module == "panels" && $api == "layouts") {
    return array("version" => "1");
  }
  if ($module == "strongarm" && $api == "strongarm") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_views_api().
 */
function dfs_wem_views_api($module = NULL, $api = NULL) {
  return array("api" => "3.0");
}

/**
 * Implements hook_image_default_styles().
 */
function dfs_wem_image_default_styles() {
  $styles = array();

  // Exported image style: wem-user-tiny.
  $styles['wem-user-tiny'] = array(
    'name' => 'wem-user-tiny',
    'label' => 'wem-user-tiny',
    'effects' => array(
      1 => array(
        'label' => 'Scale and crop',
        'help' => 'Scale and crop will maintain the aspect-ratio of the original image, then crop the larger dimension. This is most useful for creating perfectly square thumbnails without stretching the image.',
        'effect callback' => 'imageinfo_cache_effect_router',
        'dimensions callback' => 'image_resize_dimensions',
        'form callback' => 'image_resize_form',
        'summary theme' => 'image_resize_summary',
        'module' => 'image',
        'name' => 'image_scale_and_crop',
        'data' => array(
          'width' => 40,
          'height' => 40,
          '#imageinfo_cache_effect_callback' => 'imageinfo_cache_effect_router',
        ),
        'weight' => 1,
      ),
    ),
  );

  return $styles;
}
