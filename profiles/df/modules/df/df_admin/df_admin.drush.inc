<?php

/**
 * @file
 * Drush hook implementations for the Demo Framework Administation Screens
 * module.
 */

/**
 * Implements hook_drush_command().
 */
function df_admin_drush_command() {
  $items = array();

  $items['enable-scenario'] = array(
    'description' => 'Enables a demo scenario',
    'arguments' => array(
      'scenario' => 'The name of the module that defines the scenario',
    ),
    'options' => array(
      'import' => 'Boolean, allows content to be imported post-enablement',
      'rollback' => 'Boolean, rollback existing content post-enablement',
      'seed' => 'Boolean, seed derivatives of images post-enablement',
      'pre' => 'Comma separated list of modules to enable before enabling the scenario'
    ),
    'aliases' => array('df-es', 'es'),
    'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_FULL,
  );

  $items['sub-scenario'] = array(
    'description' => 'Enables a demo sub-scenario',
    'arguments' => array(
      'scenario' => 'The name of the module that defines the sub-scenario',
    ),
    'options' => array(
      'import' => 'Boolean, allows content to be imported post-enablement',
      'rollback' => 'Boolean, rollback existing content post-enablement',
      'seed' => 'Boolean, seed derivatives of images post-enablement',
      'pre' => 'Comma separated list of modules to enable before enabling the scenario'
    ),
    'aliases' => array('df-ss'),
    'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_FULL,
  );

  $items['reset-scenario'] = array(
    'description' => 'Resets a demo scenario',
    'arguments' => array(
      'scenario' => 'The name of the module that defines the scenario',
    ),
    'options' => array(
      'rollback' => 'Boolean, rollback existing content post-enablement',
      'seed' => 'Boolean, seed derivatives of images post-enablement',
    ),
    'aliases' => array('df-rs'),
    'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_FULL,
  );

  $items['uninstall-scenario'] = array(
    'description' => 'Uninstalls the current demo scenario',
    'aliases' => array('df-us'),
    'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_FULL,
  );

  return $items;
}

/**
 * Enables a scenario.
 *
 * @param string $scenario
 *   The machine name of the scenario feature.
 */
function drush_df_admin_enable_scenario($scenario) {
  // Determine the current alias
  $alias_context = drush_get_context('alias');
  $alias = !empty($alias_context) ? $alias_context : '@self';

  // Uninstall Update module before enabling scenario.
  if (module_exists('update')) {
    module_disable(array('update'));
    drupal_uninstall_modules(array('update'));
    drupal_set_message('Update module uninstalled before enabling demo scenario.', 'warning');
  }

  // If the --pre option is passed, attempt to enable modules before enabling the scenario
  if ($pre = drush_get_option('pre', FALSE)) {
    drush_invoke_process($alias, 'en', array($pre));
  }

  $import = drush_get_option('import', TRUE);
  module_load_include('inc', 'df_admin', 'df_admin.enable');

  if (df_admin_enable_scenario($scenario)) {
    // Optionally run the batch import of content.
    if ($import != FALSE) {
      $rollback = drush_get_option('rollback', FALSE);
      $seed = drush_get_option('seed', TRUE);
      drush_invoke_process($alias, 'df-rs', array($scenario), array('rollback' => $rollback, 'seed' => $seed));
    }
  }
}

/**
 * Enables a sub-scenario.
 *
 * @param string $sub_scenario
 *   The machine name of the sub-scenario feature.
 */
function drush_df_admin_sub_scenario($sub_scenario) {
  // Determine the current alias
  $alias_context = drush_get_context('alias');
  $alias = !empty($alias_context) ? $alias_context : '@self';

  // If the --pre option is passed, attempt to enable modules before enabling the scenario
  if ($pre = drush_get_option('pre', FALSE)) {
    drush_invoke_process($alias, 'en', array($pre));
  }

  $import = drush_get_option('import', TRUE);
  module_load_include('inc', 'df_admin', 'df_admin.subscenario');
  module_load_include('inc', 'df_admin', 'df_admin.enable');

  if ($base_scenario = df_admin_enable_sub_scenario($sub_scenario)) {
    // Optionally run the batch import of content.
    if ($import != FALSE) {
      $rollback = drush_get_option('rollback', FALSE);
      $seed = drush_get_option('seed', TRUE);
      drush_invoke_process($alias, 'df-rs', array($base_scenario), array('rollback' => $rollback, 'seed' => $seed));
    }
  }
}

/**
 * Resets content for a scenario.
 *
 * @param string $scenario
 *   The machine name of the scenario feature.
 * @param string $rollback
 *   Boolean: rollback existing demo content.
  */
function drush_df_admin_reset_scenario($scenario) {
  $rollback = drush_get_option('rollback', TRUE);
  $seed = drush_get_option('seed', TRUE);
  module_load_include('inc', 'df_admin', 'df_admin.reset');
  df_admin_reset_scenario($scenario, $rollback, $seed);
}

/**
 * Uninstalls the current scenario.
 */
function drush_df_admin_uninstall_scenario() {
  module_load_include('inc', 'df_admin', 'df_admin.uninstall');
  df_admin_uninstall_scenario();
}
