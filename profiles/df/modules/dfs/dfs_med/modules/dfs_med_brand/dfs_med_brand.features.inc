<?php
/**
 * @file
 * dfs_med_brand.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function dfs_med_brand_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "field_group" && $api == "field_group") {
    return array("version" => "1");
  }
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
function dfs_med_brand_views_api($module = NULL, $api = NULL) {
  return array("api" => "3.0");
}

/**
 * Implements hook_node_info().
 */
function dfs_med_brand_node_info() {
  $items = array(
    'brand' => array(
      'name' => t('Brand'),
      'base' => 'node_content',
      'description' => t('Unique landing pages used for branding purposes.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
