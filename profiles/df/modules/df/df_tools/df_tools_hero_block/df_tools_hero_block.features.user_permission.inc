<?php
/**
 * @file
 * df_tools_hero_block.features.user_permission.inc
 */

/**
 * Implements hook_user_default_permissions().
 */
function df_tools_hero_block_user_default_permissions() {
  $permissions = array();

  // Exported permission: 'view any df_bean_hero bean'.
  $permissions['view any df_bean_hero bean'] = array(
    'name' => 'view any df_bean_hero bean',
    'roles' => array(
      'administrator' => 'administrator',
      'anonymous user' => 'anonymous user',
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'bean',
  );

  return $permissions;
}
