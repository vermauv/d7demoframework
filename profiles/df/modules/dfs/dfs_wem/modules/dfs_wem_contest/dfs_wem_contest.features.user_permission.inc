<?php
/**
 * @file
 * dfs_wem_contest.features.user_permission.inc
 */

/**
 * Implements hook_defaultconfig_user_default_permissions().
 */
function dfs_wem_contest_defaultconfig_user_default_permissions() {
  $permissions = array();

  // Exported permission: 'administer panelizer node wem_contest content'.
  $permissions['administer panelizer node wem_contest content'] = array(
    'name' => 'administer panelizer node wem_contest content',
    'roles' => array(
      'administrator' => 'administrator',
      'curator' => 'curator',
      'marketer' => 'marketer',
      'reviewer' => 'reviewer',
    ),
    'module' => 'panelizer',
  );

  // Exported permission: 'administer panelizer node wem_contest context'.
  $permissions['administer panelizer node wem_contest context'] = array(
    'name' => 'administer panelizer node wem_contest context',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'panelizer',
  );

  // Exported permission: 'administer panelizer node wem_contest defaults'.
  $permissions['administer panelizer node wem_contest defaults'] = array(
    'name' => 'administer panelizer node wem_contest defaults',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'panelizer',
  );

  // Exported permission: 'administer panelizer node wem_contest layout'.
  $permissions['administer panelizer node wem_contest layout'] = array(
    'name' => 'administer panelizer node wem_contest layout',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'panelizer',
  );

  // Exported permission: 'administer panelizer node wem_contest overview'.
  $permissions['administer panelizer node wem_contest overview'] = array(
    'name' => 'administer panelizer node wem_contest overview',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'panelizer',
  );

  // Exported permission: 'administer panelizer node wem_contest settings'.
  $permissions['administer panelizer node wem_contest settings'] = array(
    'name' => 'administer panelizer node wem_contest settings',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'panelizer',
  );

  // Exported permission: 'create wem_contest content'.
  $permissions['create wem_contest content'] = array(
    'name' => 'create wem_contest content',
    'roles' => array(
      'curator' => 'curator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete any wem_contest content'.
  $permissions['delete any wem_contest content'] = array(
    'name' => 'delete any wem_contest content',
    'roles' => array(
      'reviewer' => 'reviewer',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete own wem_contest content'.
  $permissions['delete own wem_contest content'] = array(
    'name' => 'delete own wem_contest content',
    'roles' => array(
      'curator' => 'curator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit any wem_contest content'.
  $permissions['edit any wem_contest content'] = array(
    'name' => 'edit any wem_contest content',
    'roles' => array(
      'curator' => 'curator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit own wem_contest content'.
  $permissions['edit own wem_contest content'] = array(
    'name' => 'edit own wem_contest content',
    'roles' => array(
      'curator' => 'curator',
    ),
    'module' => 'node',
  );

  return $permissions;
}
