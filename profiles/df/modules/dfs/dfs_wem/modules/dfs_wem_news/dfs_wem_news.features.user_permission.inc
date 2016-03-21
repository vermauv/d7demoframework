<?php
/**
 * @file
 * dfs_wem_news.features.user_permission.inc
 */

/**
 * Implements hook_defaultconfig_user_default_permissions().
 */
function dfs_wem_news_defaultconfig_user_default_permissions() {
  $permissions = array();

  // Exported permission: 'administer panelizer node wem_news content'.
  $permissions['administer panelizer node wem_news content'] = array(
    'name' => 'administer panelizer node wem_news content',
    'roles' => array(
      'administrator' => 'administrator',
      'curator' => 'curator',
      'marketer' => 'marketer',
      'reviewer' => 'reviewer',
    ),
    'module' => 'panelizer',
  );

  // Exported permission: 'administer panelizer node wem_news context'.
  $permissions['administer panelizer node wem_news context'] = array(
    'name' => 'administer panelizer node wem_news context',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'panelizer',
  );

  // Exported permission: 'administer panelizer node wem_news defaults'.
  $permissions['administer panelizer node wem_news defaults'] = array(
    'name' => 'administer panelizer node wem_news defaults',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'panelizer',
  );

  // Exported permission: 'administer panelizer node wem_news layout'.
  $permissions['administer panelizer node wem_news layout'] = array(
    'name' => 'administer panelizer node wem_news layout',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'panelizer',
  );

  // Exported permission: 'administer panelizer node wem_news overview'.
  $permissions['administer panelizer node wem_news overview'] = array(
    'name' => 'administer panelizer node wem_news overview',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'panelizer',
  );

  // Exported permission: 'administer panelizer node wem_news settings'.
  $permissions['administer panelizer node wem_news settings'] = array(
    'name' => 'administer panelizer node wem_news settings',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'panelizer',
  );

  // Exported permission: 'create wem_news content'.
  $permissions['create wem_news content'] = array(
    'name' => 'create wem_news content',
    'roles' => array(
      'curator' => 'curator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete any wem_news content'.
  $permissions['delete any wem_news content'] = array(
    'name' => 'delete any wem_news content',
    'roles' => array(
      'reviewer' => 'reviewer',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete own wem_news content'.
  $permissions['delete own wem_news content'] = array(
    'name' => 'delete own wem_news content',
    'roles' => array(
      'curator' => 'curator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit any wem_news content'.
  $permissions['edit any wem_news content'] = array(
    'name' => 'edit any wem_news content',
    'roles' => array(
      'curator' => 'curator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit own wem_news content'.
  $permissions['edit own wem_news content'] = array(
    'name' => 'edit own wem_news content',
    'roles' => array(
      'curator' => 'curator',
    ),
    'module' => 'node',
  );

  return $permissions;
}
