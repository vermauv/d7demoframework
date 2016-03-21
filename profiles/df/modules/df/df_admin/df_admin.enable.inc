<?php

/**
 * @file
 * DF Admin scenario handling functions.
 */

/**
 * Page callback; enable a scenario.
 */
function df_admin_page_enable($module) {
  if (!isset($_GET['token']) || !drupal_valid_token($_GET['token'], DRUPAL_ROOT . '/df/enable/' . $module)) {
    return drupal_access_denied();
  }
  return df_admin_enable_scenario($module);
}

/**
 * Function to enable a scenario.
 */
function df_admin_enable_scenario($module) {
  // If the scenario is already enabled, exit.
  if (module_exists($module)) {
    drupal_set_message(t('Scenario @module is already installed.', array('@module' => $module)), 'status');
    return FALSE;
  }

  // Check if it appears another scenario is installed.
  if (variable_get('df_admin_installed_scenario', FALSE)) {
    // Uninstall currently installed scenario, if any is installed.
    module_load_include('inc', 'df_admin', 'df_admin.uninstall');
    // Passing "$module" tells the uninstall batch to redirect back here when it's finished.
    df_admin_uninstall_scenario($module);
  }

  // Load info file to grab dependencies.
  if (!$info = drupal_parse_info_file(drupal_get_path('module', $module) . '/' . $module . '.info')) {
    drupal_set_message(t('Unable to load Scenario .info file'), 'error');
    return FALSE;
  }

  // Enable the scenario feature's DF dependencies.
  foreach ($info['dependencies'] as $dependency) {
    if (substr($dependency, 0, 2) == 'df_') {
      _df_admin_enable_feature($dependency);
    }
  }

  // Enable the scenario feature.
  if (!_df_admin_enable_feature($module)) {
    drupal_set_message(t('Enablement of @module failed.', array('@module' => $module)), 'error');
    return FALSE;
  }

  // Change the system variable that tracks what scenario is installed.
  variable_set('df_admin_installed_scenario', $module);

  // Not all DFS require a batch content import, but some need this.
  // Resolves to the DF admin page if no reset callback present.
  if (!drupal_is_cli()) {
    $path = 'admin/df/reset/' . $module;
    $token = drupal_get_token(DRUPAL_ROOT . '/df/reset/' . $module);
    drupal_goto($path, array('query' => array('token' => $token)));
  }

  return TRUE;
}

/**
 * Helper function to enable a Feature properly.
 */
function _df_admin_enable_feature($module) {
  // Enable a disabled Features module.
  if (!module_exists($module)) {
    if (module_enable(array($module))) {
      watchdog('demo framework', 'Enabled module: ' . $module);
      drupal_set_message(t('@module enabled.', array('@module' => $module)), 'status');
      return TRUE;
    }
    else {
      drupal_set_message(t('@module does not exist or dependencies are missing.', array('@module' => $module)), 'error');
      return FALSE;
    }
  }
  drupal_set_message(t('@module is already enabled.', array('@module' => $module)), 'warning');
  return FALSE;
}
