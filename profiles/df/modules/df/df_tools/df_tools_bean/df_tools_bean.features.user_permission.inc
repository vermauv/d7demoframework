<?php
/**
 * @file
 * df_tools_bean.features.user_permission.inc
 */

/**
 * Implements hook_defaultconfig_user_default_permissions().
 */
function df_tools_bean_defaultconfig_user_default_permissions() {
  $permissions = array();

  // Exported permission: 'create any df_bean_personalized_content bean'.
  $permissions['create any df_bean_personalized_content bean'] = array(
    'name' => 'create any df_bean_personalized_content bean',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'bean',
  );

  // Exported permission: 'create any df_bean_wysiwyg_content bean'.
  $permissions['create any df_bean_wysiwyg_content bean'] = array(
    'name' => 'create any df_bean_wysiwyg_content bean',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'bean',
  );

  // Exported permission: 'delete any df_bean_personalized_content bean'.
  $permissions['delete any df_bean_personalized_content bean'] = array(
    'name' => 'delete any df_bean_personalized_content bean',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'bean',
  );

  // Exported permission: 'delete any df_bean_wysiwyg_content bean'.
  $permissions['delete any df_bean_wysiwyg_content bean'] = array(
    'name' => 'delete any df_bean_wysiwyg_content bean',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'bean',
  );

  // Exported permission: 'edit any df_bean_personalized_content bean'.
  $permissions['edit any df_bean_personalized_content bean'] = array(
    'name' => 'edit any df_bean_personalized_content bean',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'bean',
  );

  // Exported permission: 'edit any df_bean_wysiwyg_content bean'.
  $permissions['edit any df_bean_wysiwyg_content bean'] = array(
    'name' => 'edit any df_bean_wysiwyg_content bean',
    'roles' => array(
      'administrator' => 'administrator',
      'marketer' => 'marketer',
    ),
    'module' => 'bean',
  );

  // Exported permission: 'view any df_bean_personalized_content bean'.
  $permissions['view any df_bean_personalized_content bean'] = array(
    'name' => 'view any df_bean_personalized_content bean',
    'roles' => array(
      'administrator' => 'administrator',
      'anonymous user' => 'anonymous user',
      'authenticated user' => 'authenticated user',
      'marketer' => 'marketer',
    ),
    'module' => 'bean',
  );

  // Exported permission: 'view any df_bean_wysiwyg_content bean'.
  $permissions['view any df_bean_wysiwyg_content bean'] = array(
    'name' => 'view any df_bean_wysiwyg_content bean',
    'roles' => array(
      'administrator' => 'administrator',
      'anonymous user' => 'anonymous user',
      'authenticated user' => 'authenticated user',
      'marketer' => 'marketer',
    ),
    'module' => 'bean',
  );

  return $permissions;
}
