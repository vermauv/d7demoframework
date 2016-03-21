<?php
/**
 * @file
 * df_commerce.features.user_role.inc
 */

/**
 * Implements hook_user_default_roles().
 */
function df_commerce_user_default_roles() {
  $roles = array();

  // Exported role: merchant.
  $roles['merchant'] = array(
    'name' => 'merchant',
    'weight' => 8,
    'machine_name' => 'merchant',
  );

  // Exported role: service agent.
  $roles['service agent'] = array(
    'name' => 'service agent',
    'weight' => 7,
    'machine_name' => 'service_agent',
  );

  return $roles;
}
