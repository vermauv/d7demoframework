<?php
/**
 * @file
 * dfs_med_episodes.strongarm.inc
 */

/**
 * Implements hook_strongarm().
 */
function dfs_med_episodes_strongarm() {
  $export = array();

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'additional_settings__active_tab_episode';
  $strongarm->value = 'edit-workflow';
  $export['additional_settings__active_tab_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'additional_settings__active_tab_episodic_collection';
  $strongarm->value = 'edit-display';
  $export['additional_settings__active_tab_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_anonymous_episode';
  $strongarm->value = 0;
  $export['comment_anonymous_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_anonymous_episodic_collection';
  $strongarm->value = 0;
  $export['comment_anonymous_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_default_mode_episode';
  $strongarm->value = 1;
  $export['comment_default_mode_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_default_mode_episodic_collection';
  $strongarm->value = 1;
  $export['comment_default_mode_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_default_per_page_episode';
  $strongarm->value = '50';
  $export['comment_default_per_page_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_default_per_page_episodic_collection';
  $strongarm->value = '50';
  $export['comment_default_per_page_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_episode';
  $strongarm->value = '2';
  $export['comment_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_episodic_collection';
  $strongarm->value = '2';
  $export['comment_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_form_location_episode';
  $strongarm->value = 1;
  $export['comment_form_location_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_form_location_episodic_collection';
  $strongarm->value = 1;
  $export['comment_form_location_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_preview_episode';
  $strongarm->value = '1';
  $export['comment_preview_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_preview_episodic_collection';
  $strongarm->value = '1';
  $export['comment_preview_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_subject_field_episode';
  $strongarm->value = 1;
  $export['comment_subject_field_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_subject_field_episodic_collection';
  $strongarm->value = 1;
  $export['comment_subject_field_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_enable_revisions_page_node_episode';
  $strongarm->value = 1;
  $export['diff_enable_revisions_page_node_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_enable_revisions_page_node_episodic_collection';
  $strongarm->value = 1;
  $export['diff_enable_revisions_page_node_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_show_preview_changes_node_episode';
  $strongarm->value = 1;
  $export['diff_show_preview_changes_node_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_show_preview_changes_node_episodic_collection';
  $strongarm->value = 1;
  $export['diff_show_preview_changes_node_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_view_mode_preview_node_episode';
  $strongarm->value = 'full';
  $export['diff_view_mode_preview_node_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'diff_view_mode_preview_node_episodic_collection';
  $strongarm->value = 'full';
  $export['diff_view_mode_preview_node_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'field_bundle_settings_node__episode';
  $strongarm->value = array(
    'view_modes' => array(),
    'extra_fields' => array(
      'form' => array(
        'metatags' => array(
          'weight' => '7',
        ),
        'title' => array(
          'weight' => '0',
        ),
        'path' => array(
          'weight' => '6',
        ),
        'locations' => array(
          'weight' => '9',
        ),
      ),
      'display' => array(
        'product:sku' => array(
          'featured' => array(
            'weight' => '7',
            'visible' => FALSE,
          ),
        ),
        'product:title' => array(
          'featured' => array(
            'weight' => '8',
            'visible' => FALSE,
          ),
        ),
        'product:status' => array(
          'featured' => array(
            'weight' => '9',
            'visible' => FALSE,
          ),
        ),
        'product:commerce_price' => array(
          'featured' => array(
            'weight' => '4',
            'visible' => TRUE,
          ),
        ),
        'product:field_product_image' => array(
          'featured' => array(
            'weight' => '6',
            'visible' => FALSE,
          ),
        ),
      ),
    ),
  );
  $export['field_bundle_settings_node__episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'field_bundle_settings_node__episodic_collection';
  $strongarm->value = array(
    'view_modes' => array(),
    'extra_fields' => array(
      'form' => array(
        'metatags' => array(
          'weight' => '4',
        ),
        'title' => array(
          'weight' => '0',
        ),
        'path' => array(
          'weight' => '5',
        ),
        'locations' => array(
          'weight' => '6',
        ),
      ),
      'display' => array(
        'sharethis' => array(
          'featured' => array(
            'weight' => '1',
            'visible' => FALSE,
          ),
        ),
      ),
    ),
  );
  $export['field_bundle_settings_node__episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'i18n_node_extended_episodic_collection';
  $strongarm->value = 1;
  $export['i18n_node_extended_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'i18n_node_options_episodic_collection';
  $strongarm->value = array();
  $export['i18n_node_options_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'i18n_sync_node_type_episodic_collection';
  $strongarm->value = array();
  $export['i18n_sync_node_type_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'language_content_type_episodic_collection';
  $strongarm->value = '0';
  $export['language_content_type_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'menu_options_episode';
  $strongarm->value = array(
    0 => 'main-menu',
  );
  $export['menu_options_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'menu_options_episodic_collection';
  $strongarm->value = array(
    0 => 'main-menu',
  );
  $export['menu_options_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'menu_parent_episode';
  $strongarm->value = 'main-menu:0';
  $export['menu_parent_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'menu_parent_episodic_collection';
  $strongarm->value = 'main-menu:0';
  $export['menu_parent_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'node_options_episode';
  $strongarm->value = array(
    0 => 'status',
  );
  $export['node_options_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'node_options_episodic_collection';
  $strongarm->value = array(
    0 => 'status',
  );
  $export['node_options_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'node_preview_episode';
  $strongarm->value = '1';
  $export['node_preview_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'node_preview_episodic_collection';
  $strongarm->value = '1';
  $export['node_preview_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'node_submitted_episode';
  $strongarm->value = 1;
  $export['node_submitted_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'node_submitted_episodic_collection';
  $strongarm->value = 0;
  $export['node_submitted_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'panelizer_defaults_node_episode';
  $strongarm->value = array(
    'status' => 0,
    'view modes' => array(),
  );
  $export['panelizer_defaults_node_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'panelizer_defaults_node_episodic_collection';
  $strongarm->value = array(
    'status' => 1,
    'view modes' => array(
      'page_manager' => array(
        'status' => 1,
        'default' => 1,
        'choice' => 0,
      ),
      'default' => array(
        'status' => 0,
        'default' => 0,
        'choice' => 0,
      ),
      'teaser' => array(
        'status' => 0,
        'default' => 0,
        'choice' => 0,
      ),
      'alternate' => array(
        'status' => 0,
        'default' => 0,
        'choice' => 0,
      ),
      'thumbnail' => array(
        'status' => 0,
        'default' => 0,
        'choice' => 0,
      ),
      'featured' => array(
        'status' => 0,
        'default' => 0,
        'choice' => 0,
      ),
    ),
  );
  $export['panelizer_defaults_node_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'panelizer_node:episodic_collection:page_manager_selection';
  $strongarm->value = 'node:episodic_collection:default';
  $export['panelizer_node:episodic_collection:page_manager_selection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'panelizer_node:episodic_collection_allowed_layouts';
  $strongarm->value = 'O:22:"panels_allowed_layouts":4:{s:9:"allow_new";b:1;s:11:"module_name";s:34:"panelizer_node:episodic_collection";s:23:"allowed_layout_settings";a:53:{s:8:"flexible";b:1;s:27:"demonstratie_layout_landing";b:1;s:27:"demonstratie_layout_stagger";b:1;s:29:"demonstratie_layout_full_side";b:1;s:34:"demonstratie_layout_split_features";b:1;s:26:"demonstratie_layout_single";b:1;s:6:"twocol";b:1;s:6:"onecol";b:1;s:25:"threecol_25_50_25_stacked";b:1;s:17:"threecol_25_50_25";b:1;s:14:"twocol_stacked";b:1;s:13:"twocol_bricks";b:1;s:17:"threecol_33_34_33";b:1;s:25:"threecol_33_34_33_stacked";b:1;s:6:"boxton";b:1;s:16:"bartlett_flipped";b:1;s:22:"bryant_flipped_flipped";b:1;s:5:"geary";b:1;s:9:"sanderson";b:1;s:15:"hewston_flipped";b:1;s:4:"webb";b:1;s:15:"brenham_flipped";b:1;s:7:"moscone";b:1;s:12:"burr_flipped";b:1;s:5:"rolph";b:1;s:7:"brenham";b:1;s:5:"sutro";b:1;s:6:"harris";b:1;s:15:"moscone_flipped";b:1;s:12:"sutro_double";b:1;s:6:"whelan";b:1;s:5:"brown";b:1;s:6:"taylor";b:1;s:17:"sanderson_flipped";b:1;s:5:"selby";b:1;s:6:"bryant";b:1;s:7:"hewston";b:1;s:4:"burr";b:1;s:8:"bartlett";b:1;s:14:"taylor_flipped";b:1;s:4:"pond";b:1;s:6:"phelan";b:1;s:8:"mccoppin";b:1;s:12:"webb_flipped";b:1;s:13:"selby_flipped";b:1;s:15:"foundation_4col";b:1;s:23:"foundation_2col_stacked";b:1;s:23:"foundation_3col_stacked";b:1;s:15:"foundation_2col";b:1;s:15:"foundation_3col";b:1;s:22:"foundation_2col_bricks";b:1;s:21:"foundation_6row_combo";b:1;s:15:"foundation_1col";b:1;}s:10:"form_state";N;}';
  $export['panelizer_node:episodic_collection_allowed_layouts'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'panelizer_node:episodic_collection_allowed_layouts_default';
  $strongarm->value = 1;
  $export['panelizer_node:episodic_collection_allowed_layouts_default'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'panelizer_node:episodic_collection_allowed_types_default';
  $strongarm->value = 1;
  $export['panelizer_node:episodic_collection_allowed_types_default'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'panelizer_node:episodic_collection_default';
  $strongarm->value = array(
    'custom' => 'custom',
    'entity_field' => 'entity_field',
    'entity_field_extra' => 'entity_field_extra',
    'entity_form_field' => 'entity_form_field',
    'token' => 'token',
    'block' => 'block',
    'entity_view' => 'entity_view',
    'fieldable_panels_pane' => 'fieldable_panels_pane',
    'views_panes' => 'views_panes',
    'views' => 'views',
    'other' => 'other',
  );
  $export['panelizer_node:episodic_collection_default'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'pathauto_node_episode_pattern';
  $strongarm->value = 'episode/[node:title]';
  $export['pathauto_node_episode_pattern'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'pathauto_node_episodic_collection_pattern';
  $strongarm->value = 'collection/[node:title]';
  $export['pathauto_node_episodic_collection_pattern'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'save_continue_episode';
  $strongarm->value = 'Save and add fields';
  $export['save_continue_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'save_continue_episodic_collection';
  $strongarm->value = 'Save and add fields';
  $export['save_continue_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'webform_node_episode';
  $strongarm->value = 0;
  $export['webform_node_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'webform_node_episodic_collection';
  $strongarm->value = 0;
  $export['webform_node_episodic_collection'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'workbench_moderation_default_state_episode';
  $strongarm->value = 'draft';
  $export['workbench_moderation_default_state_episode'] = $strongarm;

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'workbench_moderation_default_state_episodic_collection';
  $strongarm->value = 'draft';
  $export['workbench_moderation_default_state_episodic_collection'] = $strongarm;

  return $export;
}
