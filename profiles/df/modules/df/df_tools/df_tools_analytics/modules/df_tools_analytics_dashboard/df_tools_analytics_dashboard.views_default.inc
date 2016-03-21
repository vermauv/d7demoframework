<?php
/**
 * @file
 * df_tools_analytics_dashboard.views_default.inc
 */

/**
 * Implements hook_views_default_views().
 */
function df_tools_analytics_dashboard_views_default_views() {
  $export = array();

  $view = new view();
  $view->name = 'analytics_dashboard';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'google_analytics';
  $view->human_name = 'Analytics Dashboard';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['css_class'] = 'google-analytics-reports-summary';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['access']['perm'] = 'access google analytics reports';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'none';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['style_plugin'] = 'table';
  $handler->display->display_options['style_options']['columns'] = array(
    'sessions' => 'sessions',
    'pageviews' => 'pageviews',
    'pageviewsPerSession' => 'pageviewsPerSession',
    'bounceRate' => 'bounceRate',
    'avgSessionDuration' => 'avgSessionDuration',
    'percentNewSessions' => 'percentNewSessions',
  );
  $handler->display->display_options['style_options']['default'] = '-1';
  $handler->display->display_options['style_options']['info'] = array(
    'sessions' => array(
      'sortable' => 0,
      'default_sort_order' => 'asc',
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
    'pageviews' => array(
      'sortable' => 0,
      'default_sort_order' => 'asc',
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
    'pageviewsPerSession' => array(
      'sortable' => 0,
      'default_sort_order' => 'asc',
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
    'bounceRate' => array(
      'sortable' => 0,
      'default_sort_order' => 'asc',
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
    'avgSessionDuration' => array(
      'sortable' => 0,
      'default_sort_order' => 'asc',
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
    'percentNewSessions' => array(
      'sortable' => 0,
      'default_sort_order' => 'asc',
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
  );
  /* Field: Session metrics: Sessions */
  $handler->display->display_options['fields']['sessions']['id'] = 'sessions';
  $handler->display->display_options['fields']['sessions']['table'] = 'google_analytics';
  $handler->display->display_options['fields']['sessions']['field'] = 'sessions';
  $handler->display->display_options['fields']['sessions']['precision'] = '0';
  $handler->display->display_options['fields']['sessions']['separator'] = '';
  /* Field: Page tracking metrics: Pageviews */
  $handler->display->display_options['fields']['pageviews']['id'] = 'pageviews';
  $handler->display->display_options['fields']['pageviews']['table'] = 'google_analytics';
  $handler->display->display_options['fields']['pageviews']['field'] = 'pageviews';
  $handler->display->display_options['fields']['pageviews']['precision'] = '0';
  $handler->display->display_options['fields']['pageviews']['separator'] = '';
  /* Field: Page tracking calculated metrics: Pages / Session */
  $handler->display->display_options['fields']['pageviewsPerSession']['id'] = 'pageviewsPerSession';
  $handler->display->display_options['fields']['pageviewsPerSession']['table'] = 'google_analytics';
  $handler->display->display_options['fields']['pageviewsPerSession']['field'] = 'pageviewsPerSession';
  $handler->display->display_options['fields']['pageviewsPerSession']['set_precision'] = TRUE;
  $handler->display->display_options['fields']['pageviewsPerSession']['precision'] = '2';
  /* Field: Session calculated metrics: Bounce Rate */
  $handler->display->display_options['fields']['bounceRate']['id'] = 'bounceRate';
  $handler->display->display_options['fields']['bounceRate']['table'] = 'google_analytics';
  $handler->display->display_options['fields']['bounceRate']['field'] = 'bounceRate';
  $handler->display->display_options['fields']['bounceRate']['set_precision'] = TRUE;
  $handler->display->display_options['fields']['bounceRate']['precision'] = '2';
  $handler->display->display_options['fields']['bounceRate']['suffix'] = '%';
  /* Field: Session calculated metrics: Avg. Session Duration */
  $handler->display->display_options['fields']['avgSessionDuration']['id'] = 'avgSessionDuration';
  $handler->display->display_options['fields']['avgSessionDuration']['table'] = 'google_analytics';
  $handler->display->display_options['fields']['avgSessionDuration']['field'] = 'avgSessionDuration';
  $handler->display->display_options['fields']['avgSessionDuration']['date_format'] = 'custom';
  $handler->display->display_options['fields']['avgSessionDuration']['custom_date_format'] = 'i:s';
  $handler->display->display_options['fields']['avgSessionDuration']['second_date_format'] = 'long';
  /* Field: User calculated metrics: % New Sessions */
  $handler->display->display_options['fields']['percentNewSessions']['id'] = 'percentNewSessions';
  $handler->display->display_options['fields']['percentNewSessions']['table'] = 'google_analytics';
  $handler->display->display_options['fields']['percentNewSessions']['field'] = 'percentNewSessions';
  $handler->display->display_options['fields']['percentNewSessions']['label'] = 'New Sessions';
  $handler->display->display_options['fields']['percentNewSessions']['set_precision'] = TRUE;
  $handler->display->display_options['fields']['percentNewSessions']['precision'] = '2';
  $handler->display->display_options['fields']['percentNewSessions']['suffix'] = '%';
  /* Filter criterion: Google Analytics: Start date of report */
  $handler->display->display_options['filters']['start_date']['id'] = 'start_date';
  $handler->display->display_options['filters']['start_date']['table'] = 'google_analytics';
  $handler->display->display_options['filters']['start_date']['field'] = 'start_date';
  $handler->display->display_options['filters']['start_date']['value']['value'] = '-31 day';
  $handler->display->display_options['filters']['start_date']['value']['type'] = 'offset';
  $handler->display->display_options['filters']['start_date']['group'] = 1;
  /* Filter criterion: Google Analytics: End date of report */
  $handler->display->display_options['filters']['end_date']['id'] = 'end_date';
  $handler->display->display_options['filters']['end_date']['table'] = 'google_analytics';
  $handler->display->display_options['filters']['end_date']['field'] = 'end_date';
  $handler->display->display_options['filters']['end_date']['value']['value'] = '-1 day';
  $handler->display->display_options['filters']['end_date']['value']['type'] = 'offset';
  $handler->display->display_options['filters']['end_date']['group'] = 1;

  /* Display: Table */
  $handler = $view->new_display('panel_pane', 'Table', 'ga_table_pane');
  $export['analytics_dashboard'] = $view;

  return $export;
}
