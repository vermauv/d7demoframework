<?php
/**
 * @file
 * df_commerce.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function df_commerce_field_group_info() {
  $export = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_com_tabs|node|commerce|form';
  $field_group->group_name = 'group_com_tabs';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'commerce';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Commerce Tabs',
    'weight' => '1',
    'children' => array(
      0 => 'group_product',
    ),
    'format_type' => 'htabs',
    'format_settings' => array(
      'formatter' => '',
      'instance_settings' => array(
        'classes' => 'group-com-tabs field-group-htabs',
      ),
    ),
  );
  $export['group_com_tabs|node|commerce|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_product|node|commerce|form';
  $field_group->group_name = 'group_product';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'commerce';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_com_tabs';
  $field_group->data = array(
    'label' => 'Product',
    'weight' => '2',
    'children' => array(
      0 => 'body',
      1 => 'field_product',
    ),
    'format_type' => 'htab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-product field-group-htab',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $export['group_product|node|commerce|form'] = $field_group;

  return $export;
}
