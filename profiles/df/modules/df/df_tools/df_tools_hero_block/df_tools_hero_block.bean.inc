<?php
/**
 * @file
 * df_tools_hero_block.bean.inc
 */

/**
 * Implements hook_bean_admin_ui_types().
 */
function df_tools_hero_block_bean_admin_ui_types() {
  $export = array();

  $bean_type = new stdClass();
  $bean_type->disabled = FALSE; /* Edit this to true to make a default bean_type disabled initially */
  $bean_type->api_version = 5;
  $bean_type->name = 'df_bean_hero';
  $bean_type->label = 'Hero with Call to Action';
  $bean_type->options = '';
  $bean_type->description = 'A block used for adding Hero image and call to action button.';
  $export['df_bean_hero'] = $bean_type;

  return $export;
}
