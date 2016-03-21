<?php
/**
 * @file
 * df_tools_hero_block.strongarm.inc
 */

/**
 * Implements hook_strongarm().
 */
function df_tools_hero_block_strongarm() {
  $export = array();

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'field_bundle_settings_bean__df_bean_hero';
  $strongarm->value = array(
    'view_modes' => array(
      'default' => array(
        'custom_settings' => FALSE,
      ),
      'diff_standard' => array(
        'custom_settings' => FALSE,
      ),
      'token' => array(
        'custom_settings' => FALSE,
      ),
    ),
    'extra_fields' => array(
      'form' => array(
        'label' => array(
          'weight' => '0',
        ),
        'title' => array(
          'weight' => '5',
        ),
        'revision' => array(
          'weight' => '7',
        ),
        'view_mode' => array(
          'weight' => '6',
        ),
      ),
      'display' => array(
        'title' => array(
          'default' => array(
            'weight' => '2',
            'visible' => TRUE,
          ),
        ),
      ),
    ),
  );
  $export['field_bundle_settings_bean__df_bean_hero'] = $strongarm;

  return $export;
}
