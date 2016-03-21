<?php
/**
 * @file
 * dfs_wem_news.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function dfs_wem_news_ctools_plugin_api($module = NULL, $api = NULL) {
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
 * Implements hook_node_info().
 */
function dfs_wem_news_node_info() {
  $items = array(
    'wem_news' => array(
      'name' => t('WEM News'),
      'base' => 'node_content',
      'description' => t('A <em>News</em> content type to be used by the WEM Scenario.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
