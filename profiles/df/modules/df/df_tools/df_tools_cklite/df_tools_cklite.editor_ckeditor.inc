<?php

/**
 * @file
 * Editor CKEditor integration for the df_tools_cklite module.
 */

/**
 * Implements hook_editor_ckeditor_plugins().
 */
function df_tools_cklite_editor_ckeditor_plugins() {
  $plugins = array();

  // Only declare the CKEditor plugin if the LITE library is available.
  if ($library = libraries_detect('lite')) {
    $path = $library['library path'] . '/' . $library['path'];

    // Plugin for tracking changes within CKEditor.
    $plugins['lite'] = array(
      'path' => $path,
      'file' => 'plugin.js',
      'buttons' => array(
        'lite-acceptall' => array(
          'label' => 'Accept all changes',
          'image' => $path . '/icons/lite-acceptall.png',
        ),
        'lite-rejectall' => array(
          'label' => 'Reject all changes',
          'image' => $path . '/icons/lite-rejectall.png',
        ),
        'lite-acceptone' => array(
          'label' => 'Accept change',
          'image' => $path . '/icons/lite-acceptone.png',
        ),
        'lite-rejectone' => array(
          'label' => 'Reject change',
          'image' => $path . '/icons/lite-rejectone.png',
        ),
        'lite-toggleshow' => array(
          'label' => 'Show/hide tracked changes',
          'image' => $path . '/icons/lite-toggleshow.png',
        ),
        'lite-toggletracking' => array(
          'label' => 'Start/stop tracking changes',
          'image' => $path . '/icons/lite-toggletracking.png',
        ),
      ),
    );
  }

  return $plugins;
}

/**
 * Implements hook_filter_js_settings_alter().
 */
function df_tools_cklite_filter_js_settings_alter(&$settings) {
  global $user;

  if (!empty($settings['filtered_html'])) {
    // Pass the current user's name and ID to lite to associate with changes.
    $settings['filtered_html']['editorSettings']['lite'] = array(
      'userId' => $user->uid,
      'userName' => format_username($user),
    );
  }
}
