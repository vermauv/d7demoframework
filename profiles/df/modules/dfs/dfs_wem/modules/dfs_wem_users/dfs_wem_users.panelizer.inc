<?php
/**
 * @file
 * dfs_wem_users.panelizer.inc
 */

/**
 * Implements hook_panelizer_defaults().
 */
function dfs_wem_users_panelizer_defaults() {
  $export = array();

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'user:user:default';
  $panelizer->title = 'Default';
  $panelizer->panelizer_type = 'user';
  $panelizer->panelizer_key = 'user';
  $panelizer->no_blocks = FALSE;
  $panelizer->css_id = '';
  $panelizer->css = '';
  $panelizer->pipeline = 'standard';
  $panelizer->contexts = array();
  $panelizer->relationships = array();
  $panelizer->access = array();
  $panelizer->view_mode = 'page_manager';
  $panelizer->css_class = '';
  $panelizer->title_element = 'H2';
  $panelizer->link_to_entity = TRUE;
  $panelizer->extra = array();
  $display = new panels_display();
  $display->layout = 'demonstratie_layout_stagger';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'header_a' => NULL,
      'header_b' => NULL,
      'header_c' => NULL,
      'subheader_a' => NULL,
      'subheader_b' => NULL,
      'subheader_c' => NULL,
      'navigation' => NULL,
      'title' => NULL,
      'sidebar_a' => NULL,
      'body' => NULL,
      'sidebar_b' => NULL,
      'sidebar_c' => NULL,
      'footer_a' => NULL,
      'footer_b' => NULL,
      'footer_c' => NULL,
      'header' => NULL,
      'column1' => NULL,
      'column2' => NULL,
      'column3' => NULL,
      'secondarycolumn1' => NULL,
      'secondarycolumn2' => NULL,
      'secondarycolumn3' => NULL,
      'footer' => NULL,
      'primary_features' => array(
        'layouts' => 'default',
        'color_schemes' => 'alternate',
      ),
      'secondary_features' => NULL,
      'tertiary_features' => NULL,
      'quaternary_features' => NULL,
      'primary_supplements' => NULL,
      'secondary_supplements' => NULL,
      'tertiary_supplements' => NULL,
    ),
    'primary_features' => array(
      'style' => 'demonstratie_panels_styles',
    ),
  );
  $display->cache = array();
  $display->title = '';
  $display->uuid = '97673eeb-300d-e3a4-91ae-690529390358';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-0d457791-5eed-d004-255d-091b8f4f8475';
    $pane->panel = 'primary_features';
    $pane->type = 'entity_field';
    $pane->subtype = 'user:field_user_bio';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'hidden',
      'formatter' => 'text_default',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(),
      'context' => array(),
      'override_title' => 0,
      'override_title_text' => '',
      'view_mode' => NULL,
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
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '0d457791-5eed-d004-255d-091b8f4f8475';
    $display->content['new-0d457791-5eed-d004-255d-091b8f4f8475'] = $pane;
    $display->panels['primary_features'][0] = 'new-0d457791-5eed-d004-255d-091b8f4f8475';
    $pane = new stdClass();
    $pane->pid = 'new-b1866061-e88e-9234-5972-2fb7510e4169';
    $pane->panel = 'quaternary_features';
    $pane->type = 'entity_field';
    $pane->subtype = 'user:field_user_interests';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'title',
      'formatter' => 'taxonomy_term_reference_link',
      'delta_limit' => '0',
      'delta_offset' => '0',
      'delta_reversed' => 1,
      'formatter_settings' => array(),
      'context' => 'panelizer',
      'override_title' => 1,
      'override_title_text' => 'Interests',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'b1866061-e88e-9234-5972-2fb7510e4169';
    $display->content['new-b1866061-e88e-9234-5972-2fb7510e4169'] = $pane;
    $display->panels['quaternary_features'][0] = 'new-b1866061-e88e-9234-5972-2fb7510e4169';
    $pane = new stdClass();
    $pane->pid = 'new-e993f9fd-c02d-45f4-856c-314ead194b72';
    $pane->panel = 'secondary_features';
    $pane->type = 'views';
    $pane->subtype = 'wem_user_picture';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_pager_settings' => 0,
      'use_pager' => 1,
      'nodes_per_page' => '0',
      'pager_id' => '0',
      'offset' => '0',
      'more_link' => 0,
      'feed_icons' => 0,
      'panel_args' => 0,
      'link_to_view' => 0,
      'args' => '',
      'url' => '',
      'display' => 'default',
      'context' => array(
        0 => 'panelizer.uid',
      ),
      'override_title' => 0,
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
    $pane->uuid = 'e993f9fd-c02d-45f4-856c-314ead194b72';
    $display->content['new-e993f9fd-c02d-45f4-856c-314ead194b72'] = $pane;
    $display->panels['secondary_features'][0] = 'new-e993f9fd-c02d-45f4-856c-314ead194b72';
    $pane = new stdClass();
    $pane->pid = 'new-6cd05f81-7e44-6654-25fe-b55a295f941f';
    $pane->panel = 'tertiary_features';
    $pane->type = 'views';
    $pane->subtype = 'wem_travel_friend';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_pager_settings' => 0,
      'use_pager' => 1,
      'nodes_per_page' => '0',
      'pager_id' => '0',
      'offset' => '0',
      'more_link' => 0,
      'feed_icons' => 0,
      'panel_args' => 1,
      'link_to_view' => 0,
      'args' => '',
      'url' => '',
      'display' => 'default',
      'context' => array(
        0 => 'panelizer.uid',
        1 => '',
      ),
      'override_title' => 0,
      'override_title_text' => '',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'default',
        'hero' => 0,
        'layouts' => 'horizontal',
        'styles' => 'feature_small',
        'color_schemes' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '6cd05f81-7e44-6654-25fe-b55a295f941f';
    $display->content['new-6cd05f81-7e44-6654-25fe-b55a295f941f'] = $pane;
    $display->panels['tertiary_features'][0] = 'new-6cd05f81-7e44-6654-25fe-b55a295f941f';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = '0';
  $panelizer->display = $display;
  $export['user:user:default'] = $panelizer;

  return $export;
}
