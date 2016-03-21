<?php
/**
 * @file
 * dfs_wem_commerce.panelizer.inc
 */

/**
 * Implements hook_panelizer_defaults().
 */
function dfs_wem_commerce_panelizer_defaults() {
  $export = array();

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'node:wem_commerce:default';
  $panelizer->title = '';
  $panelizer->panelizer_type = 'node';
  $panelizer->panelizer_key = 'wem_commerce';
  $panelizer->no_blocks = TRUE;
  $panelizer->css_id = '';
  $panelizer->css = '';
  $panelizer->pipeline = 'ipe';
  $panelizer->contexts = array();
  $panelizer->relationships = array();
  $panelizer->access = '';
  $panelizer->view_mode = '';
  $panelizer->css_class = '';
  $panelizer->title_element = 'H2';
  $panelizer->link_to_entity = TRUE;
  $panelizer->extra = '';
  $display = new panels_display();
  $display->layout = 'demonstratie_layout_split_features';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'center' => NULL,
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
      'sidebar' => NULL,
      'contentmain' => NULL,
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
  $display->title = '';
  $display->uuid = '7b608001-33ca-7cd4-0944-8d3dc4c651aa';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-bdb087c0-652f-1794-7d94-a76ebdcc09cd';
    $pane->panel = 'secondary_features';
    $pane->type = 'entity_field_extra';
    $pane->subtype = 'node:product:field_images';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_mode' => 'full',
      'context' => 'panelizer',
      'override_title' => 1,
      'override_title_text' => '',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'default',
        'hero' => 0,
        'layouts' => 'default',
        'styles' => 'default',
        'color_schemes' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'bdb087c0-652f-1794-7d94-a76ebdcc09cd';
    $display->content['new-bdb087c0-652f-1794-7d94-a76ebdcc09cd'] = $pane;
    $display->panels['secondary_features'][0] = 'new-bdb087c0-652f-1794-7d94-a76ebdcc09cd';
    $pane = new stdClass();
    $pane->pid = 'new-dd3e580f-c544-eba4-8179-e11371986148';
    $pane->panel = 'secondary_features';
    $pane->type = 'views';
    $pane->subtype = 'wem_commerce_product_reviews';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_pager_settings' => 0,
      'use_pager' => 1,
      'nodes_per_page' => '5',
      'pager_id' => '0',
      'offset' => '0',
      'more_link' => 0,
      'feed_icons' => 0,
      'panel_args' => 1,
      'link_to_view' => 0,
      'args' => '',
      'url' => '',
      'display' => 'block',
      'context' => array(
        0 => '',
      ),
      'override_title' => 1,
      'override_title_text' => '',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'default',
        'hero' => 0,
        'layouts' => 'default',
        'styles' => 'default',
        'color_schemes' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 1;
    $pane->locks = array();
    $pane->uuid = 'dd3e580f-c544-eba4-8179-e11371986148';
    $display->content['new-dd3e580f-c544-eba4-8179-e11371986148'] = $pane;
    $display->panels['secondary_features'][1] = 'new-dd3e580f-c544-eba4-8179-e11371986148';
    $pane = new stdClass();
    $pane->pid = 'new-f8066cfe-da08-fbd4-2d92-0906b0f9e40e';
    $pane->panel = 'tertiary_features';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:body';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'hidden',
      'formatter' => 'text_default',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(),
      'context' => 'panelizer',
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
    $pane->uuid = 'f8066cfe-da08-fbd4-2d92-0906b0f9e40e';
    $display->content['new-f8066cfe-da08-fbd4-2d92-0906b0f9e40e'] = $pane;
    $display->panels['tertiary_features'][0] = 'new-f8066cfe-da08-fbd4-2d92-0906b0f9e40e';
    $pane = new stdClass();
    $pane->pid = 'new-6b48b0ee-055f-59b4-518f-3f3aa89173e2';
    $pane->panel = 'tertiary_features';
    $pane->type = 'entity_field_extra';
    $pane->subtype = 'node:product:commerce_price';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_mode' => 'full',
      'context' => 'panelizer',
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
    $pane->uuid = '6b48b0ee-055f-59b4-518f-3f3aa89173e2';
    $display->content['new-6b48b0ee-055f-59b4-518f-3f3aa89173e2'] = $pane;
    $display->panels['tertiary_features'][1] = 'new-6b48b0ee-055f-59b4-518f-3f3aa89173e2';
    $pane = new stdClass();
    $pane->pid = 'new-c0e08693-b1a0-b014-29f7-f512519313a8';
    $pane->panel = 'tertiary_features';
    $pane->type = 'node_content';
    $pane->subtype = 'node_content';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'links' => 1,
      'no_extras' => 0,
      'override_title' => 1,
      'override_title_text' => '',
      'identifier' => '',
      'link' => 0,
      'leave_node_title' => 0,
      'build_mode' => 'token',
      'context' => array(),
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'default',
        'hero' => 0,
        'layouts' => 'default',
        'styles' => 'default',
        'color_schemes' => 'default',
        'button_styles' => 'call-to-action',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 2;
    $pane->locks = array();
    $pane->uuid = 'c0e08693-b1a0-b014-29f7-f512519313a8';
    $display->content['new-c0e08693-b1a0-b014-29f7-f512519313a8'] = $pane;
    $display->panels['tertiary_features'][2] = 'new-c0e08693-b1a0-b014-29f7-f512519313a8';
    $pane = new stdClass();
    $pane->pid = 'new-714db743-b5d1-482a-b698-127d5f8b08c0';
    $pane->panel = 'tertiary_features';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:field_wem_com_rel_interests';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'title',
      'formatter' => 'taxonomy_term_reference_link',
      'delta_limit' => '0',
      'delta_offset' => '0',
      'delta_reversed' => 0,
      'formatter_settings' => array(),
      'context' => array(),
      'override_title' => 0,
      'override_title_text' => '',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 3;
    $pane->locks = array();
    $pane->uuid = '714db743-b5d1-482a-b698-127d5f8b08c0';
    $display->content['new-714db743-b5d1-482a-b698-127d5f8b08c0'] = $pane;
    $display->panels['tertiary_features'][3] = 'new-714db743-b5d1-482a-b698-127d5f8b08c0';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = '0';
  $panelizer->display = $display;
  $export['node:wem_commerce:default'] = $panelizer;

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'node:wem_commerce:default:featured';
  $panelizer->title = 'Default';
  $panelizer->panelizer_type = 'node';
  $panelizer->panelizer_key = 'wem_commerce';
  $panelizer->no_blocks = FALSE;
  $panelizer->css_id = '';
  $panelizer->css = '';
  $panelizer->pipeline = 'standard';
  $panelizer->contexts = array();
  $panelizer->relationships = array();
  $panelizer->access = array();
  $panelizer->view_mode = 'featured';
  $panelizer->css_class = '';
  $panelizer->title_element = 'H2';
  $panelizer->link_to_entity = TRUE;
  $panelizer->extra = array();
  $display = new panels_display();
  $display->layout = 'flexible';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'center' => NULL,
    ),
  );
  $display->cache = array();
  $display->title = '%node:title';
  $display->uuid = '19576c77-4b1d-ab44-1151-f04dd607ec00';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-259208de-d7dd-63f4-89be-82bea2c00ca3';
    $pane->panel = 'center';
    $pane->type = 'entity_field_extra';
    $pane->subtype = 'node:product:field_images';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_mode' => 'featured',
      'context' => 'panelizer',
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
    $pane->uuid = '259208de-d7dd-63f4-89be-82bea2c00ca3';
    $display->content['new-259208de-d7dd-63f4-89be-82bea2c00ca3'] = $pane;
    $display->panels['center'][0] = 'new-259208de-d7dd-63f4-89be-82bea2c00ca3';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = '0';
  $panelizer->display = $display;
  $export['node:wem_commerce:default:featured'] = $panelizer;

  return $export;
}
