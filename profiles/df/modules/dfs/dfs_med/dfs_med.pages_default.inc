<?php
/**
 * @file
 * dfs_med.pages_default.inc
 */

/**
 * Implements hook_default_page_manager_pages().
 */
function dfs_med_default_page_manager_pages() {
  $page = new stdClass();
  $page->disabled = FALSE; /* Edit this to true to make a default page disabled initially */
  $page->api_version = 1;
  $page->name = 'dfs_med_home';
  $page->task = 'page';
  $page->admin_title = 'DFS MED Home';
  $page->admin_description = 'Media and Entertainment site homepage';
  $page->path = 'dfs-med-home';
  $page->access = array();
  $page->menu = array();
  $page->arguments = array();
  $page->conf = array(
    'admin_paths' => FALSE,
  );
  $page->default_handlers = array();
  $handler = new stdClass();
  $handler->disabled = FALSE; /* Edit this to true to make a default handler disabled initially */
  $handler->api_version = 1;
  $handler->name = 'page_dfs_med_home_panel_context';
  $handler->task = 'page';
  $handler->subtask = 'dfs_med_home';
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
  $display->layout = 'demonstratie_layout_split_features';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
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
  $display->title = '';
  $display->uuid = '4da3b870-0ef1-4194-8d2d-e78395d3ddbc';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-07198e9c-d581-41ec-89e2-ce52d99ffb2a';
    $pane->panel = 'primary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'new_products-new_products_pane';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_settings' => 'fields',
      'header_type' => 'none',
      'view_mode' => 'teaser',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '07198e9c-d581-41ec-89e2-ce52d99ffb2a';
    $display->content['new-07198e9c-d581-41ec-89e2-ce52d99ffb2a'] = $pane;
    $display->panels['primary_features'][0] = 'new-07198e9c-d581-41ec-89e2-ce52d99ffb2a';
    $pane = new stdClass();
    $pane->pid = 'new-466d3159-ee42-4b2a-afe3-14eba9352125';
    $pane->panel = 'primary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'brand_carousel-brand_carousel_pane';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_settings' => 'fields',
      'header_type' => 'none',
      'view_mode' => 'teaser',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 1;
    $pane->locks = array();
    $pane->uuid = '466d3159-ee42-4b2a-afe3-14eba9352125';
    $display->content['new-466d3159-ee42-4b2a-afe3-14eba9352125'] = $pane;
    $display->panels['primary_features'][1] = 'new-466d3159-ee42-4b2a-afe3-14eba9352125';
    $pane = new stdClass();
    $pane->pid = 'new-66f8e593-0b71-468c-a17a-3468656ce2a1';
    $pane->panel = 'primary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'article_callout-article_pane';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_settings' => 'fields',
      'header_type' => 'none',
      'view_mode' => 'teaser',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 2;
    $pane->locks = array();
    $pane->uuid = '66f8e593-0b71-468c-a17a-3468656ce2a1';
    $display->content['new-66f8e593-0b71-468c-a17a-3468656ce2a1'] = $pane;
    $display->panels['primary_features'][2] = 'new-66f8e593-0b71-468c-a17a-3468656ce2a1';
    $pane = new stdClass();
    $pane->pid = 'new-f6eee760-7970-41cd-bda9-a108736b2052';
    $pane->panel = 'quaternary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'collection_showcase-featured_collection_pane';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_settings' => 'fields',
      'header_type' => 'none',
      'view_mode' => 'teaser',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'f6eee760-7970-41cd-bda9-a108736b2052';
    $display->content['new-f6eee760-7970-41cd-bda9-a108736b2052'] = $pane;
    $display->panels['quaternary_features'][0] = 'new-f6eee760-7970-41cd-bda9-a108736b2052';
    $pane = new stdClass();
    $pane->pid = 'new-8c3d939a-260d-4513-947e-84d8c88c5fbe';
    $pane->panel = 'secondary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'bestselling_products-featured_bestseller_pane';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_settings' => 'fields',
      'header_type' => 'none',
      'view_mode' => 'teaser',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '8c3d939a-260d-4513-947e-84d8c88c5fbe';
    $display->content['new-8c3d939a-260d-4513-947e-84d8c88c5fbe'] = $pane;
    $display->panels['secondary_features'][0] = 'new-8c3d939a-260d-4513-947e-84d8c88c5fbe';
    $pane = new stdClass();
    $pane->pid = 'new-1910d568-ea7e-4c78-b939-366081b234a8';
    $pane->panel = 'tertiary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'bestselling_products-bestseller_secondary_pane';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_settings' => 'fields',
      'header_type' => 'none',
      'view_mode' => 'teaser',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '1910d568-ea7e-4c78-b939-366081b234a8';
    $display->content['new-1910d568-ea7e-4c78-b939-366081b234a8'] = $pane;
    $display->panels['tertiary_features'][0] = 'new-1910d568-ea7e-4c78-b939-366081b234a8';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = 'new-07198e9c-d581-41ec-89e2-ce52d99ffb2a';
  $handler->conf['display'] = $display;
  $page->default_handlers[$handler->name] = $handler;
  $pages['dfs_med_home'] = $page;

  return $pages;

}
