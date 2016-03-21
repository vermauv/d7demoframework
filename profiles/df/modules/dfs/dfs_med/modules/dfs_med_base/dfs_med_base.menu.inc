<?php

/**
 * Implements of hook_menu()
 */
function dfs_med_base_menu(){
  $items['empty-page'] = array(
    'title' => 'Redirect',
    'description' => 'Redirect user.',
    'page callback' => '_dfs_med_base_redirect',
    'access arguments' => array('access content'),
  );
  return $items;
}

/**
 * Menu callback function.
 */
function _dfs_med_base_redirect() {
  drupal_goto('');
}

