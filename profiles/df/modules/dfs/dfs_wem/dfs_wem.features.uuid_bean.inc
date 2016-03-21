<?php
/**
 * @file
 * dfs_wem.features.uuid_bean.inc
 */

/**
 * Implements hook_uuid_features_default_beans().
 */
function dfs_wem_uuid_features_default_beans() {
  $beans = array();

  $beans[] = array(
    'label' => 'WEM - Page Related Product',
    'description' => NULL,
    'title' => 'Related Trip',
    'type' => 'bean_tax_related',
    'data' => array(
      'view_mode' => 'default',
      'filters' => array(
        'records_shown' => 1,
        'offset_results' => 0,
        'vocabulary' => array(
          'interests' => 'interests',
        ),
      ),
      'settings' => array(
        'related' => 'page',
        'cache_duration' => 5,
        'cache_auth_user' => 1,
        'cache_anon_user' => 1,
        'entity_type' => 'node',
        'entity_view_mode' => 'featured',
        'bundle_types' => array(
          'wem_commerce' => 'wem_commerce',
        ),
        'hide_empty' => 1,
        'unmatch_add' => 1,
      ),
      'more_link' => array(
        'text' => '',
        'path' => '',
      ),
    ),
    'delta' => 'wem---page-related-product',
    'view_mode' => 'default',
    'created' => 1372872794,
    'log' => '',
    'uid' => 0,
    'default_revision' => 1,
    'revisions' => array(),
    'vuuid' => '2012f872-c6f3-47a2-8cfa-9b1b00ed4ee5',
    'uuid' => '35f72018-6785-49d8-9321-bae896390db9',
    'filters' => array(
      'records_shown' => 1,
      'offset_results' => 0,
      'vocabulary' => array(
        'interests' => 'interests',
      ),
    ),
    'settings' => array(
      'related' => 'page',
      'cache_duration' => 5,
      'cache_auth_user' => 1,
      'cache_anon_user' => 1,
      'entity_type' => 'node',
      'entity_view_mode' => 'featured',
      'bundle_types' => array(
        'wem_commerce' => 'wem_commerce',
      ),
      'hide_empty' => 1,
      'unmatch_add' => 1,
    ),
    'more_link' => array(
      'text' => '',
      'path' => '',
    ),
    'entity_type' => 'bean',
  );
  $beans[] = array(
    'label' => 'WEM - User Related Product (Secondary)',
    'description' => NULL,
    'title' => 'Featured Product',
    'type' => 'bean_tax_related',
    'data' => array(
      'view_mode' => 'default',
      'filters' => array(
        'records_shown' => 1,
        'offset_results' => 1,
        'vocabulary' => array(
          'interests' => 'interests',
        ),
      ),
      'settings' => array(
        'related' => 'user',
        'cache_duration' => 5,
        'cache_auth_user' => 1,
        'cache_anon_user' => 1,
        'entity_type' => 'node',
        'entity_view_mode' => 'featured',
        'bundle_types' => array(
          'wem_commerce' => 'wem_commerce',
        ),
        'hide_empty' => 1,
        'unmatch_add' => 1,
      ),
      'more_link' => array(
        'text' => '',
        'path' => '',
      ),
    ),
    'delta' => 'wem---user-related-product-secon',
    'view_mode' => 'default',
    'created' => 1372869756,
    'log' => '',
    'uid' => 0,
    'default_revision' => 1,
    'revisions' => array(),
    'vuuid' => 'c7fbb0e6-1aae-4c94-ab33-19d335d81a83',
    'uuid' => '4ed8dc32-c8c7-46b9-a484-2f03bef1e78b',
    'filters' => array(
      'records_shown' => 1,
      'offset_results' => 1,
      'vocabulary' => array(
        'interests' => 'interests',
      ),
    ),
    'settings' => array(
      'related' => 'user',
      'cache_duration' => 5,
      'cache_auth_user' => 1,
      'cache_anon_user' => 1,
      'entity_type' => 'node',
      'entity_view_mode' => 'featured',
      'bundle_types' => array(
        'wem_commerce' => 'wem_commerce',
      ),
      'hide_empty' => 1,
      'unmatch_add' => 1,
    ),
    'more_link' => array(
      'text' => '',
      'path' => '',
    ),
    'entity_type' => 'bean',
  );
  $beans[] = array(
    'label' => 'WEM - User Related Contest',
    'description' => NULL,
    'title' => 'Nexus Contest',
    'type' => 'bean_tax_related',
    'data' => array(
      'view_mode' => 'default',
      'filters' => array(
        'records_shown' => 1,
        'offset_results' => 0,
        'vocabulary' => array(
          0 => 'interests',
        ),
      ),
      'settings' => array(
        'cache_duration' => 5,
        'related' => 'user',
        'cache_auth_user' => 1,
        'cache_anon_user' => 1,
        'entity_type' => 'node',
        'entity_view_mode' => 'featured',
        'bundle_types' => array(
          0 => 'wem_contest',
        ),
        'hide_empty' => 1,
        'unmatch_add' => 1,
      ),
      'more_link' => array(
        'text' => '',
        'path' => '',
      ),
    ),
    'delta' => 'wem---user-related-contest',
    'view_mode' => 'default',
    'created' => 1372869843,
    'log' => '',
    'uid' => 0,
    'default_revision' => 1,
    'revisions' => array(),
    'vuuid' => 'd116c450-9f25-4867-8893-a8d3c0397000',
    'uuid' => '5eabc66b-122b-413d-a402-068617bdd415',
    'filters' => array(
      'records_shown' => 1,
      'offset_results' => 0,
      'vocabulary' => array(
        0 => 'interests',
      ),
    ),
    'settings' => array(
      'cache_duration' => 5,
      'related' => 'user',
      'cache_auth_user' => 1,
      'cache_anon_user' => 1,
      'entity_type' => 'node',
      'entity_view_mode' => 'featured',
      'bundle_types' => array(
        0 => 'wem_contest',
      ),
      'hide_empty' => 1,
      'unmatch_add' => 1,
    ),
    'more_link' => array(
      'text' => '',
      'path' => '',
    ),
    'entity_type' => 'bean',
  );
  $beans[] = array(
    'label' => 'WEM - User More Contests',
    'description' => NULL,
    'title' => 'More Contests',
    'type' => 'bean_tax_related',
    'data' => array(
      'view_mode' => 'default',
      'filters' => array(
        'records_shown' => 4,
        'offset_results' => 1,
        'vocabulary' => array(
          0 => 'interests',
        ),
      ),
      'settings' => array(
        'related' => 'user',
        'cache_duration' => 5,
        'cache_auth_user' => 1,
        'cache_anon_user' => 1,
        'entity_type' => 'node',
        'entity_view_mode' => 'featured',
        'bundle_types' => array(
          0 => 'wem_contest',
        ),
        'unmatch_add' => 1,
      ),
      'more_link' => array(
        'text' => '',
        'path' => '',
      ),
    ),
    'delta' => 'wem---user-more-contests',
    'view_mode' => 'default',
    'created' => 1393398124,
    'log' => '',
    'uid' => 0,
    'default_revision' => 1,
    'revisions' => array(),
    'vuuid' => '72b0eb43-055e-4ef4-b801-0a6b04d1d1af',
    'uuid' => '8ea31756-4a2f-44b0-ae6f-11b53dcfb4ba',
    'filters' => array(
      'records_shown' => 4,
      'offset_results' => 1,
      'vocabulary' => array(
        0 => 'interests',
      ),
    ),
    'settings' => array(
      'related' => 'user',
      'cache_duration' => 5,
      'cache_auth_user' => 1,
      'cache_anon_user' => 1,
      'entity_type' => 'node',
      'entity_view_mode' => 'featured',
      'bundle_types' => array(
        0 => 'wem_contest',
      ),
      'unmatch_add' => 1,
    ),
    'more_link' => array(
      'text' => '',
      'path' => '',
    ),
    'entity_type' => 'bean',
  );
  $beans[] = array(
    'label' => 'WEM - Page Secondary',
    'description' => NULL,
    'title' => 'More Like This',
    'type' => 'bean_tax_related',
    'data' => array(
      'view_mode' => 'default',
      'filters' => array(
        'records_shown' => 4,
        'offset_results' => 0,
        'vocabulary' => array(
          'interests' => 'interests',
        ),
      ),
      'settings' => array(
        'related' => 'page',
        'cache_duration' => 5,
        'cache_auth_user' => 1,
        'cache_anon_user' => 1,
        'entity_type' => 'node',
        'entity_view_mode' => 'featured',
        'bundle_types' => array(
          'wem_news' => 'wem_news',
        ),
        'hide_empty' => 1,
        'unmatch_add' => 1,
      ),
      'more_link' => array(
        'text' => '',
        'path' => '',
      ),
    ),
    'delta' => 'wem---page-secondary',
    'view_mode' => 'default',
    'created' => 1393289673,
    'log' => '',
    'uid' => 0,
    'default_revision' => 1,
    'revisions' => array(),
    'vuuid' => '322333bd-7690-46c7-a7e6-e9fb6c8e99cc',
    'uuid' => 'a0b74278-75b9-490c-b702-782e50710793',
    'filters' => array(
      'records_shown' => 4,
      'offset_results' => 0,
      'vocabulary' => array(
        'interests' => 'interests',
      ),
    ),
    'settings' => array(
      'related' => 'page',
      'cache_duration' => 5,
      'cache_auth_user' => 1,
      'cache_anon_user' => 1,
      'entity_type' => 'node',
      'entity_view_mode' => 'featured',
      'bundle_types' => array(
        'wem_news' => 'wem_news',
      ),
      'hide_empty' => 1,
      'unmatch_add' => 1,
    ),
    'more_link' => array(
      'text' => '',
      'path' => '',
    ),
    'entity_type' => 'bean',
  );
  $beans[] = array(
    'label' => 'WEM - User Related Product (Primary)',
    'description' => NULL,
    'title' => 'Featured Product',
    'type' => 'bean_tax_related',
    'data' => array(
      'view_mode' => 'default',
      'filters' => array(
        'records_shown' => 1,
        'offset_results' => 0,
        'vocabulary' => array(
          0 => 'interests',
        ),
      ),
      'settings' => array(
        'related' => 'user',
        'cache_duration' => 5,
        'cache_auth_user' => 1,
        'cache_anon_user' => 1,
        'entity_type' => 'node',
        'entity_view_mode' => 'featured',
        'bundle_types' => array(
          0 => 'wem_commerce',
        ),
        'hide_empty' => 1,
        'unmatch_add' => 1,
      ),
      'more_link' => array(
        'text' => '',
        'path' => '',
      ),
    ),
    'delta' => 'wem---user-related-product-prima',
    'view_mode' => 'default',
    'created' => 1372869718,
    'log' => '',
    'uid' => 0,
    'default_revision' => 1,
    'revisions' => array(),
    'vuuid' => 'ca7316bc-eeab-410d-a464-e252c5983c18',
    'uuid' => 'b94a5b9d-d1e8-469c-a520-fb4b4047956a',
    'filters' => array(
      'records_shown' => 1,
      'offset_results' => 0,
      'vocabulary' => array(
        0 => 'interests',
      ),
    ),
    'settings' => array(
      'related' => 'user',
      'cache_duration' => 5,
      'cache_auth_user' => 1,
      'cache_anon_user' => 1,
      'entity_type' => 'node',
      'entity_view_mode' => 'featured',
      'bundle_types' => array(
        0 => 'wem_commerce',
      ),
      'hide_empty' => 1,
      'unmatch_add' => 1,
    ),
    'more_link' => array(
      'text' => '',
      'path' => '',
    ),
    'entity_type' => 'bean',
  );
  $beans[] = array(
    'label' => 'WEM - User Related News',
    'description' => NULL,
    'title' => 'Related Guides',
    'type' => 'bean_tax_related',
    'data' => array(
      'view_mode' => 'default',
      'filters' => array(
        'records_shown' => 4,
        'offset_results' => 1,
        'vocabulary' => array(
          'interests' => 'interests',
        ),
      ),
      'settings' => array(
        'related' => 'user',
        'cache_duration' => 5,
        'cache_auth_user' => 1,
        'cache_anon_user' => 1,
        'entity_type' => 'node',
        'entity_view_mode' => 'thumbnail',
        'bundle_types' => array(
          'wem_news' => 'wem_news',
        ),
        'hide_empty' => 1,
        'unmatch_add' => 1,
      ),
      'more_link' => array(
        'text' => '',
        'path' => '',
      ),
    ),
    'delta' => 'wem---user-related-news',
    'view_mode' => 'default',
    'created' => 1372890591,
    'log' => '',
    'uid' => 0,
    'default_revision' => 1,
    'revisions' => array(),
    'vuuid' => '7935d9c4-da6c-4c28-baab-90f8e4b4a057',
    'uuid' => 'd8ae7672-37d6-457a-8943-e88c05e619ec',
    'filters' => array(
      'records_shown' => 4,
      'offset_results' => 1,
      'vocabulary' => array(
        'interests' => 'interests',
      ),
    ),
    'settings' => array(
      'related' => 'user',
      'cache_duration' => 5,
      'cache_auth_user' => 1,
      'cache_anon_user' => 1,
      'entity_type' => 'node',
      'entity_view_mode' => 'thumbnail',
      'bundle_types' => array(
        'wem_news' => 'wem_news',
      ),
      'hide_empty' => 1,
      'unmatch_add' => 1,
    ),
    'more_link' => array(
      'text' => '',
      'path' => '',
    ),
    'entity_type' => 'bean',
  );
  $beans[] = array(
    'label' => 'WEM - User Related News Item',
    'description' => NULL,
    'title' => 'Guides',
    'type' => 'bean_tax_related',
    'data' => array(
      'view_mode' => 'default',
      'filters' => array(
        'records_shown' => 1,
        'offset_results' => 0,
        'vocabulary' => array(
          'interests' => 'interests',
        ),
      ),
      'settings' => array(
        'related' => 'user',
        'cache_duration' => 5,
        'cache_auth_user' => 1,
        'cache_anon_user' => 1,
        'entity_type' => 'node',
        'entity_view_mode' => 'featured',
        'bundle_types' => array(
          'wem_news' => 'wem_news',
        ),
        'hide_empty' => 1,
        'unmatch_add' => 1,
      ),
      'more_link' => array(
        'text' => '',
        'path' => '',
      ),
    ),
    'delta' => 'wem---user-related-news-item',
    'view_mode' => 'default',
    'created' => 1372870335,
    'log' => '',
    'uid' => 0,
    'default_revision' => 1,
    'revisions' => array(),
    'vuuid' => '21a6188d-9680-4984-88a7-ca19383a81b5',
    'uuid' => 'ea56341c-11a6-443a-b174-eda8650c85f1',
    'filters' => array(
      'records_shown' => 1,
      'offset_results' => 0,
      'vocabulary' => array(
        'interests' => 'interests',
      ),
    ),
    'settings' => array(
      'related' => 'user',
      'cache_duration' => 5,
      'cache_auth_user' => 1,
      'cache_anon_user' => 1,
      'entity_type' => 'node',
      'entity_view_mode' => 'featured',
      'bundle_types' => array(
        'wem_news' => 'wem_news',
      ),
      'hide_empty' => 1,
      'unmatch_add' => 1,
    ),
    'more_link' => array(
      'text' => '',
      'path' => '',
    ),
    'entity_type' => 'bean',
  );
  return $beans;
}
