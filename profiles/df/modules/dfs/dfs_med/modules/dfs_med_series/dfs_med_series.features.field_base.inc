<?php
/**
 * @file
 * dfs_med_series.features.field_base.inc
 */

/**
 * Implements hook_field_default_field_bases().
 */
function dfs_med_series_field_default_field_bases() {
  $field_bases = array();

  // Exported field_base: 'field_series_episodes'.
  $field_bases['field_series_episodes'] = array(
    'active' => 1,
    'cardinality' => -1,
    'deleted' => 0,
    'entity_types' => array(),
    'field_name' => 'field_series_episodes',
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
        'target_bundles' => array(
          'episode' => 'episode',
        ),
      ),
      'target_type' => 'node',
    ),
    'translatable' => 0,
    'type' => 'entityreference',
  );

  return $field_bases;
}
