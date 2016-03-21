<?php
/**
 * @file
 * dfs_med_commerce.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function dfs_med_commerce_field_group_info() {
  $export = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_bestseller|node|commerce|form';
  $field_group->group_name = 'group_bestseller';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'commerce';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Bestseller Flags',
    'weight' => '6',
    'children' => array(
      0 => 'field_bestseller',
      1 => 'field_featured',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => '',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_bestseller|node|commerce|form'] = $field_group;

  return $export;
}
