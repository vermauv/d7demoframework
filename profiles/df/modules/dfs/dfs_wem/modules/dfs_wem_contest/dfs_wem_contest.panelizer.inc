<?php
/**
 * @file
 * dfs_wem_contest.panelizer.inc
 */

/**
 * Implements hook_panelizer_defaults().
 */
function dfs_wem_contest_panelizer_defaults() {
  $export = array();

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'node:wem_contest:default';
  $panelizer->title = '';
  $panelizer->panelizer_type = 'node';
  $panelizer->panelizer_key = 'wem_contest';
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
  $display->layout = 'demonstratie_layout_stagger';
  $display->layout_settings = array();
  $display->panel_settings = array(
    'style_settings' => array(
      'default' => NULL,
      'center' => NULL,
      'sidebar' => NULL,
      'contentmain' => NULL,
      'header' => NULL,
      'primary_features' => NULL,
      'secondary_features' => NULL,
      'tertiary_features' => NULL,
      'quaternary_features' => array(
        'layouts' => 'default',
        'color_schemes' => 'alternate',
      ),
      'primary_supplements' => NULL,
      'secondary_supplements' => NULL,
      'tertiary_supplements' => NULL,
      'footer' => NULL,
    ),
    'quaternary_features' => array(
      'style' => 'demonstratie_panels_styles',
    ),
  );
  $display->cache = array();
  $display->title = '';
  $display->uuid = '62c0459d-4510-ac04-51a7-7c2b0850afcb';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-78e21651-9af4-9ac4-6567-8fe10c0dff1f';
    $pane->panel = 'quaternary_features';
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
    $pane->uuid = '78e21651-9af4-9ac4-6567-8fe10c0dff1f';
    $display->content['new-78e21651-9af4-9ac4-6567-8fe10c0dff1f'] = $pane;
    $display->panels['quaternary_features'][0] = 'new-78e21651-9af4-9ac4-6567-8fe10c0dff1f';
    $pane = new stdClass();
    $pane->pid = 'new-a9452bec-e520-442e-94f0-88b5aeb51576';
    $pane->panel = 'quaternary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'wem_contest_redirect-enter_contest_pane';
    $pane->shown = TRUE;
    $pane->access = array(
      'plugins' => array(
        0 => array(
          'name' => 'role',
          'settings' => array(
            'rids' => array(
              0 => 2,
            ),
          ),
          'context' => 'logged-in-user',
          'not' => FALSE,
        ),
        1 => array(
          'name' => 'og_member',
          'settings' => array(
            'state' => array(
              1 => '1',
            ),
          ),
          'context' => array(
            0 => 'logged-in-user',
            1 => 'panelizer',
          ),
          'not' => TRUE,
        ),
      ),
    );
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
    $pane->uuid = 'a9452bec-e520-442e-94f0-88b5aeb51576';
    $display->content['new-a9452bec-e520-442e-94f0-88b5aeb51576'] = $pane;
    $display->panels['quaternary_features'][1] = 'new-a9452bec-e520-442e-94f0-88b5aeb51576';
    $pane = new stdClass();
    $pane->pid = 'new-1a670b3c-6339-2464-9144-ee5bdf920089';
    $pane->panel = 'quaternary_features';
    $pane->type = 'block';
    $pane->subtype = 'bean-wem---page-related-product';
    $pane->shown = TRUE;
    $pane->access = array(
      'plugins' => array(
        0 => array(
          'name' => 'og_member',
          'settings' => array(
            'state' => array(
              1 => '1',
            ),
          ),
          'context' => array(
            0 => 'logged-in-user',
            1 => 'panelizer',
          ),
          'not' => FALSE,
        ),
      ),
    );
    $pane->configuration = array(
      'override_title' => 1,
      'override_title_text' => 'Book Your Trip',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'banner',
        'hero' => 0,
        'layouts' => 'default',
        'styles' => 'feature_small',
        'color_schemes' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 2;
    $pane->locks = array();
    $pane->uuid = '1a670b3c-6339-2464-9144-ee5bdf920089';
    $display->content['new-1a670b3c-6339-2464-9144-ee5bdf920089'] = $pane;
    $display->panels['quaternary_features'][2] = 'new-1a670b3c-6339-2464-9144-ee5bdf920089';
    $pane = new stdClass();
    $pane->pid = 'new-8143b24d-a8a1-aee4-8195-3ff5c7bb9ba6';
    $pane->panel = 'tertiary_features';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:field_contest_image';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'hidden',
      'formatter' => 'picture',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(
        'image_style' => 'letterbox',
        'image_link' => '',
        'picture_group' => 'letterbox',
        'fallback_image_style' => '',
        'colorbox' => 'letterbox',
      ),
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
    $pane->uuid = '8143b24d-a8a1-aee4-8195-3ff5c7bb9ba6';
    $display->content['new-8143b24d-a8a1-aee4-8195-3ff5c7bb9ba6'] = $pane;
    $display->panels['tertiary_features'][0] = 'new-8143b24d-a8a1-aee4-8195-3ff5c7bb9ba6';
    $pane = new stdClass();
    $pane->pid = 'new-6da4ae5e-550c-3734-4532-1c4a862d6e2b';
    $pane->panel = 'tertiary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'wem_contestants-panel_pane_1';
    $pane->shown = TRUE;
    $pane->access = array(
      'plugins' => array(
        0 => array(
          'name' => 'og_member',
          'settings' => array(
            'state' => array(
              1 => '1',
            ),
          ),
          'context' => array(
            0 => 'logged-in-user',
            1 => 'panelizer',
          ),
          'not' => FALSE,
        ),
      ),
    );
    $pane->configuration = array(
      'context' => array(
        0 => 'panelizer',
      ),
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
        'hero' => 0,
        'layouts' => 'default',
        'styles' => 'feature_small',
        'color_schemes' => 'alternate',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 1;
    $pane->locks = array();
    $pane->uuid = '6da4ae5e-550c-3734-4532-1c4a862d6e2b';
    $display->content['new-6da4ae5e-550c-3734-4532-1c4a862d6e2b'] = $pane;
    $display->panels['tertiary_features'][1] = 'new-6da4ae5e-550c-3734-4532-1c4a862d6e2b';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = '0';
  $panelizer->display = $display;
  $export['node:wem_contest:default'] = $panelizer;

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'node:wem_contest:default:featured';
  $panelizer->title = 'Default';
  $panelizer->panelizer_type = 'node';
  $panelizer->panelizer_key = 'wem_contest';
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
  $display->panel_settings = array();
  $display->cache = array();
  $display->title = '%node:title';
  $display->uuid = '0e9b6d57-dcb8-a224-51b3-5a89d5186c13';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-91fe2e50-5386-eba4-2d85-4e78d6f8438b';
    $pane->panel = 'center';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:field_contest_image';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'hidden',
      'formatter' => 'image',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(
        'image_link' => 'content',
        'image_style' => 'letterbox',
      ),
      'context' => 'panelizer',
    );
    $pane->cache = array();
    $pane->style = array();
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '91fe2e50-5386-eba4-2d85-4e78d6f8438b';
    $display->content['new-91fe2e50-5386-eba4-2d85-4e78d6f8438b'] = $pane;
    $display->panels['center'][0] = 'new-91fe2e50-5386-eba4-2d85-4e78d6f8438b';
    $pane = new stdClass();
    $pane->pid = 'new-ca59412f-2e0f-e9f4-8dbb-126555360ebb';
    $pane->panel = 'center';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:body';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'hidden',
      'formatter' => 'text_trimmed',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(
        'trim_length' => 300,
      ),
      'context' => 'panelizer',
    );
    $pane->cache = array();
    $pane->style = array();
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'ca59412f-2e0f-e9f4-8dbb-126555360ebb';
    $display->content['new-ca59412f-2e0f-e9f4-8dbb-126555360ebb'] = $pane;
    $display->panels['center'][1] = 'new-ca59412f-2e0f-e9f4-8dbb-126555360ebb';
    $pane = new stdClass();
    $pane->pid = 'new-c4637e2f-7c71-eea4-d1da-d71990ab9d24';
    $pane->panel = 'center';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:group_group';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'above',
      'formatter' => 'hidden',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(),
      'context' => 'panelizer',
    );
    $pane->cache = array();
    $pane->style = array();
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'c4637e2f-7c71-eea4-d1da-d71990ab9d24';
    $display->content['new-c4637e2f-7c71-eea4-d1da-d71990ab9d24'] = $pane;
    $display->panels['center'][2] = 'new-c4637e2f-7c71-eea4-d1da-d71990ab9d24';
    $pane = new stdClass();
    $pane->pid = 'new-b9163021-f6cc-5f44-e9ec-e6661e6210d7';
    $pane->panel = 'center';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:field_contest_interests';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'above',
      'formatter' => 'hidden',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(),
      'context' => 'panelizer',
    );
    $pane->cache = array();
    $pane->style = array();
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'b9163021-f6cc-5f44-e9ec-e6661e6210d7';
    $display->content['new-b9163021-f6cc-5f44-e9ec-e6661e6210d7'] = $pane;
    $display->panels['center'][3] = 'new-b9163021-f6cc-5f44-e9ec-e6661e6210d7';
    $pane = new stdClass();
    $pane->pid = 'new-f73a6b7f-010e-eac4-31f3-25eb2e185f73';
    $pane->panel = 'center';
    $pane->type = 'node_links';
    $pane->subtype = 'node_links';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_title' => FALSE,
      'override_title_text' => '',
      'build_mode' => 'featured',
      'identifier' => '',
      'link' => TRUE,
      'context' => 'panelizer',
    );
    $pane->cache = array();
    $pane->style = array();
    $pane->css = array(
      'css_class' => 'link-wrapper',
    );
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'f73a6b7f-010e-eac4-31f3-25eb2e185f73';
    $display->content['new-f73a6b7f-010e-eac4-31f3-25eb2e185f73'] = $pane;
    $display->panels['center'][4] = 'new-f73a6b7f-010e-eac4-31f3-25eb2e185f73';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = 'new-f73a6b7f-010e-eac4-31f3-25eb2e185f73';
  $panelizer->display = $display;
  $export['node:wem_contest:default:featured'] = $panelizer;

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'node:wem_contest:default:teaser';
  $panelizer->title = 'Default';
  $panelizer->panelizer_type = 'node';
  $panelizer->panelizer_key = 'wem_contest';
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
  $display->uuid = '9b467e63-3564-3c84-2975-210318374a8b';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-56fb000a-fbc7-f2d4-d90b-dd79f98f4ff9';
    $pane->panel = 'center';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:field_contest_image';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'hidden',
      'formatter' => 'image',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(
        'image_link' => 'content',
        'image_style' => 'large',
      ),
      'context' => 'panelizer',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '56fb000a-fbc7-f2d4-d90b-dd79f98f4ff9';
    $display->content['new-56fb000a-fbc7-f2d4-d90b-dd79f98f4ff9'] = $pane;
    $display->panels['center'][0] = 'new-56fb000a-fbc7-f2d4-d90b-dd79f98f4ff9';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = 'new-56fb000a-fbc7-f2d4-d90b-dd79f98f4ff9';
  $panelizer->display = $display;
  $export['node:wem_contest:default:teaser'] = $panelizer;

  return $export;
}
