<?php
/**
 * @file
 * df_tools_analytics_dashboard.pages_default.inc
 */

/**
 * Implements hook_default_page_manager_pages().
 */
function df_tools_analytics_dashboard_default_page_manager_pages() {
  $page = new stdClass();
  $page->disabled = FALSE; /* Edit this to true to make a default page disabled initially */
  $page->api_version = 1;
  $page->name = 'ga_reports_dashboard';
  $page->task = 'page';
  $page->admin_title = 'Analytics Dashboard';
  $page->admin_description = '';
  $page->path = 'admin/reports/analytics';
  $page->access = array();
  $page->menu = array(
    'type' => 'none',
    'title' => 'Analytics',
    'name' => 'management',
    'weight' => '0',
    'parent' => array(
      'type' => 'none',
      'title' => '',
      'name' => 'navigation',
      'weight' => '0',
    ),
  );
  $page->arguments = array();
  $page->conf = array(
    'admin_paths' => FALSE,
  );
  $page->default_handlers = array();
  $handler = new stdClass();
  $handler->disabled = FALSE; /* Edit this to true to make a default handler disabled initially */
  $handler->api_version = 1;
  $handler->name = 'page_ga_reports_dashboard__panel_context_42fb3bdb-5a86-406a-991c-359a6e53461a';
  $handler->task = 'page';
  $handler->subtask = 'ga_reports_dashboard';
  $handler->handler = 'panel_context';
  $handler->weight = 0;
  $handler->conf = array(
    'title' => 'Panel',
    'no_blocks' => 1,
    'pipeline' => 'ipe',
    'body_classes_to_remove' => '',
    'body_classes_to_add' => '',
    'css_id' => '',
    'css' => '',
    'contexts' => array(),
    'relationships' => array(),
  );
  $display = new panels_display();
  $display->layout = 'demonstratie_layout_landing';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'top' => NULL,
      'top_first' => NULL,
      'top_second' => NULL,
      'top_third' => NULL,
      'top_fourth' => NULL,
      'middle_small' => NULL,
      'middle_large' => NULL,
      'middle_first' => NULL,
      'middle_second' => NULL,
      'bottom_first' => NULL,
      'bottom_second' => NULL,
      'bottom_third' => NULL,
      'bottom_fourth' => NULL,
      'bottom' => NULL,
      'primary_features' => NULL,
      'secondary_features' => NULL,
      'tertiary_features' => NULL,
      'quaternary_features' => NULL,
      'primary_supplements' => NULL,
      'secondary_supplements' => NULL,
      'tertiary_supplements' => NULL,
    ),
  );
  $display->cache = array();
  $display->title = 'Analytics Dashboard';
  $display->uuid = '88cb7ed7-b9aa-4e4f-8d4f-7e0ca5a07c15';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-1617af0e-db36-43a6-b6d4-0ded308c25c0';
    $pane->panel = 'primary_features';
    $pane->type = 'views';
    $pane->subtype = 'google_analytics_reports_summary';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_pager_settings' => 0,
      'use_pager' => 0,
      'nodes_per_page' => '0',
      'pager_id' => '0',
      'offset' => '0',
      'more_link' => 0,
      'feed_icons' => 0,
      'panel_args' => 0,
      'link_to_view' => 0,
      'args' => '',
      'url' => '',
      'display' => 'attachment_chart',
      'override_title' => 0,
      'override_title_text' => '',
      'override_title_heading' => 'h2',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '1617af0e-db36-43a6-b6d4-0ded308c25c0';
    $display->content['new-1617af0e-db36-43a6-b6d4-0ded308c25c0'] = $pane;
    $display->panels['primary_features'][0] = 'new-1617af0e-db36-43a6-b6d4-0ded308c25c0';
    $pane = new stdClass();
    $pane->pid = 'new-8e5d47a0-d5c1-454b-8a5c-2ed88c168aa8';
    $pane->panel = 'primary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'analytics_dashboard-ga_table_pane';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_settings' => 'table',
      'header_type' => 'titles',
      'view_mode' => 'teaser',
    );
    $pane->cache = array();
    $pane->style = array();
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 1;
    $pane->locks = array();
    $pane->uuid = '8e5d47a0-d5c1-454b-8a5c-2ed88c168aa8';
    $display->content['new-8e5d47a0-d5c1-454b-8a5c-2ed88c168aa8'] = $pane;
    $display->panels['primary_features'][1] = 'new-8e5d47a0-d5c1-454b-8a5c-2ed88c168aa8';
    $pane = new stdClass();
    $pane->pid = 'new-d0bfdd5b-1553-4797-828e-5dcd9929b131';
    $pane->panel = 'primary_features';
    $pane->type = 'views';
    $pane->subtype = 'google_analytics_reports_summary';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_pager_settings' => 0,
      'use_pager' => 0,
      'nodes_per_page' => '0',
      'pager_id' => '0',
      'offset' => '0',
      'more_link' => 0,
      'feed_icons' => 0,
      'panel_args' => 0,
      'link_to_view' => 0,
      'args' => '',
      'url' => '',
      'display' => 'attachment_top_pages',
      'override_title' => 0,
      'override_title_text' => '',
      'override_title_heading' => 'h2',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 2;
    $pane->locks = array();
    $pane->uuid = 'd0bfdd5b-1553-4797-828e-5dcd9929b131';
    $display->content['new-d0bfdd5b-1553-4797-828e-5dcd9929b131'] = $pane;
    $display->panels['primary_features'][2] = 'new-d0bfdd5b-1553-4797-828e-5dcd9929b131';
    $pane = new stdClass();
    $pane->pid = 'new-9d340646-aeac-4690-b0a8-645cb8e0b09b';
    $pane->panel = 'secondary_features';
    $pane->type = 'views';
    $pane->subtype = 'google_analytics_reports_summary';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_pager_settings' => 0,
      'use_pager' => 0,
      'nodes_per_page' => '0',
      'pager_id' => '0',
      'offset' => '0',
      'more_link' => 0,
      'feed_icons' => 0,
      'panel_args' => 0,
      'link_to_view' => 0,
      'args' => '',
      'url' => '',
      'display' => 'attachment_top_keywords',
      'override_title' => 0,
      'override_title_text' => '',
      'override_title_heading' => 'h2',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '9d340646-aeac-4690-b0a8-645cb8e0b09b';
    $display->content['new-9d340646-aeac-4690-b0a8-645cb8e0b09b'] = $pane;
    $display->panels['secondary_features'][0] = 'new-9d340646-aeac-4690-b0a8-645cb8e0b09b';
    $pane = new stdClass();
    $pane->pid = 'new-7fbc25ab-ad75-4440-b416-40b2761424d8';
    $pane->panel = 'tertiary_features';
    $pane->type = 'views';
    $pane->subtype = 'google_analytics_reports_summary';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_pager_settings' => 0,
      'use_pager' => 0,
      'nodes_per_page' => '0',
      'pager_id' => '0',
      'offset' => '0',
      'more_link' => 0,
      'feed_icons' => 0,
      'panel_args' => 0,
      'link_to_view' => 0,
      'args' => '',
      'url' => '',
      'display' => 'attachment_top_sources',
      'override_title' => 0,
      'override_title_text' => '',
      'override_title_heading' => 'h2',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '7fbc25ab-ad75-4440-b416-40b2761424d8';
    $display->content['new-7fbc25ab-ad75-4440-b416-40b2761424d8'] = $pane;
    $display->panels['tertiary_features'][0] = 'new-7fbc25ab-ad75-4440-b416-40b2761424d8';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = '0';
  $handler->conf['display'] = $display;
  $page->default_handlers[$handler->name] = $handler;
  $pages['ga_reports_dashboard'] = $page;

  return $pages;

}
