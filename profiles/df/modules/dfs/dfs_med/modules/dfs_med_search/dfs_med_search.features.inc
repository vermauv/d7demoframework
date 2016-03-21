<?php
/**
 * @file
 * dfs_med_search.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function dfs_med_search_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "strongarm" && $api == "strongarm") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_views_api().
 */
function dfs_med_search_views_api($module = NULL, $api = NULL) {
  return array("api" => "3.0");
}

/**
 * Implements hook_search_autocomplete_config_features_default_settings().
 */
function dfs_med_search_search_autocomplete_config_features_default_settings() {
  return array(
    0 => array(
      'fid' => 3,
      'title' => 'Search Block',
      'selector' => '#edit-search-block-form--2',
      'weight' => 0,
      'enabled' => 1,
      'parent_fid' => 0,
      'min_char' => 1,
      'max_sug' => 10,
      'no_results' => '{"label":"No results found for <b>[search-phrase]<\\/b>.<br\\/>Click to perform full search.","value":"[search-phrase]","link":"","group":{"group_id":"no_results"}}',
      'all_results' => '{"label":"View all results for <b>[search-phrase]<\\/b>.","value":"[search-phrase]","link":"","group":{"group_id":"all_results"}}',
      'auto_submit' => 1,
      'auto_redirect' => 1,
      'translite' => 1,
      'data_source' => 'view',
      'data_callback' => 'search_autocomplete/autocomplete/3/',
      'data_static' => '',
      'data_view' => 'med_nodes_autocomplete',
      'theme' => 'basic-grey.css',
    ),
  );
}
