<?php
/**
 * @file
 * dfs_wem_news.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function dfs_wem_news_field_group_info() {
  $export = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_wem_content|node|wem_news|form';
  $field_group->group_name = 'group_wem_content';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'wem_news';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Content',
    'weight' => '0',
    'children' => array(
      0 => 'body',
      1 => 'field_wem_subtitle',
      2 => 'title',
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
  $export['group_wem_content|node|wem_news|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_wem_locale|node|wem_news|form';
  $field_group->group_name = 'group_wem_locale';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'wem_news';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Locale',
    'weight' => '3',
    'children' => array(
      0 => 'language',
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
  $export['group_wem_locale|node|wem_news|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_wem_media|node|wem_news|form';
  $field_group->group_name = 'group_wem_media';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'wem_news';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Media',
    'weight' => '2',
    'children' => array(
      0 => 'field_wem_image',
      1 => 'field_wem_video',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-wem-media field-group-tab ',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_wem_media|node|wem_news|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_wem_sps|node|wem_news|form';
  $field_group->group_name = 'group_wem_sps';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'wem_news';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Site Preview',
    'weight' => '4',
    'children' => array(
      0 => 'field_collection',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'label' => 'Site Preview',
      'instance_settings' => array(
        'required_fields' => 1,
        'classes' => 'group-wem-sps field-group-tab ',
        'description' => '',
      ),
      'formatter' => 'closed',
    ),
  );
  $export['group_wem_sps|node|wem_news|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_wem_tags|node|wem_news|form';
  $field_group->group_name = 'group_wem_tags';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'wem_news';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Tags',
    'weight' => '1',
    'children' => array(
      0 => 'field_persona',
      1 => 'field_site_section',
      2 => 'field_wem_interests',
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
  $export['group_wem_tags|node|wem_news|form'] = $field_group;

  return $export;
}
