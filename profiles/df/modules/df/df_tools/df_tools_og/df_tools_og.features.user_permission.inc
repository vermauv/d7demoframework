<?php
/**
 * @file
 * df_tools_og.features.user_permission.inc
 */

/**
 * Implements hook_defaultconfig_user_default_permissions().
 */
function df_tools_og_defaultconfig_user_default_permissions() {
  $permissions = array();

  // Exported permission: 'administer group'.
  $permissions['administer group'] = array(
    'name' => 'administer group',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'og',
  );

  // Exported permission: 'delete any organic_group content'.
  $permissions['delete any organic_group content'] = array(
    'name' => 'delete any organic_group content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'delete own organic_group content'.
  $permissions['delete own organic_group content'] = array(
    'name' => 'delete own organic_group content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'edit any organic_group content'.
  $permissions['edit any organic_group content'] = array(
    'name' => 'edit any organic_group content',
    'roles' => array(),
    'module' => 'node',
  );

  // Exported permission: 'edit own organic_group content'.
  $permissions['edit own organic_group content'] = array(
    'name' => 'edit own organic_group content',
    'roles' => array(),
    'module' => 'node',
  );

  return $permissions;
}
