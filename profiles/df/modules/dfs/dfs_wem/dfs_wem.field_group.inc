<?php
/**
 * @file
 * dfs_wem.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function dfs_wem_field_group_info() {
  $export = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_interests|user|user|form';
  $field_group->group_name = 'group_interests';
  $field_group->entity_type = 'user';
  $field_group->bundle = 'user';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Interests',
    'weight' => '43',
    'children' => array(
      0 => 'field_user_interests',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-interests field-group-tab ',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_interests|user|user|form'] = $field_group;

  return $export;
}
