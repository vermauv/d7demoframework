<?php

/**
 * @file
 * DF Admin sub-scenario handling functions.
 */

/**
 * Function to enable a scenario.
 */
function df_admin_enable_sub_scenario($module) {
  // If the scenario is already enabled, exit.
  if (module_exists($module)) {
    drupal_set_message(t('Sub-scenario @module is already installed.', array('@module' => $module)), 'status');
    return FALSE;
  }

  // Load info file to grab base scenario.
  if (!$info = drupal_parse_info_file(drupal_get_path('module', $module) . '/' . $module . '.info')) {
    drupal_set_message(t('Unable to load Scenario .info file'), 'error');
    return FALSE;
  }

  // Check to see if this is a valid sub-scenario.
  if (!isset($info['base_scenario'])) {
    drupal_set_message(t('@module\'s info file is missing the base_scenario key.', array('@module' => $module)), 'error');
    return FALSE;
  }

  // Check if another sub-scenario is installed.
  if ($sub_scenario = variable_get('df_admin_installed_sub_scenario', FALSE)) {
    module_disable($sub_scenario);
    drupal_uninstall_modules(array($sub_scenario));
    df_admin_revert_all();
  }

  // Check if another scenario is installed.
  $scenario = variable_get('df_admin_installed_scenario', FALSE);
  $base_enabled = $scenario == $info['base_scenario'];

  // Roll back existing scenario content if our base scenario is already enabled.
  if ($base_enabled) {
    $migrations = module_invoke_all('df_import');
    drupal_alter('df_import', $migrations);
    $operations = array();
    foreach (array_reverse($migrations[$scenario]) as $machine_name) {
      migrate_static_registration(array($machine_name));
      $operations[] = array('migrate_ui_batch', array('rollback', $machine_name, array('unit' => 'items', 'value' => ''), FALSE));
    }
    $batch = array(
      'operations' => $operations,
      'title' => t('Sub-scenario base scenario rollback.'),
      'init_message' => t('Rolling back base scenario.'),
      'file' => drupal_get_path('module', 'migrate_ui') . '/migrate_ui.pages.inc',
      'progress_message' => t('Rolling back base scenario migrations...'),
      'error_message' => t('An error occurred. Some or all of the rollback processing has failed.')
    );
    batch_set($batch);
    drush_backend_batch_process();
  }
  // Another scenario is installed, uninstall it now.
  elseif ($scenario) {
    // Uninstall currently installed scenario, if any is installed.
    module_load_include('inc', 'df_admin', 'df_admin.uninstall');
    df_admin_uninstall_scenario();
  }

  // If the base scenario isn't already enabled, do so now.
  if (!$base_enabled) {
    if (!df_admin_enable_scenario($info['base_scenario'])) {
      return FALSE;
    }
  }

  // Enable the sub-scenario.
  if (!_df_admin_enable_feature($module)) {
    return FALSE;
  }

  // Revert all features.
  df_admin_revert_all();

  // Mark this sub-scenario as enabled.
  variable_set('df_admin_installed_sub_scenario', $module);

  // Give our caller the base_scenario name, so it knows to revert features or migrate content.
  return $info['base_scenario'];
}
