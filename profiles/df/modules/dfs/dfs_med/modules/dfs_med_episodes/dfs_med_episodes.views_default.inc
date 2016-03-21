<?php
/**
 * @file
 * dfs_med_episodes.views_default.inc
 */

/**
 * Implements hook_views_default_views().
 */
function dfs_med_episodes_views_default_views() {
  $export = array();

  $view = new view();
  $view->name = 'collection';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Collection';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'COLLECTION';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'some';
  $handler->display->display_options['pager']['options']['items_per_page'] = '1';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'fields';
  /* Relationship: Entity Reference: Referenced Entity */
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['id'] = 'field_commerce_product_target_id';
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['table'] = 'field_data_field_commerce_product';
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['field'] = 'field_commerce_product_target_id';
  /* Relationship: Content: Referenced products */
  $handler->display->display_options['relationships']['field_product_product_id']['id'] = 'field_product_product_id';
  $handler->display->display_options['relationships']['field_product_product_id']['table'] = 'field_data_field_product';
  $handler->display->display_options['relationships']['field_product_product_id']['field'] = 'field_product_product_id';
  $handler->display->display_options['relationships']['field_product_product_id']['relationship'] = 'field_commerce_product_target_id';
  /* Field: Content: Splash Image */
  $handler->display->display_options['fields']['field_splash_image']['id'] = 'field_splash_image';
  $handler->display->display_options['fields']['field_splash_image']['table'] = 'field_data_field_splash_image';
  $handler->display->display_options['fields']['field_splash_image']['field'] = 'field_splash_image';
  $handler->display->display_options['fields']['field_splash_image']['label'] = '';
  $handler->display->display_options['fields']['field_splash_image']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_splash_image']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_splash_image']['type'] = 'file_rendered';
  $handler->display->display_options['fields']['field_splash_image']['settings'] = array(
    'file_view_mode' => 'default',
  );
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  $handler->display->display_options['fields']['title']['element_type'] = 'h1';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
  /* Field: Content: Body */
  $handler->display->display_options['fields']['body']['id'] = 'body';
  $handler->display->display_options['fields']['body']['table'] = 'field_data_body';
  $handler->display->display_options['fields']['body']['field'] = 'body';
  $handler->display->display_options['fields']['body']['label'] = '';
  $handler->display->display_options['fields']['body']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['body']['type'] = 'text_plain';
  /* Field: Content: Path */
  $handler->display->display_options['fields']['path']['id'] = 'path';
  $handler->display->display_options['fields']['path']['table'] = 'node';
  $handler->display->display_options['fields']['path']['field'] = 'path';
  $handler->display->display_options['fields']['path']['relationship'] = 'field_commerce_product_target_id';
  $handler->display->display_options['fields']['path']['label'] = '';
  $handler->display->display_options['fields']['path']['exclude'] = TRUE;
  $handler->display->display_options['fields']['path']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['path']['absolute'] = TRUE;
  /* Field: Commerce Product: Price */
  $handler->display->display_options['fields']['commerce_price']['id'] = 'commerce_price';
  $handler->display->display_options['fields']['commerce_price']['table'] = 'field_data_commerce_price';
  $handler->display->display_options['fields']['commerce_price']['field'] = 'commerce_price';
  $handler->display->display_options['fields']['commerce_price']['relationship'] = 'field_product_product_id';
  $handler->display->display_options['fields']['commerce_price']['label'] = '';
  $handler->display->display_options['fields']['commerce_price']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['commerce_price']['alter']['text'] = 'Buy [commerce_price]';
  $handler->display->display_options['fields']['commerce_price']['alter']['make_link'] = TRUE;
  $handler->display->display_options['fields']['commerce_price']['alter']['path'] = '[path]';
  $handler->display->display_options['fields']['commerce_price']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['commerce_price']['click_sort_column'] = 'amount';
  $handler->display->display_options['fields']['commerce_price']['settings'] = array(
    'calculation' => '0',
  );
  /* Field: Content: Episode Count */
  $handler->display->display_options['fields']['field_collected_count']['id'] = 'field_collected_count';
  $handler->display->display_options['fields']['field_collected_count']['table'] = 'field_data_field_collected_count';
  $handler->display->display_options['fields']['field_collected_count']['field'] = 'field_collected_count';
  $handler->display->display_options['fields']['field_collected_count']['label'] = '';
  $handler->display->display_options['fields']['field_collected_count']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['field_collected_count']['alter']['text'] = '[field_collected_count] Episodes';
  $handler->display->display_options['fields']['field_collected_count']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_collected_count']['settings'] = array(
    'thousand_separator' => '',
    'prefix_suffix' => 0,
  );
  /* Contextual filter: Content: Nid */
  $handler->display->display_options['arguments']['nid']['id'] = 'nid';
  $handler->display->display_options['arguments']['nid']['table'] = 'node';
  $handler->display->display_options['arguments']['nid']['field'] = 'nid';
  $handler->display->display_options['arguments']['nid']['default_action'] = 'not found';
  $handler->display->display_options['arguments']['nid']['default_argument_type'] = 'node';
  $handler->display->display_options['arguments']['nid']['summary']['number_of_records'] = '0';
  $handler->display->display_options['arguments']['nid']['summary']['format'] = 'default_summary';
  $handler->display->display_options['arguments']['nid']['summary_options']['items_per_page'] = '25';
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'episodic_collection' => 'episodic_collection',
  );

  /* Display: Hero pane */
  $handler = $view->new_display('panel_pane', 'Hero pane', 'panel_pane_1');
  $handler->display->display_options['defaults']['relationships'] = FALSE;
  /* Relationship: Entity Reference: Referenced Entity */
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['id'] = 'field_commerce_product_target_id';
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['table'] = 'field_data_field_commerce_product';
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['field'] = 'field_commerce_product_target_id';
  /* Relationship: Content: Referenced products */
  $handler->display->display_options['relationships']['field_product_product_id']['id'] = 'field_product_product_id';
  $handler->display->display_options['relationships']['field_product_product_id']['table'] = 'field_data_field_product';
  $handler->display->display_options['relationships']['field_product_product_id']['field'] = 'field_product_product_id';
  $handler->display->display_options['relationships']['field_product_product_id']['relationship'] = 'field_commerce_product_target_id';
  /* Relationship: Entity Reference: Referenced Entity */
  $handler->display->display_options['relationships']['field_brand_target_id']['id'] = 'field_brand_target_id';
  $handler->display->display_options['relationships']['field_brand_target_id']['table'] = 'field_data_field_brand';
  $handler->display->display_options['relationships']['field_brand_target_id']['field'] = 'field_brand_target_id';
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Splash Image */
  $handler->display->display_options['fields']['field_splash_image']['id'] = 'field_splash_image';
  $handler->display->display_options['fields']['field_splash_image']['table'] = 'field_data_field_splash_image';
  $handler->display->display_options['fields']['field_splash_image']['field'] = 'field_splash_image';
  $handler->display->display_options['fields']['field_splash_image']['label'] = '';
  $handler->display->display_options['fields']['field_splash_image']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_splash_image']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_splash_image']['type'] = 'file_image_image';
  $handler->display->display_options['fields']['field_splash_image']['settings'] = array(
    'image_style' => 'collection-hero',
    'image_link' => '',
  );
  /* Field: Global: Fieldset */
  $handler->display->display_options['fields']['fieldset']['id'] = 'fieldset';
  $handler->display->display_options['fields']['fieldset']['table'] = 'views';
  $handler->display->display_options['fields']['fieldset']['field'] = 'fieldset';
  $handler->display->display_options['fields']['fieldset']['label'] = 'Group meta data';
  $handler->display->display_options['fields']['fieldset']['children'] = array(
    0 => 'path_1',
    1 => 'field_logo',
    2 => 'title',
    3 => 'body',
    4 => 'path',
    5 => 'commerce_price',
    6 => 'field_collected_count',
  );
  $handler->display->display_options['fields']['fieldset']['fieldset']['type'] = 'div';
  $handler->display->display_options['fields']['fieldset']['fieldset']['classes'] = 'collection-meta-data';
  /* Field: Content: Logo */
  $handler->display->display_options['fields']['field_logo']['id'] = 'field_logo';
  $handler->display->display_options['fields']['field_logo']['table'] = 'field_data_field_logo';
  $handler->display->display_options['fields']['field_logo']['field'] = 'field_logo';
  $handler->display->display_options['fields']['field_logo']['relationship'] = 'field_brand_target_id';
  $handler->display->display_options['fields']['field_logo']['label'] = '';
  $handler->display->display_options['fields']['field_logo']['alter']['path'] = '[path_1]';
  $handler->display->display_options['fields']['field_logo']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_logo']['hide_empty'] = TRUE;
  $handler->display->display_options['fields']['field_logo']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_logo']['type'] = 'file_image_image';
  $handler->display->display_options['fields']['field_logo']['settings'] = array(
    'image_style' => '',
    'image_link' => 'content',
  );
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  $handler->display->display_options['fields']['title']['element_type'] = 'h1';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
  /* Field: Content: Body */
  $handler->display->display_options['fields']['body']['id'] = 'body';
  $handler->display->display_options['fields']['body']['table'] = 'field_data_body';
  $handler->display->display_options['fields']['body']['field'] = 'body';
  $handler->display->display_options['fields']['body']['label'] = '';
  $handler->display->display_options['fields']['body']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['body']['type'] = 'text_plain';
  /* Field: Content: Path */
  $handler->display->display_options['fields']['path']['id'] = 'path';
  $handler->display->display_options['fields']['path']['table'] = 'node';
  $handler->display->display_options['fields']['path']['field'] = 'path';
  $handler->display->display_options['fields']['path']['relationship'] = 'field_commerce_product_target_id';
  $handler->display->display_options['fields']['path']['label'] = '';
  $handler->display->display_options['fields']['path']['exclude'] = TRUE;
  $handler->display->display_options['fields']['path']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['path']['absolute'] = TRUE;
  /* Field: Commerce Product: Price */
  $handler->display->display_options['fields']['commerce_price']['id'] = 'commerce_price';
  $handler->display->display_options['fields']['commerce_price']['table'] = 'field_data_commerce_price';
  $handler->display->display_options['fields']['commerce_price']['field'] = 'commerce_price';
  $handler->display->display_options['fields']['commerce_price']['relationship'] = 'field_product_product_id';
  $handler->display->display_options['fields']['commerce_price']['label'] = '';
  $handler->display->display_options['fields']['commerce_price']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['commerce_price']['alter']['text'] = 'Buy [commerce_price]';
  $handler->display->display_options['fields']['commerce_price']['alter']['make_link'] = TRUE;
  $handler->display->display_options['fields']['commerce_price']['alter']['path'] = '[path]';
  $handler->display->display_options['fields']['commerce_price']['alter']['link_class'] = 'button small';
  $handler->display->display_options['fields']['commerce_price']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['commerce_price']['click_sort_column'] = 'amount';
  $handler->display->display_options['fields']['commerce_price']['settings'] = array(
    'calculation' => '0',
  );
  /* Field: Content: Episode Count */
  $handler->display->display_options['fields']['field_collected_count']['id'] = 'field_collected_count';
  $handler->display->display_options['fields']['field_collected_count']['table'] = 'field_data_field_collected_count';
  $handler->display->display_options['fields']['field_collected_count']['field'] = 'field_collected_count';
  $handler->display->display_options['fields']['field_collected_count']['label'] = '';
  $handler->display->display_options['fields']['field_collected_count']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['field_collected_count']['alter']['text'] = '[field_collected_count] Episodes';
  $handler->display->display_options['fields']['field_collected_count']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_collected_count']['settings'] = array(
    'thousand_separator' => '',
    'prefix_suffix' => 0,
  );
  $handler->display->display_options['argument_input'] = array(
    'nid' => array(
      'type' => 'context',
      'context' => 'entity:node.nid',
      'context_optional' => 0,
      'panel' => '0',
      'fixed' => '',
      'label' => 'Content: Nid',
    ),
  );

  /* Display: Collection Control */
  $handler = $view->new_display('panel_pane', 'Collection Control', 'collection_control_pane');
  $handler->display->display_options['defaults']['title'] = FALSE;
  $handler->display->display_options['defaults']['pager'] = FALSE;
  $handler->display->display_options['pager']['type'] = 'none';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['defaults']['style_plugin'] = FALSE;
  $handler->display->display_options['style_plugin'] = 'jcarousel';
  $handler->display->display_options['style_options']['wrap'] = '0';
  $handler->display->display_options['style_options']['visible'] = '';
  $handler->display->display_options['style_options']['auto'] = '0';
  $handler->display->display_options['style_options']['autoPause'] = 1;
  $handler->display->display_options['style_options']['easing'] = '';
  $handler->display->display_options['style_options']['vertical'] = 0;
  $handler->display->display_options['defaults']['style_options'] = FALSE;
  $handler->display->display_options['defaults']['row_plugin'] = FALSE;
  $handler->display->display_options['row_plugin'] = 'fields';
  $handler->display->display_options['defaults']['row_options'] = FALSE;
  $handler->display->display_options['defaults']['relationships'] = FALSE;
  /* Relationship: Entity Reference: Referencing entity */
  $handler->display->display_options['relationships']['reverse_field_collected_node']['id'] = 'reverse_field_collected_node';
  $handler->display->display_options['relationships']['reverse_field_collected_node']['table'] = 'node';
  $handler->display->display_options['relationships']['reverse_field_collected_node']['field'] = 'reverse_field_collected_node';
  /* Relationship: Entity Reference: Referencing entity */
  $handler->display->display_options['relationships']['reverse_field_series_episodes_node']['id'] = 'reverse_field_series_episodes_node';
  $handler->display->display_options['relationships']['reverse_field_series_episodes_node']['table'] = 'node';
  $handler->display->display_options['relationships']['reverse_field_series_episodes_node']['field'] = 'reverse_field_series_episodes_node';
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Path */
  $handler->display->display_options['fields']['path']['id'] = 'path';
  $handler->display->display_options['fields']['path']['table'] = 'node';
  $handler->display->display_options['fields']['path']['field'] = 'path';
  $handler->display->display_options['fields']['path']['label'] = '';
  $handler->display->display_options['fields']['path']['exclude'] = TRUE;
  $handler->display->display_options['fields']['path']['element_label_colon'] = FALSE;
  /* Field: Content: Splash Image */
  $handler->display->display_options['fields']['field_splash_image']['id'] = 'field_splash_image';
  $handler->display->display_options['fields']['field_splash_image']['table'] = 'field_data_field_splash_image';
  $handler->display->display_options['fields']['field_splash_image']['field'] = 'field_splash_image';
  $handler->display->display_options['fields']['field_splash_image']['label'] = '';
  $handler->display->display_options['fields']['field_splash_image']['alter']['make_link'] = TRUE;
  $handler->display->display_options['fields']['field_splash_image']['alter']['path'] = '#[path]';
  $handler->display->display_options['fields']['field_splash_image']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_splash_image']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_splash_image']['type'] = 'file_image_image';
  $handler->display->display_options['fields']['field_splash_image']['settings'] = array(
    'image_style' => 'episode-control',
    'image_link' => '',
  );
  /* Field: Global: View result counter */
  $handler->display->display_options['fields']['counter']['id'] = 'counter';
  $handler->display->display_options['fields']['counter']['table'] = 'views';
  $handler->display->display_options['fields']['counter']['field'] = 'counter';
  $handler->display->display_options['fields']['counter']['label'] = '';
  $handler->display->display_options['fields']['counter']['exclude'] = TRUE;
  $handler->display->display_options['fields']['counter']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['counter']['alter']['text'] = 'Episode [counter]';
  $handler->display->display_options['fields']['counter']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['counter']['counter_start'] = '1';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['relationship'] = 'reverse_field_series_episodes_node';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['exclude'] = TRUE;
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
  /* Field: Global: Custom text */
  $handler->display->display_options['fields']['nothing']['id'] = 'nothing';
  $handler->display->display_options['fields']['nothing']['table'] = 'views';
  $handler->display->display_options['fields']['nothing']['field'] = 'nothing';
  $handler->display->display_options['fields']['nothing']['label'] = '';
  $handler->display->display_options['fields']['nothing']['alter']['text'] = '<a href="#[path]"><span class="control-text"><span class="episode">[counter]</span><span class="sub">[title]</span></a>';
  $handler->display->display_options['fields']['nothing']['element_label_colon'] = FALSE;
  $handler->display->display_options['defaults']['arguments'] = FALSE;
  /* Contextual filter: Content: Nid */
  $handler->display->display_options['arguments']['nid']['id'] = 'nid';
  $handler->display->display_options['arguments']['nid']['table'] = 'node';
  $handler->display->display_options['arguments']['nid']['field'] = 'nid';
  $handler->display->display_options['arguments']['nid']['relationship'] = 'reverse_field_collected_node';
  $handler->display->display_options['arguments']['nid']['default_action'] = 'not found';
  $handler->display->display_options['arguments']['nid']['default_argument_type'] = 'node';
  $handler->display->display_options['arguments']['nid']['summary']['number_of_records'] = '0';
  $handler->display->display_options['arguments']['nid']['summary']['format'] = 'default_summary';
  $handler->display->display_options['arguments']['nid']['summary_options']['items_per_page'] = '25';
  $handler->display->display_options['defaults']['filter_groups'] = FALSE;
  $handler->display->display_options['defaults']['filters'] = FALSE;
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'episode' => 'episode',
  );
  $handler->display->display_options['argument_input'] = array(
    'nid' => array(
      'type' => 'context',
      'context' => 'entity:node.nid',
      'context_optional' => 0,
      'panel' => '0',
      'fixed' => '',
      'label' => 'Content: Nid',
    ),
  );

  /* Display: Collection List */
  $handler = $view->new_display('panel_pane', 'Collection List', 'collection_list_pane');
  $handler->display->display_options['defaults']['title'] = FALSE;
  $handler->display->display_options['defaults']['pager'] = FALSE;
  $handler->display->display_options['pager']['type'] = 'none';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['defaults']['style_plugin'] = FALSE;
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['defaults']['style_options'] = FALSE;
  $handler->display->display_options['defaults']['row_plugin'] = FALSE;
  $handler->display->display_options['row_plugin'] = 'fields';
  $handler->display->display_options['defaults']['row_options'] = FALSE;
  $handler->display->display_options['defaults']['relationships'] = FALSE;
  /* Relationship: Entity Reference: Referencing entity */
  $handler->display->display_options['relationships']['reverse_field_collected_node']['id'] = 'reverse_field_collected_node';
  $handler->display->display_options['relationships']['reverse_field_collected_node']['table'] = 'node';
  $handler->display->display_options['relationships']['reverse_field_collected_node']['field'] = 'reverse_field_collected_node';
  /* Relationship: Entity Reference: Referenced Entity */
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['id'] = 'field_commerce_product_target_id';
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['table'] = 'field_data_field_commerce_product';
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['field'] = 'field_commerce_product_target_id';
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['relationship'] = 'reverse_field_collected_node';
  /* Relationship: Content: Referenced products */
  $handler->display->display_options['relationships']['field_product_product_id']['id'] = 'field_product_product_id';
  $handler->display->display_options['relationships']['field_product_product_id']['table'] = 'field_data_field_product';
  $handler->display->display_options['relationships']['field_product_product_id']['field'] = 'field_product_product_id';
  $handler->display->display_options['relationships']['field_product_product_id']['relationship'] = 'field_commerce_product_target_id';
  /* Relationship: Entity Reference: Referencing entity */
  $handler->display->display_options['relationships']['reverse_field_series_episodes_node']['id'] = 'reverse_field_series_episodes_node';
  $handler->display->display_options['relationships']['reverse_field_series_episodes_node']['table'] = 'node';
  $handler->display->display_options['relationships']['reverse_field_series_episodes_node']['field'] = 'reverse_field_series_episodes_node';
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Path */
  $handler->display->display_options['fields']['path']['id'] = 'path';
  $handler->display->display_options['fields']['path']['table'] = 'node';
  $handler->display->display_options['fields']['path']['field'] = 'path';
  $handler->display->display_options['fields']['path']['label'] = '';
  $handler->display->display_options['fields']['path']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['path']['alter']['text'] = '<a name="[path]"></a>';
  $handler->display->display_options['fields']['path']['element_label_colon'] = FALSE;
  /* Field: Content: Sub */
  $handler->display->display_options['fields']['field_subtext']['id'] = 'field_subtext';
  $handler->display->display_options['fields']['field_subtext']['table'] = 'field_data_field_subtext';
  $handler->display->display_options['fields']['field_subtext']['field'] = 'field_subtext';
  $handler->display->display_options['fields']['field_subtext']['label'] = '';
  $handler->display->display_options['fields']['field_subtext']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_subtext']['hide_empty'] = TRUE;
  /* Field: Global: Fieldset */
  $handler->display->display_options['fields']['fieldset']['id'] = 'fieldset';
  $handler->display->display_options['fields']['fieldset']['table'] = 'views';
  $handler->display->display_options['fields']['fieldset']['field'] = 'fieldset';
  $handler->display->display_options['fields']['fieldset']['label'] = 'field-group-connection';
  $handler->display->display_options['fields']['fieldset']['children'] = array(
    0 => 'field_splash_image',
    1 => 'field_quote',
    2 => 'field_quote_by',
    3 => 'field_supplemental',
  );
  $handler->display->display_options['fields']['fieldset']['fieldset']['type'] = 'div';
  /* Field: Content: Splash Image */
  $handler->display->display_options['fields']['field_splash_image']['id'] = 'field_splash_image';
  $handler->display->display_options['fields']['field_splash_image']['table'] = 'field_data_field_splash_image';
  $handler->display->display_options['fields']['field_splash_image']['field'] = 'field_splash_image';
  $handler->display->display_options['fields']['field_splash_image']['label'] = '';
  $handler->display->display_options['fields']['field_splash_image']['alter']['make_link'] = TRUE;
  $handler->display->display_options['fields']['field_splash_image']['alter']['path'] = '#[path]';
  $handler->display->display_options['fields']['field_splash_image']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_splash_image']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_splash_image']['type'] = 'file_image_image';
  $handler->display->display_options['fields']['field_splash_image']['settings'] = array(
    'image_style' => 'episode-image',
    'image_link' => '',
  );
  /* Field: Content: Quote */
  $handler->display->display_options['fields']['field_quote']['id'] = 'field_quote';
  $handler->display->display_options['fields']['field_quote']['table'] = 'field_data_field_quote';
  $handler->display->display_options['fields']['field_quote']['field'] = 'field_quote';
  $handler->display->display_options['fields']['field_quote']['label'] = '';
  $handler->display->display_options['fields']['field_quote']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['field_quote']['alter']['text'] = '<blockquote>[field_quote]</blockquote>';
  $handler->display->display_options['fields']['field_quote']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_quote']['hide_empty'] = TRUE;
  /* Field: Content: Cited */
  $handler->display->display_options['fields']['field_quote_by']['id'] = 'field_quote_by';
  $handler->display->display_options['fields']['field_quote_by']['table'] = 'field_data_field_quote_by';
  $handler->display->display_options['fields']['field_quote_by']['field'] = 'field_quote_by';
  $handler->display->display_options['fields']['field_quote_by']['label'] = '';
  $handler->display->display_options['fields']['field_quote_by']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_quote_by']['hide_empty'] = TRUE;
  /* Field: Content: Supplemental */
  $handler->display->display_options['fields']['field_supplemental']['id'] = 'field_supplemental';
  $handler->display->display_options['fields']['field_supplemental']['table'] = 'field_data_field_supplemental';
  $handler->display->display_options['fields']['field_supplemental']['field'] = 'field_supplemental';
  $handler->display->display_options['fields']['field_supplemental']['label'] = '';
  $handler->display->display_options['fields']['field_supplemental']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_supplemental']['hide_empty'] = TRUE;
  /* Field: Content: Year */
  $handler->display->display_options['fields']['field_year']['id'] = 'field_year';
  $handler->display->display_options['fields']['field_year']['table'] = 'field_data_field_year';
  $handler->display->display_options['fields']['field_year']['field'] = 'field_year';
  $handler->display->display_options['fields']['field_year']['relationship'] = 'reverse_field_series_episodes_node';
  $handler->display->display_options['fields']['field_year']['label'] = '';
  $handler->display->display_options['fields']['field_year']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_year']['hide_empty'] = TRUE;
  /* Field: Broken/missing handler */
  $handler->display->display_options['fields']['field_length']['id'] = 'field_length';
  $handler->display->display_options['fields']['field_length']['table'] = 'field_data_field_length';
  $handler->display->display_options['fields']['field_length']['field'] = 'field_length';
  $handler->display->display_options['fields']['field_length']['label'] = '';
  $handler->display->display_options['fields']['field_length']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_length']['hide_empty'] = TRUE;
  /* Field: Content: Guidance */
  $handler->display->display_options['fields']['field_guidance']['id'] = 'field_guidance';
  $handler->display->display_options['fields']['field_guidance']['table'] = 'field_data_field_guidance';
  $handler->display->display_options['fields']['field_guidance']['field'] = 'field_guidance';
  $handler->display->display_options['fields']['field_guidance']['label'] = '';
  $handler->display->display_options['fields']['field_guidance']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_guidance']['hide_empty'] = TRUE;
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['element_type'] = 'h3';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
  /* Field: Global: View result counter */
  $handler->display->display_options['fields']['counter']['id'] = 'counter';
  $handler->display->display_options['fields']['counter']['table'] = 'views';
  $handler->display->display_options['fields']['counter']['field'] = 'counter';
  $handler->display->display_options['fields']['counter']['label'] = '';
  $handler->display->display_options['fields']['counter']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['counter']['alter']['text'] = 'Episode [counter]';
  $handler->display->display_options['fields']['counter']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['counter']['counter_start'] = '1';
  /* Field: Content: Brand */
  $handler->display->display_options['fields']['field_brand']['id'] = 'field_brand';
  $handler->display->display_options['fields']['field_brand']['table'] = 'field_data_field_brand';
  $handler->display->display_options['fields']['field_brand']['field'] = 'field_brand';
  $handler->display->display_options['fields']['field_brand']['relationship'] = 'reverse_field_series_episodes_node';
  $handler->display->display_options['fields']['field_brand']['label'] = 'from';
  $handler->display->display_options['fields']['field_brand']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_brand']['settings'] = array(
    'link' => 1,
  );
  /* Field: Series title */
  $handler->display->display_options['fields']['title_1']['id'] = 'title_1';
  $handler->display->display_options['fields']['title_1']['table'] = 'node';
  $handler->display->display_options['fields']['title_1']['field'] = 'title';
  $handler->display->display_options['fields']['title_1']['relationship'] = 'reverse_field_series_episodes_node';
  $handler->display->display_options['fields']['title_1']['ui_name'] = 'Series title';
  $handler->display->display_options['fields']['title_1']['label'] = '';
  $handler->display->display_options['fields']['title_1']['element_label_colon'] = FALSE;
  /* Field: Content: Body */
  $handler->display->display_options['fields']['body']['id'] = 'body';
  $handler->display->display_options['fields']['body']['table'] = 'field_data_body';
  $handler->display->display_options['fields']['body']['field'] = 'body';
  $handler->display->display_options['fields']['body']['label'] = '';
  $handler->display->display_options['fields']['body']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['body']['type'] = 'text_plain';
  /* Field: Content: Path */
  $handler->display->display_options['fields']['path_1']['id'] = 'path_1';
  $handler->display->display_options['fields']['path_1']['table'] = 'node';
  $handler->display->display_options['fields']['path_1']['field'] = 'path';
  $handler->display->display_options['fields']['path_1']['relationship'] = 'field_commerce_product_target_id';
  $handler->display->display_options['fields']['path_1']['label'] = '';
  $handler->display->display_options['fields']['path_1']['exclude'] = TRUE;
  $handler->display->display_options['fields']['path_1']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['path_1']['absolute'] = TRUE;
  /* Field: Commerce Product: Price */
  $handler->display->display_options['fields']['commerce_price']['id'] = 'commerce_price';
  $handler->display->display_options['fields']['commerce_price']['table'] = 'field_data_commerce_price';
  $handler->display->display_options['fields']['commerce_price']['field'] = 'commerce_price';
  $handler->display->display_options['fields']['commerce_price']['relationship'] = 'field_product_product_id';
  $handler->display->display_options['fields']['commerce_price']['label'] = '';
  $handler->display->display_options['fields']['commerce_price']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['commerce_price']['alter']['text'] = 'Buy [commerce_price]';
  $handler->display->display_options['fields']['commerce_price']['alter']['make_link'] = TRUE;
  $handler->display->display_options['fields']['commerce_price']['alter']['path'] = '[path_1]';
  $handler->display->display_options['fields']['commerce_price']['element_class'] = 'button small';
  $handler->display->display_options['fields']['commerce_price']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['commerce_price']['click_sort_column'] = 'amount';
  $handler->display->display_options['fields']['commerce_price']['settings'] = array(
    'calculation' => '0',
  );
  $handler->display->display_options['defaults']['arguments'] = FALSE;
  /* Contextual filter: Content: Nid */
  $handler->display->display_options['arguments']['nid']['id'] = 'nid';
  $handler->display->display_options['arguments']['nid']['table'] = 'node';
  $handler->display->display_options['arguments']['nid']['field'] = 'nid';
  $handler->display->display_options['arguments']['nid']['relationship'] = 'reverse_field_collected_node';
  $handler->display->display_options['arguments']['nid']['default_action'] = 'not found';
  $handler->display->display_options['arguments']['nid']['default_argument_type'] = 'node';
  $handler->display->display_options['arguments']['nid']['summary']['number_of_records'] = '0';
  $handler->display->display_options['arguments']['nid']['summary']['format'] = 'default_summary';
  $handler->display->display_options['arguments']['nid']['summary_options']['items_per_page'] = '25';
  $handler->display->display_options['defaults']['filter_groups'] = FALSE;
  $handler->display->display_options['defaults']['filters'] = FALSE;
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'episode' => 'episode',
  );
  $handler->display->display_options['argument_input'] = array(
    'nid' => array(
      'type' => 'context',
      'context' => 'entity:node.nid',
      'context_optional' => 0,
      'panel' => '0',
      'fixed' => '',
      'label' => 'Content: Nid',
    ),
  );
  $translatables['collection'] = array(
    t('Master'),
    t('COLLECTION'),
    t('more'),
    t('Apply'),
    t('Reset'),
    t('Sort by'),
    t('Asc'),
    t('Desc'),
    t('Content entity referenced from field_commerce_product'),
    t('Products referenced by field_product'),
    t('Buy [commerce_price]'),
    t('[field_collected_count] Episodes'),
    t('All'),
    t('Hero pane'),
    t('Content entity referenced from field_brand'),
    t('Group meta data'),
    t('View panes'),
    t('Collection Control'),
    t('Content referencing Content from field_collected'),
    t('Content referencing Content from field_series_episodes'),
    t('Episode [counter]'),
    t('<a href="#[path]"><span class="control-text"><span class="episode">[counter]</span><span class="sub">[title]</span></a>'),
    t('Collection List'),
    t('<a name="[path]"></a>'),
    t('field-group-connection'),
    t('<blockquote>[field_quote]</blockquote>'),
    t('from'),
  );
  $export['collection'] = $view;

  $view = new view();
  $view->name = 'collection_showcase';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Showcase Collection';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'COLLECTION';
  $handler->display->display_options['css_class'] = 'row';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'some';
  $handler->display->display_options['pager']['options']['items_per_page'] = '1';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'fields';
  /* Relationship: Entity Reference: Referenced Entity */
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['id'] = 'field_commerce_product_target_id';
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['table'] = 'field_data_field_commerce_product';
  $handler->display->display_options['relationships']['field_commerce_product_target_id']['field'] = 'field_commerce_product_target_id';
  /* Relationship: Content: Referenced products */
  $handler->display->display_options['relationships']['field_product_product_id']['id'] = 'field_product_product_id';
  $handler->display->display_options['relationships']['field_product_product_id']['table'] = 'field_data_field_product';
  $handler->display->display_options['relationships']['field_product_product_id']['field'] = 'field_product_product_id';
  $handler->display->display_options['relationships']['field_product_product_id']['relationship'] = 'field_commerce_product_target_id';
  /* Field: Global: Fieldset */
  $handler->display->display_options['fields']['fieldset']['id'] = 'fieldset';
  $handler->display->display_options['fields']['fieldset']['table'] = 'views';
  $handler->display->display_options['fields']['fieldset']['field'] = 'fieldset';
  $handler->display->display_options['fields']['fieldset']['label'] = 'group meta data';
  $handler->display->display_options['fields']['fieldset']['children'] = array(
    0 => 'path',
    1 => 'title',
    2 => 'body',
    3 => 'commerce_price',
    4 => 'field_collected_count',
  );
  $handler->display->display_options['fields']['fieldset']['fieldset']['type'] = 'div';
  $handler->display->display_options['fields']['fieldset']['fieldset']['classes'] = 'columns large-5 collection-meta';
  /* Field: Content: Path */
  $handler->display->display_options['fields']['path']['id'] = 'path';
  $handler->display->display_options['fields']['path']['table'] = 'node';
  $handler->display->display_options['fields']['path']['field'] = 'path';
  $handler->display->display_options['fields']['path']['label'] = '';
  $handler->display->display_options['fields']['path']['exclude'] = TRUE;
  $handler->display->display_options['fields']['path']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['path']['absolute'] = TRUE;
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  /* Field: Content: Body */
  $handler->display->display_options['fields']['body']['id'] = 'body';
  $handler->display->display_options['fields']['body']['table'] = 'field_data_body';
  $handler->display->display_options['fields']['body']['field'] = 'body';
  $handler->display->display_options['fields']['body']['label'] = '';
  $handler->display->display_options['fields']['body']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['body']['type'] = 'text_plain';
  /* Field: Commerce Product: Price */
  $handler->display->display_options['fields']['commerce_price']['id'] = 'commerce_price';
  $handler->display->display_options['fields']['commerce_price']['table'] = 'field_data_commerce_price';
  $handler->display->display_options['fields']['commerce_price']['field'] = 'commerce_price';
  $handler->display->display_options['fields']['commerce_price']['relationship'] = 'field_product_product_id';
  $handler->display->display_options['fields']['commerce_price']['label'] = '';
  $handler->display->display_options['fields']['commerce_price']['alter']['make_link'] = TRUE;
  $handler->display->display_options['fields']['commerce_price']['alter']['path'] = '[path]';
  $handler->display->display_options['fields']['commerce_price']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['commerce_price']['click_sort_column'] = 'amount';
  $handler->display->display_options['fields']['commerce_price']['settings'] = array(
    'calculation' => '0',
  );
  /* Field: Content: Episode Count */
  $handler->display->display_options['fields']['field_collected_count']['id'] = 'field_collected_count';
  $handler->display->display_options['fields']['field_collected_count']['table'] = 'field_data_field_collected_count';
  $handler->display->display_options['fields']['field_collected_count']['field'] = 'field_collected_count';
  $handler->display->display_options['fields']['field_collected_count']['label'] = '';
  $handler->display->display_options['fields']['field_collected_count']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['field_collected_count']['alter']['text'] = '<a class="button" href="[path]"><span class="collection-count number">[field_collected_count]</span><span class="collection-count shows">Programs</span><span class="collection-count view full">View full collection</span></a>';
  $handler->display->display_options['fields']['field_collected_count']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_collected_count']['settings'] = array(
    'thousand_separator' => '',
    'prefix_suffix' => 0,
  );
  /* Field: Content: Featured Image */
  $handler->display->display_options['fields']['field_featured_image']['id'] = 'field_featured_image';
  $handler->display->display_options['fields']['field_featured_image']['table'] = 'field_data_field_featured_image';
  $handler->display->display_options['fields']['field_featured_image']['field'] = 'field_featured_image';
  $handler->display->display_options['fields']['field_featured_image']['label'] = '';
  $handler->display->display_options['fields']['field_featured_image']['element_class'] = 'large-7 columns collection-hero-image';
  $handler->display->display_options['fields']['field_featured_image']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_featured_image']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_featured_image']['settings'] = array(
    'image_style' => '',
    'image_link' => 'content',
  );
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Filter criterion: Content: Published */
  $handler->display->display_options['filters']['status']['id'] = 'status';
  $handler->display->display_options['filters']['status']['table'] = 'node';
  $handler->display->display_options['filters']['status']['field'] = 'status';
  $handler->display->display_options['filters']['status']['value'] = 1;
  $handler->display->display_options['filters']['status']['group'] = 1;
  $handler->display->display_options['filters']['status']['expose']['operator'] = FALSE;
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'episodic_collection' => 'episodic_collection',
  );
  /* Filter criterion: Content: Featured (field_featured) */
  $handler->display->display_options['filters']['field_featured_value']['id'] = 'field_featured_value';
  $handler->display->display_options['filters']['field_featured_value']['table'] = 'field_data_field_featured';
  $handler->display->display_options['filters']['field_featured_value']['field'] = 'field_featured_value';
  $handler->display->display_options['filters']['field_featured_value']['value'] = array(
    1 => '1',
  );

  /* Display: Content pane */
  $handler = $view->new_display('panel_pane', 'Content pane', 'featured_collection_pane');
  $translatables['collection_showcase'] = array(
    t('Master'),
    t('COLLECTION'),
    t('more'),
    t('Apply'),
    t('Reset'),
    t('Sort by'),
    t('Asc'),
    t('Desc'),
    t('Content entity referenced from field_commerce_product'),
    t('Products referenced by field_product'),
    t('group meta data'),
    t('<a class="button" href="[path]"><span class="collection-count number">[field_collected_count]</span><span class="collection-count shows">Programs</span><span class="collection-count view full">View full collection</span></a>'),
    t('Content pane'),
    t('View panes'),
  );
  $export['collection_showcase'] = $view;

  return $export;
}
