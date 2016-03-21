<?php
/**
 * @file
 * df_tools_og.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function df_tools_og_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "field_group" && $api == "field_group") {
    return array("version" => "1");
  }
  if ($module == "strongarm" && $api == "strongarm") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_node_info().
 */
function df_tools_og_node_info() {
  $items = array(
    'organic_group' => array(
      'name' => t('Organic Group'),
      'base' => 'node_content',
      'description' => t('An <em>Organic Group</em> that users may join and add content to.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
