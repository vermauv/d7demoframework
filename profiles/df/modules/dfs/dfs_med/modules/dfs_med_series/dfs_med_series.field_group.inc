<?php
/**
 * @file
 * dfs_med_series.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function dfs_med_series_field_group_info() {
  $export = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_content|node|series|form';
  $field_group->group_name = 'group_content';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'series';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_series_tabs';
  $field_group->data = array(
    'label' => 'Content',
    'weight' => '37',
    'children' => array(
      0 => 'body',
      1 => 'field_brand',
      2 => 'field_year',
      3 => 'field_commerce_product',
      4 => 'field_splash_image',
    ),
    'format_type' => 'htab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-content field-group-htab',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $export['group_content|node|series|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_ep_count|node|series|form';
  $field_group->group_name = 'group_ep_count';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'series';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_episodes';
  $field_group->data = array(
    'label' => 'Count',
    'weight' => '5',
    'children' => array(
      0 => 'field_collected_count',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'label' => 'Count',
      'instance_settings' => array(
        'required_fields' => 1,
        'classes' => 'group-ep-count field-group-fieldset ',
        'description' => '',
      ),
      'formatter' => 'collapsed',
    ),
  );
  $export['group_ep_count|node|series|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_episodes|node|series|form';
  $field_group->group_name = 'group_episodes';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'series';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_series_tabs';
  $field_group->data = array(
    'label' => 'Episodes',
    'weight' => '38',
    'children' => array(
      0 => 'field_series_episodes',
      1 => 'group_ep_count',
    ),
    'format_type' => 'htab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => '',
        'required_fields' => 1,
        'id' => '',
      ),
    ),
  );
  $export['group_episodes|node|series|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_series_tabs|node|series|form';
  $field_group->group_name = 'group_series_tabs';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'series';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Series Tabs ',
    'weight' => '1',
    'children' => array(
      0 => 'group_episodes',
      1 => 'group_content',
    ),
    'format_type' => 'htabs',
    'format_settings' => array(
      'formatter' => '',
      'instance_settings' => array(
        'classes' => 'group-series-tabs field-group-htabs',
      ),
    ),
  );
  $export['group_series_tabs|node|series|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_taxonomy|node|series|form';
  $field_group->group_name = 'group_taxonomy';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'series';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Taxonomy',
    'weight' => '14',
    'children' => array(
      0 => 'field_landing_tags',
      1 => 'field_persona',
      2 => 'field_site_section',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-taxonomy field-group-tab',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_taxonomy|node|series|form'] = $field_group;

  return $export;
}
