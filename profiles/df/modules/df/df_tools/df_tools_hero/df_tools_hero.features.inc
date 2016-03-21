<?php
/**
 * @file
 * df_tools_hero.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function df_tools_hero_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "fieldable_panels_panes" && $api == "fieldable_panels_pane_type") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_image_default_styles().
 */
function df_tools_hero_image_default_styles() {
  $styles = array();

  // Exported image style: custom_crop.
  $styles['custom_crop'] = array(
    'label' => 'Custom Crop',
    'effects' => array(
      3 => array(
        'name' => 'manualcrop_crop',
        'data' => array(
          'width' => '',
          'height' => '',
          'keepproportions' => 0,
          'reuse_crop_style' => '',
          'style_name' => 'custom_crop',
        ),
        'weight' => 0,
      ),
    ),
  );

  return $styles;
}
