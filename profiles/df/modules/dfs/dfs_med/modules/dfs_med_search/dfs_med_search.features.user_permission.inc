<?php
/**
 * @file
 * dfs_med_search.features.user_permission.inc
 */

/**
 * Implements hook_user_default_permissions().
 */
function dfs_med_search_user_default_permissions() {
  $permissions = array();

  // Exported permission: 'use Search Autocomplete'.
  $permissions['use Search Autocomplete'] = array(
    'name' => 'use Search Autocomplete',
    'roles' => array(
      'administrator' => 'administrator',
      'anonymous user' => 'anonymous user',
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'search_autocomplete',
  );

  return $permissions;
}
