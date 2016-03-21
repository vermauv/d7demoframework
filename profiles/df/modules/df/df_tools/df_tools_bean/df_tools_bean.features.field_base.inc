<?php
/**
 * @file
 * df_tools_bean.features.field_base.inc
 */

/**
 * Implements hook_field_default_field_bases().
 */
function df_tools_bean_field_default_field_bases() {
  $field_bases = array();

  // Exported field_base: 'field_content_reference'.
  $field_bases['field_content_reference'] = array(
    'active' => 1,
    'cardinality' => -1,
    'deleted' => 0,
    'entity_types' => array(),
    'field_name' => 'field_content_reference',
    'field_permissions' => array(
      'type' => 0,
    ),
    'indexes' => array(
      'target_id' => array(
        0 => 'target_id',
      ),
    ),
    'locked' => 0,
    'module' => 'entityreference',
    'settings' => array(
      'handler' => 'base',
      'handler_settings' => array(
        'behaviors' => array(
          'views-select-list' => array(
            'status' => 0,
          ),
        ),
        'sort' => array(
          'type' => 'none',
        ),
        'target_bundles' => array(),
      ),
      'personalize' => array(
        'agent_type' => 'acquia_lift',
        'auto_start' => 1,
        'create_goal' => 1,
        'enabled' => 1,
        'options' => array(
          'acquia_lift' => array(
            'control_rate' => 10,
            'decision_style' => 'adaptive',
            'explore_rate' => 20,
            'stop_on_winner' => 0,
          ),
          'acquia_lift_simple_ab' => array(
            'control_rate' => 10,
            'decision_style' => 'adaptive',
            'explore_rate' => 20,
            'stop_on_winner' => 0,
          ),
        ),
        'stop_on_winner' => 0,
      ),
      'target_type' => 'node',
    ),
    'translatable' => 0,
    'type' => 'entityreference',
  );

  // Exported field_base: 'field_wysiwyg'.
  $field_bases['field_wysiwyg'] = array(
    'active' => 1,
    'cardinality' => 1,
    'deleted' => 0,
    'entity_types' => array(),
    'field_name' => 'field_wysiwyg',
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
      'personalize' => array(
        'agent_type' => 'personalize_target',
        'enabled' => 0,
      ),
    ),
    'translatable' => 0,
    'type' => 'text_long',
  );

  return $field_bases;
}
