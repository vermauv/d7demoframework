<?php
/**
 * @file
 * dfs_wem_tweets.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function dfs_wem_tweets_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "strongarm" && $api == "strongarm") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_node_info().
 */
function dfs_wem_tweets_node_info() {
  $items = array(
    'wem_tweet' => array(
      'name' => t('WEM Tweet'),
      'base' => 'node_content',
      'description' => t('A <em>WEM Tweet</em> is imported via feeds.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
