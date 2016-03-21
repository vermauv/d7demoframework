<?php
/**
 * @file
 * df_commerce.features.inc
 */

/**
 * Implements hook_commerce_product_default_types().
 */
function df_commerce_commerce_product_default_types() {
  $items = array(
    'product' => array(
      'type' => 'product',
      'name' => 'Product',
      'description' => 'A basic product type.',
      'help' => '',
      'revision' => 1,
    ),
  );
  return $items;
}

/**
 * Implements hook_ctools_plugin_api().
 */
function df_commerce_ctools_plugin_api($module = NULL, $api = NULL) {
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
function df_commerce_node_info() {
  $items = array(
    'commerce' => array(
      'name' => t('Commerce Product'),
      'base' => 'node_content',
      'description' => t('Use <em>commerce product</em> content to display linked Drupal Commerce Product entities.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
