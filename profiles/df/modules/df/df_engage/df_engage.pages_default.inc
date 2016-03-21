<?php
/**
 * @file
 * df_engage.pages_default.inc
 */

/**
 * Implements hook_default_page_manager_handlers().
 */
function df_engage_default_page_manager_handlers() {
  $export = array();

  $handler = new stdClass();
  $handler->disabled = FALSE; /* Edit this to true to make a default handler disabled initially */
  $handler->api_version = 1;
  $handler->name = 'user_view_panel_context';
  $handler->task = 'user_view';
  $handler->subtask = '';
  $handler->handler = 'panel_context';
  $handler->weight = -99;
  $handler->conf = array(
    'title' => 'User Profile',
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
  $display->layout = 'brown';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'slider' => NULL,
      'slidergutter' => NULL,
      'column1' => NULL,
      'column2' => NULL,
      'column3' => NULL,
      'footercolumn1' => NULL,
      'footercolumn2' => NULL,
      'footercolumn3' => NULL,
    ),
  );
  $display->cache = array();
  $display->title = '';
  $display->uuid = '7f9ea421-f150-21b4-d93a-44897a10c3f7';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-048392fe-a8a2-7e24-a9b6-04670d969884';
    $pane->panel = 'slider';
    $pane->type = 'views_panes';
    $pane->subtype = 'og_all_user_group_content-panel_pane_1';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_mode' => 'teaser',
      'widget_title' => NULL,
      'items_per_page' => NULL,
      'exposed' => array(
        'sort_by' => NULL,
        'sort_order' => NULL,
      ),
      'use_pager' => NULL,
      'pager_id' => NULL,
      'offset' => NULL,
      'link_to_view' => NULL,
      'more_link' => NULL,
      'path' => NULL,
      'view_settings' => 'nodes',
      'header_type' => 'none',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '048392fe-a8a2-7e24-a9b6-04670d969884';
    $display->content['new-048392fe-a8a2-7e24-a9b6-04670d969884'] = $pane;
    $display->panels['slider'][0] = 'new-048392fe-a8a2-7e24-a9b6-04670d969884';
    $pane = new stdClass();
    $pane->pid = 'new-aa69f402-fd14-89d4-71fc-acd2f4128cfa';
    $pane->panel = 'slidergutter';
    $pane->type = 'user_picture';
    $pane->subtype = 'user_picture';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'context' => 'argument_entity_id:user_1',
      'override_title' => 1,
      'override_title_text' => '',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'aa69f402-fd14-89d4-71fc-acd2f4128cfa';
    $display->content['new-aa69f402-fd14-89d4-71fc-acd2f4128cfa'] = $pane;
    $display->panels['slidergutter'][0] = 'new-aa69f402-fd14-89d4-71fc-acd2f4128cfa';
    $pane = new stdClass();
    $pane->pid = 'new-aed42bcc-e9a4-9ee4-b96a-c6062ce10983';
    $pane->panel = 'slidergutter';
    $pane->type = 'menu_tree';
    $pane->subtype = 'navigation';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'menu_name' => 'navigation',
      'parent_mlid' => 'navigation:0',
      'title_link' => 0,
      'admin_title' => '',
      'level' => '1',
      'follow' => 0,
      'depth' => 0,
      'expanded' => 0,
      'sort' => 0,
      'override_title' => 1,
      'override_title_text' => '',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 1;
    $pane->locks = array();
    $pane->uuid = 'aed42bcc-e9a4-9ee4-b96a-c6062ce10983';
    $display->content['new-aed42bcc-e9a4-9ee4-b96a-c6062ce10983'] = $pane;
    $display->panels['slidergutter'][1] = 'new-aed42bcc-e9a4-9ee4-b96a-c6062ce10983';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = '0';
  $handler->conf['display'] = $display;
  $export['user_view_panel_context'] = $handler;

  return $export;
}
