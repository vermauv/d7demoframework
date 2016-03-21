<?php
/**
 * @file
 * dfs_wem_commerce.features.inc
 */

/**
 * Implements hook_commerce_product_default_types().
 */
function dfs_wem_commerce_commerce_product_default_types() {
  $items = array(
    'wem_product' => array(
      'type' => 'wem_product',
      'name' => 'WEM Product',
      'description' => '',
      'help' => '',
      'revision' => 0,
    ),
  );
  return $items;
}

/**
 * Implements hook_ctools_plugin_api().
 */
function dfs_wem_commerce_ctools_plugin_api($module = NULL, $api = NULL) {
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
function dfs_wem_commerce_node_info() {
  $items = array(
    'wem_commerce' => array(
      'name' => t('WEM Commerce'),
      'base' => 'node_content',
      'description' => t('The <em>Commerce</em> content is used to display products.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'wem_product_review' => array(
      'name' => t('WEM Product Review'),
      'base' => 'node_content',
      'description' => t('A <em>Product Review</em> is created by authenticated customers.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
