<?php
/**
 * @file
 * dfs_med_menu.features.menu_links.inc
 */

/**
 * Implements hook_menu_default_menu_links().
 */
function dfs_med_menu_menu_default_menu_links() {
  $menu_links = array();

  // Exported menu link: main-menu_collections:search/node/collections
  $menu_links['main-menu_collections:search/node/collections'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'search/node/top type:episodic_collection',
    'router_path' => 'search/node/%',
    'link_title' => 'Collections',
    'options' => array(
      'attributes' => array(),
      'item_attributes' => array(
        'id' => '',
        'class' => '',
        'style' => '',
      ),
      'identifier' => 'main-menu_collections:search/node/collections',
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -46,
    'customized' => 1,
    'language' => 'und',
    'menu_links_customized' => 1,
  );
  // Exported menu link: main-menu_articles:articles
  $menu_links['main-menu_articles:articles'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'articles',
    'router_path' => 'articles',
    'link_title' => 'Editorials',
    'options' => array(
      'identifier' => 'main-menu_articles:articles',
      'attributes' => array(),
      'item_attributes' => array(
        'id' => '',
        'class' => '',
        'style' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -49,
    'customized' => 1,
    'language' => 'und',
    'menu_links_customized' => 1,
  );
  // Exported menu link: main-menu_holiday:search/node/holiday
  $menu_links['main-menu_holiday:search/node/holiday'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'search/node/holiday',
    'router_path' => 'search/node/%',
    'link_title' => 'Holiday',
    'options' => array(
      'identifier' => 'main-menu_holiday:search/node/holiday',
      'attributes' => array(),
      'item_attributes' => array(
        'id' => '',
        'class' => '',
        'style' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -50,
    'customized' => 1,
    'language' => 'und',
    'menu_links_customized' => 1,
    'parent_identifier' => 'main-menu_more:search/node/more',
  );
  // Exported menu link: main-menu_more:search/node/more
  $menu_links['main-menu_more:search/node/more'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'search/node/more',
    'router_path' => 'search/node/%',
    'link_title' => 'More',
    'options' => array(
      'attributes' => array(),
      'item_attributes' => array(
        'id' => '',
        'class' => 'last-ul',
        'style' => '',
      ),
      'identifier' => 'main-menu_more:search/node/more',
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 1,
    'expanded' => 0,
    'weight' => -45,
    'customized' => 1,
    'language' => 'und',
    'menu_links_customized' => 1,
  );
  // Exported menu link: main-menu_our-shows:our-shows
  $menu_links['main-menu_our-shows:our-shows'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'our-shows',
    'router_path' => 'our-shows',
    'link_title' => 'Our Shows',
    'options' => array(
      'identifier' => 'main-menu_our-shows:our-shows',
      'attributes' => array(),
      'item_attributes' => array(
        'id' => '',
        'class' => '',
        'style' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 1,
    'expanded' => 0,
    'weight' => -50,
    'customized' => 1,
    'language' => 'und',
    'menu_links_customized' => 1,
  );
  // Exported menu link: main-menu_sale:search/node/sale
  $menu_links['main-menu_sale:search/node/sale'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'search/node/sale',
    'router_path' => 'search/node/%',
    'link_title' => 'Sale',
    'options' => array(
      'identifier' => 'main-menu_sale:search/node/sale',
      'attributes' => array(),
      'item_attributes' => array(
        'id' => '',
        'class' => '',
        'style' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -48,
    'customized' => 1,
    'language' => 'und',
    'menu_links_customized' => 1,
  );
  // Translatables
  // Included for use with string extractors like potx.
  t('Collections');
  t('Editorials');
  t('Holiday');
  t('More');
  t('Our Shows');
  t('Sale');


  return $menu_links;
}
