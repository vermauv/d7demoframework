<?php
/**
 * @file
 * dfs_med_episodes.panelizer.inc
 */

/**
 * Implements hook_panelizer_defaults().
 */
function dfs_med_episodes_panelizer_defaults() {
  $export = array();

  $panelizer = new stdClass();
  $panelizer->disabled = FALSE; /* Edit this to true to make a default panelizer disabled initially */
  $panelizer->api_version = 1;
  $panelizer->name = 'node:episodic_collection:default';
  $panelizer->title = 'Default';
  $panelizer->panelizer_type = 'node';
  $panelizer->panelizer_key = 'episodic_collection';
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
  $display->title = '';
  $display->uuid = '66dce775-dffe-4db0-8991-3513f5aac336';
  $display->content = array();
  $display->panels = array();
    $pane = new stdClass();
    $pane->pid = 'new-8172cac6-61bc-4048-a6dd-70d8a4e4f666';
    $pane->panel = 'primary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'collection-panel_pane_1';
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
    $pane->uuid = '8172cac6-61bc-4048-a6dd-70d8a4e4f666';
    $display->content['new-8172cac6-61bc-4048-a6dd-70d8a4e4f666'] = $pane;
    $display->panels['primary_features'][0] = 'new-8172cac6-61bc-4048-a6dd-70d8a4e4f666';
    $pane = new stdClass();
    $pane->pid = 'new-9f5cb6d5-05a8-4fb2-a56e-ae85e09d06a2';
    $pane->panel = 'secondary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'collection-collection_control_pane';
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
    $pane->uuid = '9f5cb6d5-05a8-4fb2-a56e-ae85e09d06a2';
    $display->content['new-9f5cb6d5-05a8-4fb2-a56e-ae85e09d06a2'] = $pane;
    $display->panels['secondary_features'][0] = 'new-9f5cb6d5-05a8-4fb2-a56e-ae85e09d06a2';
    $pane = new stdClass();
    $pane->pid = 'new-d0feb23d-bf38-447e-9650-9f28bd5a9bf6';
    $pane->panel = 'tertiary_features';
    $pane->type = 'views_panes';
    $pane->subtype = 'collection-collection_list_pane';
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
    $pane->uuid = 'd0feb23d-bf38-447e-9650-9f28bd5a9bf6';
    $display->content['new-d0feb23d-bf38-447e-9650-9f28bd5a9bf6'] = $pane;
    $display->panels['tertiary_features'][0] = 'new-d0feb23d-bf38-447e-9650-9f28bd5a9bf6';
  $display->hide_title = PANELS_TITLE_NONE;
  $display->title_pane = '0';
  $panelizer->display = $display;
  $export['node:episodic_collection:default'] = $panelizer;

  return $export;
}
