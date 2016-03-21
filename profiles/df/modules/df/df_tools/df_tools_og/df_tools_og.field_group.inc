<?php
/**
 * @file
 * df_tools_og.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function df_tools_og_field_group_info() {
  $export = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_og|user|user|form';
  $field_group->group_name = 'group_og';
  $field_group->entity_type = 'user';
  $field_group->bundle = 'user';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Groups',
    'weight' => '5',
    'children' => array(
      0 => 'og_user_node',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-og field-group-tab ',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_og|user|user|form'] = $field_group;

  return $export;
}
