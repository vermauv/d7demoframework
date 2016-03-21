<?php

/**
 * @file
 * DF Admin's reset page handling functions.
 */

/**
 * Page callback; reset a scenario.
 */
function df_admin_page_reset($module) {
  if (!isset($_GET['token']) || !drupal_valid_token($_GET['token'], DRUPAL_ROOT . '/df/reset/' . $module)) {
    return drupal_access_denied();
  }
  return df_admin_reset_scenario($module, TRUE, TRUE);
}

/**
 * Function to process migrations in correct order to safely inject DFS
 * content into the system.
 */
function df_admin_reset_scenario($scenario, $rollback = TRUE, $seed = TRUE) {
  // Check to see if scenario is not enabled.
  if (!module_exists($scenario)) {
    drupal_set_message(t('@scenario must be enabled before a reset can occur.', array('@scenario' => $scenario)), 'error');
    return FALSE;
  }

  // Get list of modules implementing Migrate API.
  migrate_get_module_apis();

  // Set up operations array.
  $operations = array();

  // Revert Features to ensure proper DFS reset.
  $operations[] = array('df_admin_revert_all', array(''));
  $operations[] = array('drupal_set_message', array(t('Reverted Features after scenario enablement.'), 'status'));
  $operations[] = array('_df_admin_watchdog_revert_features', array($scenario));

  // Rebuild defaultconfig from modules.
  $operations[] = array('defaultconfig_rebuild_all', array(''));
  $operations[] = array('drupal_set_message', array(t('Defaultconfig rebuilt after scenario enablement.'), 'status'));
  $operations[] = array('_df_admin_watchdog_defaultconfig_rebuild', array($scenario));

  // Set up pre-import routines via hook_df_pre_import().
  $routines = array();
  $routines = module_invoke_all('df_pre_import');
  drupal_alter('df_pre_import', $routines);

  // Add pre-import functions to the batch process.
  foreach ($routines as $routine) {
    $operations[] = $routine;
  }

  // Set up migrations array via hook_df_import().
  $migrations = array();
  $migrations = module_invoke_all('df_import');
  drupal_alter('df_import', $migrations);

  // Check for available migrations based on the scenario argument.
  if (isset($migrations[$scenario]) && !empty($migrations[$scenario])) {

    if ($rollback == TRUE) {
      // Queue migrations to rollback in the opposite order provided.
      foreach (array_reverse($migrations[$scenario]) as $machine_name) {
        migrate_static_registration(array($machine_name));
        $migration = Migration::getInstance($machine_name);
        $operations[] = array('migrate_ui_batch', array('rollback', $machine_name, array('unit' => 'items', 'value' => ''), FALSE));
      }
    }

    // Queue migrations to import in the provided order.
    foreach ($migrations[$scenario]  as $machine_name) {
      migrate_static_registration(array($machine_name));
      $migration = Migration::getInstance($machine_name);
      $operations[] = array('migrate_ui_batch', array('import', $machine_name, array('unit' => 'items', 'value' => ''), FALSE));
    }

    // Confirm if there was an attempt to run scenario migrations.
    $migrations_count = count($migrations[$scenario]);
    if ($migrations_count > 0 && drupal_is_cli()) {
      $message = $migrations_count . ' demo migrations attempted.';
      $operations[] = array('drush_print', array($message, 0, NULL, TRUE));
    }

  }

  // Set up post-import routines via hook_df_post_import().
  $routines = array();
  $routines = module_invoke_all('df_post_import');
  drupal_alter('df_post_import', $routines);

  // Add post-import functions to the batch process.
  foreach ($routines as $routine) {
    $operations[] = $routine;
  }

  // Clear caches post-operations.
  $operations[] = array('node_access_rebuild', array(''));
  $operations[] = array('drupal_flush_all_caches', array(''));
  $operations[] = array('variable_set', array('menu_rebuild_needed', TRUE));
  $operations[] = array('drupal_set_message', array(t('All caches have been cleared.'), 'status'));
  $operations[] = array('_df_admin_watchdog_cache_clear', array($scenario));

  // Clear messages for non-Drush users providing a cleaner scenario reset.
  if (!drupal_is_cli()) {
    $messages = array('completed', 'status', 'warning');
    foreach ($messages as $message) {
      $operations[] = array('drupal_get_messages', array($message, TRUE));
    }
  }
  else {
    // Determine the current alias
    $alias_context = drush_get_context('alias');
    $alias = !empty($alias_context) ? $alias_context : '@self';

    // Seed derivatives
    if ($seed == TRUE) {
      $operations[] = array('drush_invoke_process', array($alias, 'df-sd', array(), array(), TRUE));
    }
    // Clear caches before we start the batch, to prevent conflicts with new module additions
    // This fixes a specific bug with the --pre option, but there's no harm in calling it every time df-rs is called
    drush_invoke_process($alias, 'cc', array('all'));
  }

  // Rollback and Import migration operations via Batch API.
  if (count($operations) > 0) {
    $batch = array(
      'operations' => $operations,
      'title' => t('Import processing'),
      'init_message' => t('Starting import process'),
      'file' => drupal_get_path('module', 'migrate_ui') . '/migrate_ui.pages.inc',
      'progress_message' => t('Importing Demo Framework Scenario...'),
      'error_message' => t('An error occurred. Some or all of the import processing has failed.'),
      'finished' => 'df_admin_batch_finish',
    );
    batch_set($batch);
    if (!drupal_is_cli()) {
      $options = array('query' => array('token' => drupal_get_token(DRUPAL_ROOT . '/df/imagestyles')));
      // The ability to send an array for $redirect is undocumented on Drupal.org, yay!
      batch_process(array('admin/df/imagestyles', $options));
    }
    else {
      drush_backend_batch_process();
    }
  }
  // No operations present, non-drush users get redirected.
  if (!drupal_is_cli() && empty($operations)) {
    drupal_goto('');
  }
  return TRUE;
}
