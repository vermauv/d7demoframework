<?php
/**
 * @file
 * df_tools_hero_block.features.field_base.inc
 */

/**
 * Implements hook_field_default_field_bases().
 */
function df_tools_hero_block_field_default_field_bases() {
  $field_bases = array();

  // Exported field_base: 'field_hero_button'.
  $field_bases['field_hero_button'] = array(
    'active' => 1,
    'cardinality' => 1,
    'deleted' => 0,
    'entity_types' => array(),
    'field_name' => 'field_hero_button',
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
        'create_goal' => 1,
        'enabled' => 0,
        'goal_pages' => '',
      ),
      'title' => 'optional',
      'title_maxlength' => 128,
      'title_value' => '',
      'url' => 0,
    ),
    'translatable' => 0,
    'type' => 'link_field',
  );

  return $field_bases;
}
