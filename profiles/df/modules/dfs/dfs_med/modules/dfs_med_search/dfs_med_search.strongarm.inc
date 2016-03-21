<?php
/**
 * @file
 * dfs_med_search.strongarm.inc
 */

/**
 * Implements hook_strongarm().
 */
function dfs_med_search_strongarm() {
  $export = array();

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'sa_admin_helper';
  $strongarm->value = 0;
  $export['sa_admin_helper'] = $strongarm;

  return $export;
}
