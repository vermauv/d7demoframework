<?php
/**
 * @file
 * dfs_wem.pages_default.inc
 */

/**
 * Implements hook_default_page_manager_pages().
 */
function dfs_wem_default_page_manager_pages() {
  $page = new stdClass();
  $page->disabled = FALSE; /* Edit this to true to make a default page disabled initially */
  $page->api_version = 1;
  $page->name = 'dfs_wem_contests';
  $page->task = 'page';
  $page->admin_title = 'Nexus Contests';
  $page->admin_description = '';
  $page->path = 'contests';
  $page->access = array(
    'type' => 'none',
    'settings' => NULL,
  );
  $page->menu = array(
    'type' => 'normal',
    'title' => 'Free Vacations',
    'name' => 'main-menu',
    'weight' => '3',
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
  $handler->name = 'page_dfs_wem_contests_panel_context';
  $handler->task = 'page';
  $handler->subtask = 'dfs_wem_contests';
  $handler->handler = 'panel_context';
  $handler->weight = 0;
  $handler->conf = array(
    'title' => 'Nexus Contests',
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
  $display->uuid = 'e1b83de6-584c-4d86-899a-9d2ae945b9a7';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-d0feccae-946f-44c3-9984-98e16828497b';
    $pane->panel = 'primary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'wem_user_contests-contests_pane';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_settings' => 'fields',
      'header_type' => 'none',
      'view_mode' => 'teaser',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'hidden',
        'hero' => 'hero',
        'layouts' => 'default',
        'styles' => 'feature_large',
        'color_schemes' => 'default',
        'button_styles' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'd0feccae-946f-44c3-9984-98e16828497b';
    $display->content['new-d0feccae-946f-44c3-9984-98e16828497b'] = $pane;
    $display->panels['primary_features'][0] = 'new-d0feccae-946f-44c3-9984-98e16828497b';
  $display->hide_title = PANELS_TITLE_NONE;
  $display->title_pane = 'new-d0feccae-946f-44c3-9984-98e16828497b';
  $handler->conf['display'] = $display;
  $page->default_handlers[$handler->name] = $handler;
  $pages['dfs_wem_contests'] = $page;

  $page = new stdClass();
  $page->disabled = FALSE; /* Edit this to true to make a default page disabled initially */
  $page->api_version = 1;
  $page->name = 'dfs_wem_guides';
  $page->task = 'page';
  $page->admin_title = 'Travel Guides';
  $page->admin_description = '';
  $page->path = 'guides';
  $page->access = array(
    'type' => 'none',
    'settings' => NULL,
  );
  $page->menu = array(
    'type' => 'normal',
    'title' => 'Travel Guides',
    'name' => 'main-menu',
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
  $handler->name = 'page_dfs_wem_guides_panel_context';
  $handler->task = 'page';
  $handler->subtask = 'dfs_wem_guides';
  $handler->handler = 'panel_context';
  $handler->weight = 0;
  $handler->conf = array(
    'title' => 'Landing page',
    'no_blocks' => FALSE,
    'pipeline' => 'ipe',
    'body_classes_to_remove' => '',
    'body_classes_to_add' => '',
    'css_id' => '',
    'css' => '',
    'contexts' => array(),
    'relationships' => array(),
  );
  $display = new panels_display();
  $display->layout = 'demonstratie_layout_single';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'header' => NULL,
      'column1' => NULL,
      'column2' => NULL,
      'column3' => NULL,
      'secondarycolumn1' => NULL,
      'secondarycolumn2' => NULL,
      'secondarycolumn3' => NULL,
      'footer' => NULL,
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
  $display->title = 'Travel Guides';
  $display->uuid = '45166c66-99d9-1264-bd56-be9359584c59';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-45eff56d-be2d-c5f4-d968-f6d6149207a9';
    $pane->panel = 'primary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'wem_news_guides-panel_pane_1';
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
      'view_settings' => 'fields',
      'header_type' => 'none',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'default',
        'hero' => 'default',
        'layouts' => 'horizontal',
        'styles' => 'feature_small',
        'color_schemes' => 'reverse',
        'button_styles' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '45eff56d-be2d-c5f4-d968-f6d6149207a9';
    $display->content['new-45eff56d-be2d-c5f4-d968-f6d6149207a9'] = $pane;
    $display->panels['primary_features'][0] = 'new-45eff56d-be2d-c5f4-d968-f6d6149207a9';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = '0';
  $handler->conf['display'] = $display;
  $page->default_handlers[$handler->name] = $handler;
  $pages['dfs_wem_guides'] = $page;

  $page = new stdClass();
  $page->disabled = FALSE; /* Edit this to true to make a default page disabled initially */
  $page->api_version = 1;
  $page->name = 'dfs_wem_home';
  $page->task = 'page';
  $page->admin_title = 'DFS WEM Home';
  $page->admin_description = 'Homepage panel for the WEM Demo Framework Scenario.';
  $page->path = 'dfs-wem-home';
  $page->access = array(
    'type' => 'none',
    'settings' => NULL,
  );
  $page->menu = array();
  $page->arguments = array();
  $page->conf = array(
    'admin_paths' => FALSE,
  );
  $page->default_handlers = array();
  $handler = new stdClass();
  $handler->disabled = FALSE; /* Edit this to true to make a default handler disabled initially */
  $handler->api_version = 1;
  $handler->name = 'page_dfs_wem_home_panel_context';
  $handler->task = 'page';
  $handler->subtask = 'dfs_wem_home';
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
    'contexts' => array(
      0 => array(
        'identifier' => 'Logged in User',
        'keyword' => 'user',
        'name' => 'user',
        'type' => 'current',
        'uid' => '',
        'id' => 1,
      ),
    ),
    'relationships' => array(),
  );
  $display = new panels_display();
  $display->layout = 'demonstratie_layout_landing';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'slider' => NULL,
      'slidergutter' => NULL,
      'column1' => NULL,
      'column2' => NULL,
      'column3' => NULL,
      'sidebar' => NULL,
      'contentheader' => NULL,
      'contentcolumn1' => NULL,
      'contentcolumn2' => NULL,
      'header' => NULL,
      'secondarycolumn1' => NULL,
      'secondarycolumn2' => NULL,
      'secondarycolumn3' => NULL,
      'footer' => NULL,
      'title' => NULL,
      'navigation' => NULL,
      'header_a' => NULL,
      'header_b' => NULL,
      'header_c' => NULL,
      'subheader_a' => NULL,
      'subheader_b' => NULL,
      'subheader_c' => NULL,
      'subheader_d' => NULL,
      'body' => NULL,
      'sidebar_a' => NULL,
      'sidebar_b' => NULL,
      'sidebar_c' => NULL,
      'sidebar_d' => NULL,
      'footer_a' => NULL,
      'footer_b' => NULL,
      'footer_c' => NULL,
      'primary_features' => NULL,
      'secondary_features' => NULL,
      'tertiary_features' => NULL,
      'secondary_supplements' => NULL,
      'tertiary_supplements' => NULL,
      'quaternary_features' => NULL,
      'primary_supplements' => NULL,
    ),
    'quaternary_features' => array(
      'style' => '0',
    ),
    'primary_supplements' => array(
      'style' => '0',
    ),
    'secondary_supplements' => array(
      'style' => '0',
    ),
    'tertiary_supplements' => array(
      'style' => '0',
    ),
  );
  $display->cache = array();
  $display->title = '';
  $display->uuid = '630b06fd-e5d2-ad14-e166-7038baa8a6e8';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-b71b4095-7344-dca4-2989-b298ef85de65';
    $pane->panel = 'primary_features';
    $pane->type = 'block';
    $pane->subtype = 'bean-wem---user-related-news-item';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_title' => 0,
      'override_title_text' => '',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'hidden',
        'hero' => 'hero',
        'layouts' => 'default',
        'styles' => 'feature_large',
        'color_schemes' => 'default',
        'button_styles' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'b71b4095-7344-dca4-2989-b298ef85de65';
    $display->content['new-b71b4095-7344-dca4-2989-b298ef85de65'] = $pane;
    $display->panels['primary_features'][0] = 'new-b71b4095-7344-dca4-2989-b298ef85de65';
    $pane = new stdClass();
    $pane->pid = 'new-43b030f7-0d8f-4416-b564-ef67dda6a8ee';
    $pane->panel = 'primary_supplements';
    $pane->type = 'views_panes';
    $pane->subtype = 'wem_videos-homepage_videos_pane';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_settings' => 'fields',
      'header_type' => 'none',
      'view_mode' => 'teaser',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'inline',
        'hero' => 'default',
        'layouts' => 'horizontal',
        'styles' => 'feature_small',
        'color_schemes' => 'reverse',
        'button_styles' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '43b030f7-0d8f-4416-b564-ef67dda6a8ee';
    $display->content['new-43b030f7-0d8f-4416-b564-ef67dda6a8ee'] = $pane;
    $display->panels['primary_supplements'][0] = 'new-43b030f7-0d8f-4416-b564-ef67dda6a8ee';
    $pane = new stdClass();
    $pane->pid = 'new-52295884-7639-2034-7d30-b8660f3c7f36';
    $pane->panel = 'quaternary_features';
    $pane->type = 'block';
    $pane->subtype = 'bean-wem---user-related-news';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_title' => 1,
      'override_title_text' => 'Guides',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'hidden',
        'hero' => 0,
        'layouts' => 'horizontal',
        'styles' => 'feature_small',
        'color_schemes' => 'alternate',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '52295884-7639-2034-7d30-b8660f3c7f36';
    $display->content['new-52295884-7639-2034-7d30-b8660f3c7f36'] = $pane;
    $display->panels['quaternary_features'][0] = 'new-52295884-7639-2034-7d30-b8660f3c7f36';
    $pane = new stdClass();
    $pane->pid = 'new-953f95bb-2b79-7ec4-a124-969a0e13177f';
    $pane->panel = 'secondary_features';
    $pane->type = 'block';
    $pane->subtype = 'bean-wem---user-related-product-prima';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_title' => 1,
      'override_title_text' => 'Featured Package',
    );
    $pane->cache = array();
    $pane->style = array(
      'style' => 'demonstratie_panels_styles',
      'settings' => array(
        'title' => 'banner',
        'hero' => 0,
        'layouts' => 'default',
        'styles' => 'feature_medium',
        'color_schemes' => 'default',
      ),
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '953f95bb-2b79-7ec4-a124-969a0e13177f';
    $display->content['new-953f95bb-2b79-7ec4-a124-969a0e13177f'] = $pane;
    $display->panels['secondary_features'][0] = 'new-953f95bb-2b79-7ec4-a124-969a0e13177f';
    $pane = new stdClass();
    $pane->pid = 'new-00f8392f-b6c3-4a6a-af76-c459e2cc3c53';
    $pane->panel = 'secondary_supplements';
    $pane->type = 'views_panes';
    $pane->subtype = 'wem_tweets-wem_tweets_pane';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_settings' => 'fields',
      'header_type' => 'none',
      'view_mode' => 'teaser',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'inline',
        'hero' => 'default',
        'layouts' => 'horizontal',
        'styles' => 'default',
        'color_schemes' => 'default',
        'button_styles' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '00f8392f-b6c3-4a6a-af76-c459e2cc3c53';
    $display->content['new-00f8392f-b6c3-4a6a-af76-c459e2cc3c53'] = $pane;
    $display->panels['secondary_supplements'][0] = 'new-00f8392f-b6c3-4a6a-af76-c459e2cc3c53';
    $pane = new stdClass();
    $pane->pid = 'new-f2eb873d-e89a-4191-9530-99f208cf8b57';
    $pane->panel = 'tertiary_features';
    $pane->type = 'block';
    $pane->subtype = 'bean-wem---user-related-contest';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_title' => 0,
      'override_title_text' => '',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'banner',
        'hero' => 'default',
        'layouts' => 'default',
        'styles' => 'feature_medium',
        'color_schemes' => 'default',
        'button_styles' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'f2eb873d-e89a-4191-9530-99f208cf8b57';
    $display->content['new-f2eb873d-e89a-4191-9530-99f208cf8b57'] = $pane;
    $display->panels['tertiary_features'][0] = 'new-f2eb873d-e89a-4191-9530-99f208cf8b57';
    $pane = new stdClass();
    $pane->pid = 'new-3da35775-9d33-4aea-afb1-5d9cc15f4fb0';
    $pane->panel = 'tertiary_supplements';
    $pane->type = 'block';
    $pane->subtype = 'bean-wem---user-more-contests';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_title' => 1,
      'override_title_text' => '',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'default',
        'hero' => 'default',
        'layouts' => 'horizontal',
        'styles' => 'feature_small',
        'color_schemes' => 'default',
        'button_styles' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '3da35775-9d33-4aea-afb1-5d9cc15f4fb0';
    $display->content['new-3da35775-9d33-4aea-afb1-5d9cc15f4fb0'] = $pane;
    $display->panels['tertiary_supplements'][0] = 'new-3da35775-9d33-4aea-afb1-5d9cc15f4fb0';
  $display->hide_title = PANELS_TITLE_NONE;
  $display->title_pane = '0';
  $handler->conf['display'] = $display;
  $page->default_handlers[$handler->name] = $handler;
  $pages['dfs_wem_home'] = $page;

  $page = new stdClass();
  $page->disabled = FALSE; /* Edit this to true to make a default page disabled initially */
  $page->api_version = 1;
  $page->name = 'dfs_wem_trips';
  $page->task = 'page';
  $page->admin_title = 'Trip Packages';
  $page->admin_description = '';
  $page->path = 'trips';
  $page->access = array(
    'type' => 'none',
    'settings' => NULL,
  );
  $page->menu = array(
    'type' => 'normal',
    'title' => 'Trip Packages',
    'name' => 'main-menu',
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
  $handler->name = 'page_dfs_wem_trips_panel_context';
  $handler->task = 'page';
  $handler->subtask = 'dfs_wem_trips';
  $handler->handler = 'panel_context';
  $handler->weight = 0;
  $handler->conf = array(
    'title' => 'Landing page',
    'no_blocks' => FALSE,
    'pipeline' => 'ipe',
    'body_classes_to_remove' => '',
    'body_classes_to_add' => '',
    'css_id' => '',
    'css' => '',
    'contexts' => array(),
    'relationships' => array(),
  );
  $display = new panels_display();
  $display->layout = 'demonstratie_layout_stagger';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'column1' => NULL,
      'column2' => NULL,
      'header' => NULL,
      'primary_features' => NULL,
      'secondary_features' => NULL,
      'tertiary_features' => NULL,
      'quaternary_features' => NULL,
      'primary_supplements' => NULL,
      'secondary_supplements' => NULL,
      'tertiary_supplements' => NULL,
      'footer' => NULL,
    ),
  );
  $display->cache = array();
  $display->title = 'Nexus Trip Packages';
  $display->uuid = 'e75b73b4-8ca6-7aa4-2d2a-6768522e4c09';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-4b4e559d-5063-c1d4-eda3-1da6a69dd68d';
    $pane->panel = 'header';
    $pane->type = 'views_panes';
    $pane->subtype = 'wem_commerce_trips-panel_pane_1';
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
      'view_settings' => 'fields',
      'header_type' => 'none',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'banner',
        'hero' => 0,
        'layouts' => 'horizontal',
        'styles' => 'feature_small',
        'color_schemes' => 'alternate',
        'button_styles' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '4b4e559d-5063-c1d4-eda3-1da6a69dd68d';
    $display->content['new-4b4e559d-5063-c1d4-eda3-1da6a69dd68d'] = $pane;
    $display->panels['header'][0] = 'new-4b4e559d-5063-c1d4-eda3-1da6a69dd68d';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = '0';
  $handler->conf['display'] = $display;
  $page->default_handlers[$handler->name] = $handler;
  $pages['dfs_wem_trips'] = $page;

  $page = new stdClass();
  $page->disabled = FALSE; /* Edit this to true to make a default page disabled initially */
  $page->api_version = 1;
  $page->name = 'dfs_wem_videos';
  $page->task = 'page';
  $page->admin_title = 'Video Tours';
  $page->admin_description = '';
  $page->path = 'tours';
  $page->access = array(
    'type' => 'none',
    'settings' => NULL,
  );
  $page->menu = array(
    'type' => 'normal',
    'title' => 'Video Tours',
    'name' => 'main-menu',
    'weight' => '2',
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
  $handler->name = 'page_dfs_wem_videos_panel_context';
  $handler->task = 'page';
  $handler->subtask = 'dfs_wem_videos';
  $handler->handler = 'panel_context';
  $handler->weight = 0;
  $handler->conf = array(
    'title' => 'Video Tours',
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
  $display->layout = 'demonstratie_layout_single';
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
  $display->uuid = '7a2fd760-84e8-4527-90c2-fef497a15eb8';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-2bbe68b2-8e7e-44ae-a9d3-a64803e96946';
    $pane->panel = 'primary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'wem_videos-panel_pane_1';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_settings' => 'fields',
      'header_type' => 'none',
      'view_mode' => 'teaser',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'hidden',
        'hero' => 'default',
        'layouts' => 'horizontal',
        'styles' => 'feature_small',
        'color_schemes' => 'reverse',
        'button_styles' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '2bbe68b2-8e7e-44ae-a9d3-a64803e96946';
    $display->content['new-2bbe68b2-8e7e-44ae-a9d3-a64803e96946'] = $pane;
    $display->panels['primary_features'][0] = 'new-2bbe68b2-8e7e-44ae-a9d3-a64803e96946';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = 'new-2bbe68b2-8e7e-44ae-a9d3-a64803e96946';
  $handler->conf['display'] = $display;
  $page->default_handlers[$handler->name] = $handler;
  $pages['dfs_wem_videos'] = $page;

  return $pages;

}
