<?php
/**
 * @file
 * dfs_med_theme.strongarm.inc
 */

/**
 * Implements hook_strongarm().
 */
function dfs_med_theme_strongarm() {
  $export = array();

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'theme_med_settings';
  $strongarm->value = array(
    'toggle_logo' => 1,
    'toggle_name' => 0,
    'toggle_slogan' => 0,
    'toggle_node_user_picture' => 1,
    'toggle_comment_user_picture' => 1,
    'toggle_comment_user_verification' => 1,
    'toggle_favicon' => 1,
    'toggle_main_menu' => 1,
    'toggle_secondary_menu' => 0,
    'default_logo' => 1,
    'logo_path' => '',
    'logo_upload' => '',
    'default_favicon' => 0,
    'favicon_path' => 'profiles/df/themes/med/favicon.ico',
    'favicon_upload' => '',
    'zurb_foundation_top_bar_enable' => '0',
    'zurb_foundation_top_bar_grid' => 0,
    'zurb_foundation_top_bar_sticky' => 0,
    'zurb_foundation_top_bar_scrolltop' => 1,
    'zurb_foundation_top_bar_is_hover' => 1,
    'zurb_foundation_top_bar_menu_text' => 'Menu',
    'zurb_foundation_top_bar_custom_back_text' => 1,
    'zurb_foundation_top_bar_back_text' => 'Back',
    'zurb_foundation_tooltip_enable' => 1,
    'zurb_foundation_tooltip_position' => 'tip-top',
    'zurb_foundation_tooltip_mode' => 'text',
    'zurb_foundation_tooltip_text' => 'More information?',
    'zurb_foundation_tooltip_touch' => 0,
    'zurb_foundation_disable_core_css' => 0,
    'zurb_foundation_html_tags' => 1,
    'zurb_foundation_messages_modal' => 0,
    'zurb_foundation_pager_center' => 1,
    'zurb_foundation__active_tab' => 'edit-general',
    'nice_menus_custom_css' => '',
    'favicon_mimetype' => 'image/vnd.microsoft.icon',
  );
  $export['theme_med_settings'] = $strongarm;

  return $export;
}
