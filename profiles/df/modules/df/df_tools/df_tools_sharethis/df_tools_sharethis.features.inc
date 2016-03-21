<?php
/**
 * @file
 * df_tools_sharethis.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function df_tools_sharethis_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "strongarm" && $api == "strongarm") {
    return array("version" => "1");
  }
}

