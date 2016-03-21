<?php
/**
 * @file
 * dfs_wem_news.panelizer.inc
 */

/**
 * Implements hook_panelizer_defaults().
 */
function dfs_wem_news_panelizer_defaults() {
  $export = array();

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'node:wem_news:default';
  $panelizer->title = 'Default';
  $panelizer->panelizer_type = 'node';
  $panelizer->panelizer_key = 'wem_news';
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
  $display->title = '%node:title';
  $display->uuid = '4d209eac-b127-0c64-0d7b-030895f9f5ad';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-cf615608-9f93-1514-8d08-be98c27d9ad7';
    $pane->panel = 'primary_features';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:field_wem_subtitle';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'above',
      'formatter' => 'text_default',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(
        'edit' => array(
          'editor' => 'direct',
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
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'cf615608-9f93-1514-8d08-be98c27d9ad7';
    $display->content['new-cf615608-9f93-1514-8d08-be98c27d9ad7'] = $pane;
    $display->panels['primary_features'][0] = 'new-cf615608-9f93-1514-8d08-be98c27d9ad7';
    $pane = new stdClass();
    $pane->pid = 'new-99878fb5-c19d-4acd-a7a8-4355ee7facca';
    $pane->panel = 'quaternary_features';
    $pane->type = 'fieldable_panels_pane';
    $pane->subtype = 'uuid:86B9A9D2-0209-4098-93F2-1002074C6C9C';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_mode' => 'full',
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
    $pane->uuid = '99878fb5-c19d-4acd-a7a8-4355ee7facca';
    $display->content['new-99878fb5-c19d-4acd-a7a8-4355ee7facca'] = $pane;
    $display->panels['quaternary_features'][0] = 'new-99878fb5-c19d-4acd-a7a8-4355ee7facca';
    $pane = new stdClass();
    $pane->pid = 'new-67dc393a-ff2b-43a7-90ca-4cd3a3b1509d';
    $pane->panel = 'quaternary_features';
    $pane->type = 'block';
    $pane->subtype = 'bean-wem---page-secondary';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'override_title' => 0,
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
    $pane->position = 1;
    $pane->locks = array();
    $pane->uuid = '67dc393a-ff2b-43a7-90ca-4cd3a3b1509d';
    $display->content['new-67dc393a-ff2b-43a7-90ca-4cd3a3b1509d'] = $pane;
    $display->panels['quaternary_features'][1] = 'new-67dc393a-ff2b-43a7-90ca-4cd3a3b1509d';
    $pane = new stdClass();
    $pane->pid = 'new-eecb6a06-4337-aea4-f5df-f8b2d58ea134';
    $pane->panel = 'secondary_features';
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
      'formatter_settings' => array(
        'edit' => array(
          'editor' => 'direct',
        ),
      ),
      'context' => 'panelizer',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'default',
        'hero' => 'default',
        'layouts' => 'default',
        'styles' => 'default',
        'color_schemes' => 'alternate',
        'button_styles' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = 'eecb6a06-4337-aea4-f5df-f8b2d58ea134';
    $display->content['new-eecb6a06-4337-aea4-f5df-f8b2d58ea134'] = $pane;
    $display->panels['secondary_features'][0] = 'new-eecb6a06-4337-aea4-f5df-f8b2d58ea134';
    $pane = new stdClass();
    $pane->pid = 'new-fc5aa8c5-a15e-446b-9b6e-a17202f0cb53';
    $pane->panel = 'secondary_features';
    $pane->type = 'entity_field_extra';
    $pane->subtype = 'node:sharethis';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'view_mode' => 'full',
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
    $pane->position = 1;
    $pane->locks = array();
    $pane->uuid = 'fc5aa8c5-a15e-446b-9b6e-a17202f0cb53';
    $display->content['new-fc5aa8c5-a15e-446b-9b6e-a17202f0cb53'] = $pane;
    $display->panels['secondary_features'][1] = 'new-fc5aa8c5-a15e-446b-9b6e-a17202f0cb53';
    $pane = new stdClass();
    $pane->pid = 'new-661d9ec5-8386-4bab-b190-330bd323ad80';
    $pane->panel = 'secondary_features';
    $pane->type = 'block';
    $pane->subtype = 'bean-wem---page-related-product';
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
    $pane->position = 2;
    $pane->locks = array();
    $pane->uuid = '661d9ec5-8386-4bab-b190-330bd323ad80';
    $display->content['new-661d9ec5-8386-4bab-b190-330bd323ad80'] = $pane;
    $display->panels['secondary_features'][2] = 'new-661d9ec5-8386-4bab-b190-330bd323ad80';
    $pane = new stdClass();
    $pane->pid = 'new-afab41c7-5481-f244-b50c-6096b3b3196a';
    $pane->panel = 'tertiary_features';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:field_wem_image';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'hidden',
      'formatter' => 'picture',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(
        'colorbox' => 'letterbox',
        'fallback_image_style' => '',
        'image_link' => '',
        'picture_group' => 'letterbox',
      ),
      'context' => 'panelizer',
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
    $pane->uuid = 'afab41c7-5481-f244-b50c-6096b3b3196a';
    $display->content['new-afab41c7-5481-f244-b50c-6096b3b3196a'] = $pane;
    $display->panels['tertiary_features'][0] = 'new-afab41c7-5481-f244-b50c-6096b3b3196a';
    $pane = new stdClass();
    $pane->pid = 'new-a667ba79-faa6-89c4-051f-8d41674b115e';
    $pane->panel = 'tertiary_features';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:field_wem_video';
    $pane->shown = TRUE;
    $pane->access = array();
    $pane->configuration = array(
      'label' => 'hidden',
      'formatter' => 'file_rendered',
      'delta_limit' => 0,
      'delta_offset' => '0',
      'delta_reversed' => FALSE,
      'formatter_settings' => array(
        'file_view_mode' => 'default',
      ),
      'context' => 'panelizer',
    );
    $pane->cache = array();
    $pane->style = array(
      'settings' => array(
        'title' => 'hidden',
        'hero' => 0,
        'layouts' => 'default',
        'styles' => 'default',
        'color_schemes' => 'reverse',
        'button_styles' => 'default',
      ),
      'style' => 'demonstratie_panels_styles',
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 1;
    $pane->locks = array();
    $pane->uuid = 'a667ba79-faa6-89c4-051f-8d41674b115e';
    $display->content['new-a667ba79-faa6-89c4-051f-8d41674b115e'] = $pane;
    $display->panels['tertiary_features'][1] = 'new-a667ba79-faa6-89c4-051f-8d41674b115e';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = 'new-afab41c7-5481-f244-b50c-6096b3b3196a';
  $panelizer->display = $display;
  $export['node:wem_news:default'] = $panelizer;

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'node:wem_news:default:featured';
  $panelizer->title = 'Default';
  $panelizer->panelizer_type = 'node';
  $panelizer->panelizer_key = 'wem_news';
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
  $display->uuid = 'a53c5230-312f-c354-e993-9bc54550b579';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-3d582c83-3eb6-10e4-ed68-a237b7f4d163';
    $pane->panel = 'center';
    $pane->type = 'entity_field';
    $pane->subtype = 'node:field_wem_image';
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
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 0;
    $pane->locks = array();
    $pane->uuid = '3d582c83-3eb6-10e4-ed68-a237b7f4d163';
    $display->content['new-3d582c83-3eb6-10e4-ed68-a237b7f4d163'] = $pane;
    $display->panels['center'][0] = 'new-3d582c83-3eb6-10e4-ed68-a237b7f4d163';
    $pane = new stdClass();
    $pane->pid = 'new-5e6b6aa1-0a3d-3c34-3133-341ca11a684c';
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
    $pane->style = array(
      'settings' => NULL,
    );
    $pane->css = array();
    $pane->extras = array();
    $pane->position = 1;
    $pane->locks = array();
    $pane->uuid = '5e6b6aa1-0a3d-3c34-3133-341ca11a684c';
    $display->content['new-5e6b6aa1-0a3d-3c34-3133-341ca11a684c'] = $pane;
    $display->panels['center'][1] = 'new-5e6b6aa1-0a3d-3c34-3133-341ca11a684c';
  $display->hide_title = PANELS_TITLE_FIXED;
  $display->title_pane = '0';
  $panelizer->display = $display;
  $export['node:wem_news:default:featured'] = $panelizer;

  return $export;
}
