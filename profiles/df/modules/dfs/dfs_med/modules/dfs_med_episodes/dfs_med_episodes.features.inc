<?php
/**
 * @file
 * dfs_med_episodes.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function dfs_med_episodes_ctools_plugin_api($module = NULL, $api = NULL) {
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
function dfs_med_episodes_views_api($module = NULL, $api = NULL) {
  return array("api" => "3.0");
}

/**
 * Implements hook_node_info().
 */
function dfs_med_episodes_node_info() {
  $items = array(
    'episode' => array(
      'name' => t('Episode'),
      'base' => 'node_content',
      'description' => t('An <em>Episode</em> that references video content that can be purchased.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'episodic_collection' => array(
      'name' => t('Collection'),
      'base' => 'node_content',
      'description' => t('A Collection of <em>Episodes</em> that can be highlighted.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
