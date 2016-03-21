<?php
/**
 * @file
 * dfs_wem.strongarm.inc
 */

/**
 * Implements hook_strongarm().
 */
function dfs_wem_strongarm() {
  $export = array();

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_enable_revisions_page_node_wem_commerce';
  $strongarm->value = 1;
  $export['diff_enable_revisions_page_node_wem_commerce'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_enable_revisions_page_node_wem_contest';
  $strongarm->value = 1;
  $export['diff_enable_revisions_page_node_wem_contest'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_enable_revisions_page_node_wem_news';
  $strongarm->value = 1;
  $export['diff_enable_revisions_page_node_wem_news'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_enable_revisions_page_node_wem_product_review';
  $strongarm->value = 1;
  $export['diff_enable_revisions_page_node_wem_product_review'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_enable_revisions_page_node_wem_tweet';
  $strongarm->value = 1;
  $export['diff_enable_revisions_page_node_wem_tweet'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_show_preview_changes_node_wem_commerce';
  $strongarm->value = 1;
  $export['diff_show_preview_changes_node_wem_commerce'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_show_preview_changes_node_wem_contest';
  $strongarm->value = 1;
  $export['diff_show_preview_changes_node_wem_contest'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_show_preview_changes_node_wem_news';
  $strongarm->value = 1;
  $export['diff_show_preview_changes_node_wem_news'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_show_preview_changes_node_wem_product_review';
  $strongarm->value = 1;
  $export['diff_show_preview_changes_node_wem_product_review'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_show_preview_changes_node_wem_tweet';
  $strongarm->value = 1;
  $export['diff_show_preview_changes_node_wem_tweet'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_view_mode_preview_node_wem_commerce';
  $strongarm->value = 'full';
  $export['diff_view_mode_preview_node_wem_commerce'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_view_mode_preview_node_wem_contest';
  $strongarm->value = 'full';
  $export['diff_view_mode_preview_node_wem_contest'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_view_mode_preview_node_wem_news';
  $strongarm->value = 'full';
  $export['diff_view_mode_preview_node_wem_news'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_view_mode_preview_node_wem_product_review';
  $strongarm->value = 'full';
  $export['diff_view_mode_preview_node_wem_product_review'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_view_mode_preview_node_wem_tweet';
  $strongarm->value = 'full';
  $export['diff_view_mode_preview_node_wem_tweet'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'save_continue_wem_commerce';
  $strongarm->value = 'Save and add fields';
  $export['save_continue_wem_commerce'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'save_continue_wem_news';
  $strongarm->value = 'Save and add fields';
  $export['save_continue_wem_news'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'uuid_features_file_node';
  $strongarm->value = array(
    'article' => 0,
    'page' => 0,
    'commerce' => 0,
    'landing' => 0,
    'organic_group' => 0,
    'wem_commerce' => 0,
    'wem_contest' => 0,
    'wem_news' => 0,
    'wem_product_review' => 0,
    'wem_tweet' => 0,
    'webform' => 0,
  );
  $export['uuid_features_file_node'] = $strongarm;

  return $export;
}
