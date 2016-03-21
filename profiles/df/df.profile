<?php
/**
 * @file
 * Enables modules and site configuration for Demo Framework site installation.
 */

/**
 * Implements hook_permission().
 */
function df_permission() {
  return array(
    'administer demo framework' => array(
      'title' => t('Administer Demo Framework'),
      'description' => t('Perform administration tasks for demo framework.'),
    ),
  );
}

/**
 * Implements hook_form_FORM_ID_alter() for install_configure_form().
 */
function df_form_install_configure_form_alter(&$form, $form_state) {
   // Add Demo Framework styles for installer.
  drupal_add_css('profiles/df/df.css');

  // Remove any non-error messages set by enabled modules.
  $messages = array('completed', 'status', 'warning');
  foreach ($messages as $message) {
    drupal_get_messages($message, TRUE);
  }

  // Check for DFS or Acquia modules.
  $list = array();
  $modules = system_rebuild_module_data();
  foreach ($modules as $name => $module) {
    // List available DF scenarios.
    if ($module->info['package'] == 'Demo Framework Scenarios') {
      $list['dfs'][$module->name] = df_scenario_select($module);
    }
    // List available Acquia modules. 
    if (strpos($module->name, 'acquia_') !== false && strpos($module->name, '_test') === false
    && strpos($module->name, '_search') === false && strpos($module->name, '_commerce') === false) {
      $list['acquia'][$module->name] = $module->info['name'];
    }
  }
  $list['dfs']['none'] = 'Do not install a demo scenario.';

  // Set default scenario.
  $default_scenario = 'none';
  if (isset($list['dfs']['dfs_med'])) {
    $default_scenario = 'dfs_med';
  }

  // Add 'Demo Framework' fieldset and options.
  $form['demo_framework'] = array(
    '#type' => 'fieldset',
    '#title' => t('Demo Framework'),
    '#weight' => -6,
    '#collapsible' => FALSE,
    '#tree' => FALSE,
  );

  // Optional Scenario enablement.
  $form['demo_framework']['df_scenario'] = array(
    '#type' => 'radios',
    '#title' => 'Enable a Scenario',
    '#description' => 'Optionally choose a demo scenario for immediate enablement.',
    '#options' => $list['dfs'],
    '#default_value' => $default_scenario,
    '#weight' => 0,
  );

  // Add 'Acquia' fieldset and options.
  $form['acquia'] = array(
    '#type' => 'fieldset',
    '#title' => t('Acquia'),
    '#weight' => -5,
    '#collapsible' => FALSE,
    '#tree' => FALSE,
  );

  // List available Acquia modules.
  $form['acquia']['acquia_modules'] = array(
    '#type' => 'checkboxes',
    '#title' => 'Enable Extensions',
    '#description' => 'Optionally enable Acquia integration modules.',
    '#options' => $list['acquia'],
    '#weight' => 0,
  );

  // Turn off Update Notifications by default.
  $form['update_notifications']['update_status_module']['#default_value'] = array(0 => 0, 1 => 0);

  // Hide Update Notifications fieldset.
  $form['update_notifications']['#access'] = FALSE;

  // Additional submit handlers for DF settings.
  $form['#submit'][] = 'df_scenario_check_enable';
  $form['#submit'][] = 'df_acquia_extensions_enable';
}

/**
 * Return a screenshot and title of scenario for the select element.
 */
function df_scenario_select(&$module) {
  $screenshot = drupal_get_path('module', $module->name) . '/screenshot.png';
  $describe = $module->info['description'];
  return $module->info['name'] . '<img src="' . $screenshot . '" class="dfs-select" />' . '<p class="scenario-description">' . $describe . '</p>';
}

/**
 * Check if a Demo Framework Scenario is selected for enablement.
 */
function df_scenario_check_enable($form_id, &$form_state) {
  $values = $form_state['values'];
  if (isset($values['df_scenario']) && $values['df_scenario'] != 'none') {
    variable_set('df_install_enable_dfs', $values['df_scenario']);
  }
}

/**
 * Enable requested Acquia extensions.
 */
function df_acquia_extensions_enable($form_id, &$form_state) {
  $values = $form_state['values'];
  if (isset($values['acquia_modules'])) {
    foreach ($values['acquia_modules'] as $module) {
      module_enable(array($module), TRUE);
    }
  }
}

