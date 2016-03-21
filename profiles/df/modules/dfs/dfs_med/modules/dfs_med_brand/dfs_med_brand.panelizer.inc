<?php
/**
 * @file
 * dfs_med_brand.panelizer.inc
 */

/**
 * Implements hook_panelizer_defaults().
 */
function dfs_med_brand_panelizer_defaults() {
  $export = array();

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'node:brand:default';
  $panelizer->title = 'Default';
  $panelizer->panelizer_type = 'node';
  $panelizer->panelizer_key = 'brand';
  $panelizer->no_blocks = TRUE;
  $panelizer->css_id = '';
  $panelizer->css = '';
  $panelizer->pipeline = 'ipe';
  $panelizer->contexts = array();
  $panelizer->relationships = array();
  $panelizer->access = array();
  $panelizer->view_mode = 'page_manager';
  $panelizer->css_class = '';
  $panelizer->title_element = 'H2';
  $panelizer->link_to_entity = TRUE;
  $panelizer->extra = array();
  $display = new panels_display();
  $display->layout = 'demonstratie_layout_single';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'center' => NULL,
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
  $display->title = '%node:title';
  $display->uuid = 'e8e2b429-403e-4c29-b81a-712bcedaef8c';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-6bee5ae8-dbf9-45b8-9754-1502d0f1ffbe';
    $pane->panel = 'primary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'brand_hero-panel_pane_1';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'context' => array(
        0 => 'panelizer',
      ),
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
    $pane->uuid = '6bee5ae8-dbf9-45b8-9754-1502d0f1ffbe';
    $display->content['new-6bee5ae8-dbf9-45b8-9754-1502d0f1ffbe'] = $pane;
    $display->panels['primary_features'][0] = 'new-6bee5ae8-dbf9-45b8-9754-1502d0f1ffbe';
    $pane = new stdClass();
    $pane->pid = 'new-ed923310-6d62-49e6-bb3b-39070a99deb7';
    $pane->panel = 'primary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'brand_hero-panel_pane_3';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'context' => array(
        0 => 'panelizer',
      ),
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
    $pane->uuid = 'ed923310-6d62-49e6-bb3b-39070a99deb7';
    $display->content['new-ed923310-6d62-49e6-bb3b-39070a99deb7'] = $pane;
    $display->panels['primary_features'][1] = 'new-ed923310-6d62-49e6-bb3b-39070a99deb7';
    $pane = new stdClass();
    $pane->pid = 'new-ebc92bdf-718c-4b55-8af8-f2101ca71577';
    $pane->panel = 'secondary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'brand_hero-panel_pane_2';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'context' => array(
        0 => 'panelizer',
      ),
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
    $pane->uuid = 'ebc92bdf-718c-4b55-8af8-f2101ca71577';
    $display->content['new-ebc92bdf-718c-4b55-8af8-f2101ca71577'] = $pane;
    $display->panels['secondary_features'][0] = 'new-ebc92bdf-718c-4b55-8af8-f2101ca71577';
  $display->hide_title = PANELS_TITLE_NONE;
  $display->title_pane = '0';
  $panelizer->display = $display;
  $export['node:brand:default'] = $panelizer;

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'node:brand:default:featured';
  $panelizer->title = 'Default';
  $panelizer->panelizer_type = 'node';
  $panelizer->panelizer_key = 'brand';
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
  $display->layout = 'foundation_2col';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'left' => NULL,
      'right' => NULL,
    ),
  );
  $display->cache = array();
  $display->title = '%node:title';
  $display->uuid = '53da7666-67ac-4ff1-8273-824093f301b3';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-f7c529bc-8574-4d05-afcd-50e38aafbfc5';
    $pane->panel = 'left';
    $pane->type = 'node_title';
    $pane->subtype = 'node_title';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'link' => 1,
      'markup' => 'h3',
      'id' => '',
      'class' => 'recommend-brand-title',
      'context' => 'panelizer',
      'override_title' => 0,
      'override_title_text' => '',
      'override_title_heading' => 'h2',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'hidden',
        'hero' => 'default',
        'layouts' => 'default',
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
    $pane->uuid = 'f7c529bc-8574-4d05-afcd-50e38aafbfc5';
    $display->content['new-f7c529bc-8574-4d05-afcd-50e38aafbfc5'] = $pane;
    $display->panels['left'][0] = 'new-f7c529bc-8574-4d05-afcd-50e38aafbfc5';
    $pane = new stdClass();
    $pane->pid = 'new-11ad662a-4cdc-4f8f-b55d-5c560d0ca276';
    $pane->panel = 'left';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:field_splash_image';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'hidden',
      'formatter' => 'file_image_image',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(
        'image_style' => 'episode-image',
        'image_link' => 'content',
        'quickedit' => array(
          'editor' => 'form',
        ),
      ),
      'context' => 'panelizer',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 1;
    $pane->locks = array();
    $pane->uuid = '11ad662a-4cdc-4f8f-b55d-5c560d0ca276';
    $display->content['new-11ad662a-4cdc-4f8f-b55d-5c560d0ca276'] = $pane;
    $display->panels['left'][1] = 'new-11ad662a-4cdc-4f8f-b55d-5c560d0ca276';
    $pane = new stdClass();
    $pane->pid = 'new-6b0c9cae-fe77-43a6-a750-211d1a341eb4';
    $pane->panel = 'left';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:body';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'hidden',
      'formatter' => 'text_plain',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(),
      'context' => array(),
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
    $pane->uuid = '6b0c9cae-fe77-43a6-a750-211d1a341eb4';
    $display->content['new-6b0c9cae-fe77-43a6-a750-211d1a341eb4'] = $pane;
    $display->panels['left'][2] = 'new-6b0c9cae-fe77-43a6-a750-211d1a341eb4';
    $pane = new stdClass();
    $pane->pid = 'new-d57ec2f2-b9cc-4b19-8979-f25db7a3ac5c';
    $pane->panel = 'right';
    $pane->type = 'views_panes';
    $pane->subtype = 'brand_hero-panel_pane_4';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'context' => array(
        0 => 'panelizer',
      ),
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
    $pane->uuid = 'd57ec2f2-b9cc-4b19-8979-f25db7a3ac5c';
    $display->content['new-d57ec2f2-b9cc-4b19-8979-f25db7a3ac5c'] = $pane;
    $display->panels['right'][0] = 'new-d57ec2f2-b9cc-4b19-8979-f25db7a3ac5c';
  $display->hide_title = PANELS_TITLE_NONE;
  $display->title_pane = '0';
  $panelizer->display = $display;
  $export['node:brand:default:featured'] = $panelizer;

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'node:brand:default:teaser';
  $panelizer->title = 'Default';
  $panelizer->panelizer_type = 'node';
  $panelizer->panelizer_key = 'brand';
  $panelizer->no_blocks = FALSE;
  $panelizer->css_id = '';
  $panelizer->css = '';
  $panelizer->pipeline = 'standard';
  $panelizer->contexts = array();
  $panelizer->relationships = array();
  $panelizer->access = array();
  $panelizer->view_mode = 'teaser';
  $panelizer->css_class = '';
  $panelizer->title_element = 'H2';
  $panelizer->link_to_entity = TRUE;
  $panelizer->extra = array();
  $display = new panels_display();
  $display->layout = 'foundation_1col';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'middle' => NULL,
    ),
  );
  $display->cache = array();
  $display->title = '%node:title';
  $display->uuid = '7088b53f-4c86-4f13-9c36-25a72cbedf4b';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-510be98b-9845-4233-8245-2a1caa311520';
    $pane->panel = 'middle';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:field_splash_image';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'hidden',
      'formatter' => 'file_image_image',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(
        'image_style' => 'letterbox-tablet',
        'image_link' => 'content',
        'quickedit' => array(
          'editor' => 'form',
        ),
      ),
      'context' => 'panelizer',
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
    $pane->uuid = '510be98b-9845-4233-8245-2a1caa311520';
    $display->content['new-510be98b-9845-4233-8245-2a1caa311520'] = $pane;
    $display->panels['middle'][0] = 'new-510be98b-9845-4233-8245-2a1caa311520';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = 'new-510be98b-9845-4233-8245-2a1caa311520';
  $panelizer->display = $display;
  $export['node:brand:default:teaser'] = $panelizer;

  return $export;
}
