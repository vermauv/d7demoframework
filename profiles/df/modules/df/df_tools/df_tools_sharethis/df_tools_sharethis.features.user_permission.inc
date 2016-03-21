<?php
/**
 * @file
 * df_tools_sharethis.features.user_permission.inc
 */

/**
 * Implements hook_defaultconfig_user_default_permissions().
 */
function df_tools_sharethis_defaultconfig_user_default_permissions() {
  $permissions = array();

  // Exported permission: 'administer sharethis'.
  $permissions['administer sharethis'] = array(
    'name' => 'administer sharethis',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'sharethis',
  );

  return $permissions;
}
