<?php
/**
 * @file
 * df_tools_commerce_product.features.field_instance.inc
 */

/**
 * Implements hook_field_default_field_instances().
 */
function df_tools_commerce_product_field_default_field_instances() {
  $field_instances = array();

  // Exported field_instance: 'fieldable_panels_pane-commerce_product-field_commerce_product_reference'
  $field_instances['fieldable_panels_pane-commerce_product-field_commerce_product_reference'] = array(
    'bundle' => 'commerce_product',
    'default_value_function' => '',
    'deleted' => 0,
    'description' => 'Select the Commerce Product you would like to display.',
    'display' => array(
      'default' => array(
        'label' => 'hidden',
        'module' => 'entityreference',
        'settings' => array(
          'links' => 0,
          'quickedit' => array(
            'editor' => 'form',
          ),
          'view_mode' => 'featured',
        ),
        'type' => 'entityreference_entity_view',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'fieldable_panels_pane',
    'field_name' => 'field_commerce_product_reference',
    'label' => 'Commerce Reference',
    'required' => 1,
    'settings' => array(
      'behaviors' => array(
        'prepopulate' => array(
          'status' => 0,
        ),
      ),
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'inline_entity_form',
      'settings' => array(
        'fields' => array(),
        'type_settings' => array(
          'allow_existing' => 1,
          'delete_references' => 0,
          'label_plural' => 'products',
          'label_singular' => 'product',
          'match_operator' => 'CONTAINS',
          'override_labels' => 1,
        ),
      ),
      'type' => 'inline_entity_form',
      'weight' => -4,
    ),
  );

  // Translatables
  // Included for use with string extractors like potx.
  t('Commerce Reference');
  t('Select the Commerce Product you would like to display.');

  return $field_instances;
}
