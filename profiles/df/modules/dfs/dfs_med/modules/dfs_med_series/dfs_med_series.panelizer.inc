<?php
/**
 * @file
 * dfs_med_series.panelizer.inc
 */

/**
 * Implements hook_panelizer_defaults().
 */
function dfs_med_series_panelizer_defaults() {
  $export = array();

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'node:series:default';
  $panelizer->title = 'Default';
  $panelizer->panelizer_type = 'node';
  $panelizer->panelizer_key = 'series';
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
  $display->uuid = '5bcf534a-82c6-4410-8048-392124a0c997';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-b2096e53-6875-4db0-9851-f4bb3833d102';
    $pane->panel = 'primary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'series-panel_pane_1';
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
    $pane->uuid = 'b2096e53-6875-4db0-9851-f4bb3833d102';
    $display->content['new-b2096e53-6875-4db0-9851-f4bb3833d102'] = $pane;
    $display->panels['primary_features'][0] = 'new-b2096e53-6875-4db0-9851-f4bb3833d102';
    $pane = new stdClass();
    $pane->pid = 'new-9934615b-126b-41ff-b6bf-3d96090ef3c8';
    $pane->panel = 'secondary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'series-collection_control_pane';
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
    $pane->uuid = '9934615b-126b-41ff-b6bf-3d96090ef3c8';
    $display->content['new-9934615b-126b-41ff-b6bf-3d96090ef3c8'] = $pane;
    $display->panels['secondary_features'][0] = 'new-9934615b-126b-41ff-b6bf-3d96090ef3c8';
    $pane = new stdClass();
    $pane->pid = 'new-e6d617ac-4599-46fb-9978-1c7b7772045c';
    $pane->panel = 'tertiary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'series-collection_list_pane';
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
    $pane->uuid = 'e6d617ac-4599-46fb-9978-1c7b7772045c';
    $display->content['new-e6d617ac-4599-46fb-9978-1c7b7772045c'] = $pane;
    $display->panels['tertiary_features'][0] = 'new-e6d617ac-4599-46fb-9978-1c7b7772045c';
  $display->hide_title = PANELS_TITLE_NONE;
  $display->title_pane = '0';
  $panelizer->display = $display;
  $export['node:series:default'] = $panelizer;

  return $export;
}
