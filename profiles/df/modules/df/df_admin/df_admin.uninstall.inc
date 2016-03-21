<?php
/**
 * @file
 * Contains DF Admin's uninstall command.
 */

/**
 * Page callback; uninstall a scenario.
 */
function df_admin_page_uninstall() {
  if (!isset($_GET['token']) || !drupal_valid_token($_GET['token'], DRUPAL_ROOT . '/df/uninstall')) {
    return drupal_access_denied();
  }
  return df_admin_uninstall_scenario();
}

/**
 * Function to uninstall currently installed scenario
 */
function df_admin_uninstall_scenario($enable_module = FALSE) {
  // Check to see if any scenario is currently installed.
  if (!$scenario = variable_get('df_admin_installed_scenario', FALSE)) {
    drupal_set_message(t('No Demo Framework Scenario is currently installed.'));
    return FALSE;
  }
  else{
    drupal_set_message(t('Uninstalling Demo Framework Scenario @scenario', array('@scenario' => $scenario)));
  }

  // Load info file to grab dependencies.
  if (!$info = drupal_parse_info_file(drupal_get_path('module', $scenario) . '/' . $scenario . '.info')) {
    drupal_set_message(t('Unable to load Scenario .info file'), 'error');
    return FALSE;
  }

  // Rollback Migrated content.

  // Get list of modules implementing Migrate API.
  migrate_get_module_apis();

  // Set up operations array.
  $operations = array();

  // Set up migrations array via hook_df_import().
  $migrations = module_invoke_all('df_import');
  drupal_alter('df_import', $migrations);

  // Check for available migrations based on the scenario.
  if (isset($migrations[$scenario]) && !empty($migrations[$scenario])) {
    // Queue migrations to rollback in the opposite order provided.
    foreach (array_reverse($migrations[$scenario]) as $machine_name) {
      migrate_static_registration(array($machine_name));
      $operations[] = array('migrate_ui_batch', array('rollback', $machine_name, array('unit' => 'items', 'value' => ''), FALSE));
    }
  }

  // Uninstall features and the scenario.

  // Revert all Features for proper uninstall.
  df_admin_revert_all();

  // Gather list of feature dependencies.
  $features = array();
  foreach ($info['dependencies'] as $dependency) {
    if (strpos($dependency, 'dfs_') === 0) {
      $features[] = $dependency;
      $operations[] = array('drupal_set_message', array(t('Uninstalling @feature.', array('@feature' => $dependency)), 'status'));
    }
  }

  // Add this scenario onto features list so it is also removed.
  $features[] = $scenario;

  // Disable and uninstall features.
  $operations[] = array('module_disable', array($features));
  $operations[] = array('drupal_uninstall_modules', array($features));
  $operations[] = array('drupal_set_message', array(t('Uninstalled scenario and related features.'), 'status'));

  // Remove menu links.

  // Rebuild the menu_links table.
  $operations[] = array('db_query', array('TRUNCATE menu_links;'));
  $operations[] = array('menu_rebuild', array());
  $operations[] = array('drupal_set_message', array(t('Rebuilt menu_links table.'), 'status'));

  // Clear caches post-operations.
  $operations[] = array('drupal_flush_all_caches', array(''));
  $operations[] = array('drupal_set_message', array(t('All caches have been cleared.'), 'status'));

  // Clear messages for non-Drush users providing a cleaner scenario reset.
  if (!drupal_is_cli()) {
    $operations[] = array('drupal_get_messages', array(NULL, TRUE));
  }

  // Reset df_admin_installed_scenario variable.
  variable_set('df_admin_installed_scenario', FALSE);

  $batch = array(
    'operations' => $operations,
    'title' => t('Uninstall processing'),
    'init_message' => t('Starting uninstall process'),
    'file' => drupal_get_path('module', 'migrate_ui') . '/migrate_ui.pages.inc',
    'progress_message' => t('Uninstalling Demo Framework Scenario...'),
    'error_message' => t('An error occurred. Some or all of the uninstall processing has failed.'),
    'finished' => 'df_admin_batch_finish',
  );
  batch_set($batch);
  if (!drupal_is_cli()) {
    // If we're being called from the enable function, redirect to enable after
    // the current module is uninstalled.
    if ($enable_module) {
      $options = array('query' => array('token' => drupal_get_token(DRUPAL_ROOT . '/df/enable/' . $enable_module)));
      $path = array('admin/df/enable/' . $enable_module, $options);
    }
    else {
      $path = '';
    }
    batch_process($path);
  }
  else {
    drush_backend_batch_process();
  }

  return TRUE;
}
