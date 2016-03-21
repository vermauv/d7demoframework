<?php
/**
 * @file
 * dfs_med_brand.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function dfs_med_brand_field_group_info() {
  $export = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_brand_set|node|brand|form';
  $field_group->group_name = 'group_brand_set';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'brand';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_brand_tabs';
  $field_group->data = array(
    'label' => 'Brand Settings',
    'weight' => '6',
    'children' => array(
      0 => 'field_greylist',
      1 => 'field_link_image',
      2 => 'field_link_image_hover',
      3 => 'field_superbrand',
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
  $export['group_brand_set|node|brand|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_brand_tabs|node|brand|form';
  $field_group->group_name = 'group_brand_tabs';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'brand';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Brand Tabs',
    'weight' => '1',
    'children' => array(
      0 => 'group_brand_set',
      1 => 'group_content',
    ),
    'format_type' => 'htabs',
    'format_settings' => array(
      'formatter' => '',
      'instance_settings' => array(
        'classes' => 'group-brand-tabs field-group-htabs',
      ),
    ),
  );
  $export['group_brand_tabs|node|brand|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_content|node|brand|form';
  $field_group->group_name = 'group_content';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'brand';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_brand_tabs';
  $field_group->data = array(
    'label' => 'Content',
    'weight' => '5',
    'children' => array(
      0 => 'body',
      1 => 'field_logo',
      2 => 'field_splash_image',
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
  $export['group_content|node|brand|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_taxonomy|node|brand|form';
  $field_group->group_name = 'group_taxonomy';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'brand';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Taxonomy',
    'weight' => '10',
    'children' => array(
      0 => 'field_persona',
      1 => 'field_site_section',
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
  $export['group_taxonomy|node|brand|form'] = $field_group;

  return $export;
}
