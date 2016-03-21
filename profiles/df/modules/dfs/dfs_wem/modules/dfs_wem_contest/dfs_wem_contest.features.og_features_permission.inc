<?php
/**
 * @file
 * dfs_wem_contest.features.og_features_permission.inc
 */

/**
 * Implements hook_og_features_default_permissions().
 */
function dfs_wem_contest_og_features_default_permissions() {
  $permissions = array();

  // Exported og permission: 'node:wem_contest:add user'
  $permissions['node:wem_contest:add user'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:wem_contest:administer group'
  $permissions['node:wem_contest:administer group'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:wem_contest:approve and deny subscription'
  $permissions['node:wem_contest:approve and deny subscription'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:wem_contest:manage members'
  $permissions['node:wem_contest:manage members'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:wem_contest:manage permissions'
  $permissions['node:wem_contest:manage permissions'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:wem_contest:manage roles'
  $permissions['node:wem_contest:manage roles'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:wem_contest:subscribe'
  $permissions['node:wem_contest:subscribe'] = array(
    'roles' => array(
      'non-member' => 'non-member',
    ),
  );

  // Exported og permission: 'node:wem_contest:subscribe without approval'
  $permissions['node:wem_contest:subscribe without approval'] = array(
    'roles' => array(
      'non-member' => 'non-member',
    ),
  );

  // Exported og permission: 'node:wem_contest:unsubscribe'
  $permissions['node:wem_contest:unsubscribe'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:wem_contest:update group'
  $permissions['node:wem_contest:update group'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  return $permissions;
}
