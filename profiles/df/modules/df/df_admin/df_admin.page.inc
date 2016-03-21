<?php
/**
 * @file
 * DF Admin page handling functions.
 */

/**
 * DF Admin page callback used to list scenarios.
 * @return
 *   returns theme callback with scenario information array.
 */
function df_admin_page() {
  // Add DF Admin CSS.
  drupal_add_css(drupal_get_path('module', 'df_admin') . '/css/df_admin.page.css');

  // Get advanced help topics.
  $advanced_help = module_exists('advanced_help') ? advanced_help_get_topics() : array();

  // Check for developer mode.
  $developer_mode = variable_get('df_developer_mode', FALSE);

  // Render Scenarios
  $list = array();
  $modules = df_get_scenario_modules();
  foreach ($modules as $name => $module) {
    // Skip dev scenarios if we're not in developer mode.
    if (!$developer_mode && isset($module->info['dev_scenario']) && $module->info['dev_scenario'] == TRUE) {
      continue;
    }
    // Compile individual scenario info array.
    $list[$module->name] = array(
      'name' => $module->info['name'],
      'links' => _df_admin_dfs_links($module),
      'description' => $module->info['description'],
    );
    // Append optional screenshot to scenario's info array.
    $screenshot = drupal_get_path('module', $module->name) . '/screenshot.png';
    if (file_exists($screenshot)) {
      $list[$module->name]['screenshot'] = '/' . $screenshot;
    }
    // Add optional advanced_help topic to scenario info array.
    if (isset($advanced_help[$module->name])) {
      $first_topic = array_shift($advanced_help[$module->name]);
      $list[$module->name]['help'] = theme('advanced_help_topic', array('module' => $module->name, 'topic' => $first_topic['name'], 'type' => t('Scenario script')));
    }
  }
  $page = array(
    '#theme' => 'df_admin_page_template',
    '#scenarios' => $list,
  );
  return render($page);
}

/**
 * Psuedo-private function used by df_admin_page callback.
 * @return
 *   returns an array of links.
 */
function _df_admin_dfs_links($module) {
  $links = array();
  $action = !module_exists($module->name) ? 'enable' : 'reset';
  $path = 'admin/df/' . $action . '/' . $module->name;
  $token = drupal_get_token(DRUPAL_ROOT . '/df/' . $action . '/' . $module->name);
  $links[] = l(t(ucwords($action)), $path, array('attributes' => array('class' => array('dfs-link')), 'query' => array('token' => $token)));
  // Add an uninstall button if needed
  if ($action == 'reset') {
    $path = 'admin/df/uninstall';
    $token = drupal_get_token(DRUPAL_ROOT . '/df/uninstall');
    $links[] = l(t('Uninstall'), $path, array('attributes' => array('class' => array('dfs-link')), 'query' => array('token' => $token)));
  }
  return $links;
}
