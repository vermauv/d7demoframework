<?php
/**
 * @file
 * df_tools_hero.features.field_base.inc
 */

/**
 * Implements hook_field_default_field_bases().
 */
function df_tools_hero_field_default_field_bases() {
  $field_bases = array();

  // Exported field_base: 'field_hero_button_link'.
  $field_bases['field_hero_button_link'] = array(
    'active' => 1,
    'cardinality' => 1,
    'deleted' => 0,
    'entity_types' => array(),
    'field_name' => 'field_hero_button_link',
    'field_permissions' => array(
      'type' => 0,
    ),
    'indexes' => array(),
    'locked' => 0,
    'module' => 'link',
    'settings' => array(
      'attributes' => array(
        'class' => '',
        'rel' => '',
        'target' => 'default',
      ),
      'display' => array(
        'url_cutoff' => 80,
      ),
      'enable_tokens' => 1,
      'personalize' => array(
        'agent_type' => 'personalize_target',
        'enabled' => 0,
      ),
      'title' => 'optional',
      'title_maxlength' => 128,
      'title_value' => '',
      'url' => 0,
    ),
    'translatable' => 0,
    'type' => 'link_field',
  );

  // Exported field_base: 'field_hero_headline_1'.
  $field_bases['field_hero_headline_1'] = array(
    'active' => 1,
    'cardinality' => 1,
    'deleted' => 0,
    'entity_types' => array(),
    'field_name' => 'field_hero_headline_1',
    'field_permissions' => array(
      'type' => 0,
    ),
    'indexes' => array(
      'format' => array(
        0 => 'format',
      ),
    ),
    'locked' => 0,
    'module' => 'text',
    'settings' => array(
      'max_length' => 255,
      'personalize' => array(
        'agent_type' => 'personalize_target',
        'create_goal' => 1,
        'enabled' => 0,
        'goal_pages' => '',
      ),
    ),
    'translatable' => 0,
    'type' => 'text',
  );

  // Exported field_base: 'field_hero_headline_2'.
  $field_bases['field_hero_headline_2'] = array(
    'active' => 1,
    'cardinality' => 1,
    'deleted' => 0,
    'entity_types' => array(),
    'field_name' => 'field_hero_headline_2',
    'field_permissions' => array(
      'type' => 0,
    ),
    'indexes' => array(
      'format' => array(
        0 => 'format',
      ),
    ),
    'locked' => 0,
    'module' => 'text',
    'settings' => array(
      'max_length' => 255,
      'personalize' => array(
        'agent_type' => 'personalize_target',
        'create_goal' => 1,
        'enabled' => 0,
        'goal_pages' => '',
      ),
    ),
    'translatable' => 0,
    'type' => 'text',
  );

  // Exported field_base: 'field_hero_image'.
  $field_bases['field_hero_image'] = array(
    'active' => 1,
    'cardinality' => 1,
    'deleted' => 0,
    'entity_types' => array(),
    'field_name' => 'field_hero_image',
    'field_permissions' => array(
      'type' => 0,
    ),
    'indexes' => array(
      'fid' => array(
        0 => 'fid',
      ),
    ),
    'locked' => 0,
    'module' => 'image',
    'settings' => array(
      'default_image' => 0,
      'personalize' => array(
        'agent_type' => 'personalize_target',
        'create_goal' => 1,
        'enabled' => 0,
        'goal_pages' => '',
      ),
      'uri_scheme' => 'public',
    ),
    'translatable' => 0,
    'type' => 'image',
  );

  return $field_bases;
}
