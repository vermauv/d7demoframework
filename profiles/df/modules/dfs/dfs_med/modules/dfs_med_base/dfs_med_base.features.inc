<?php
/**
 * @file
 * dfs_med_base.features.inc
 */

/**
 * Implements hook_views_api().
 */
function dfs_med_base_views_api($module = NULL, $api = NULL) {
  return array("api" => "3.0");
}

/**
 * Implements hook_image_default_styles().
 */
function dfs_med_base_image_default_styles() {
  $styles = array();

  // Exported image style: article-callout.
  $styles['article-callout'] = array(
    'label' => 'article-callout',
    'effects' => array(
      5 => array(
        'name' => 'image_scale_and_crop',
        'data' => array(
          'width' => 232,
          'height' => 131,
          '#imageinfo_cache_effect_callback' => 'image_scale_and_crop_effect',
        ),
        'weight' => 1,
      ),
    ),
  );

  // Exported image style: collection-hero.
  $styles['collection-hero'] = array(
    'label' => 'collection-hero',
    'effects' => array(
      6 => array(
        'name' => 'focal_point_scale_and_crop',
        'data' => array(
          'width' => 1200,
          'height' => 600,
          '#imageinfo_cache_effect_callback' => 'focal_point_scale_and_crop_effect',
        ),
        'weight' => 1,
      ),
      7 => array(
        'name' => 'image_scale_and_crop',
        'data' => array(
          'width' => 1200,
          'height' => 600,
        ),
        'weight' => 2,
      ),
    ),
  );

  // Exported image style: episode-control.
  $styles['episode-control'] = array(
    'label' => 'episode-control',
    'effects' => array(
      4 => array(
        'name' => 'image_scale_and_crop',
        'data' => array(
          'width' => 150,
          'height' => 85,
          '#imageinfo_cache_effect_callback' => 'image_scale_and_crop_effect',
        ),
        'weight' => 1,
      ),
    ),
  );

  // Exported image style: episode-image.
  $styles['episode-image'] = array(
    'label' => 'episode-image',
    'effects' => array(
      3 => array(
        'name' => 'image_scale_and_crop',
        'data' => array(
          'width' => 480,
          'height' => 271,
          '#imageinfo_cache_effect_callback' => 'image_scale_and_crop_effect',
        ),
        'weight' => 1,
      ),
    ),
  );

  // Exported image style: product-thumb.
  $styles['product-thumb'] = array(
    'label' => 'product-thumb',
    'effects' => array(
      1 => array(
        'name' => 'focal_point_scale_and_crop',
        'data' => array(
          'width' => 149,
          'height' => 149,
          '#imageinfo_cache_effect_callback' => 'focal_point_scale_and_crop_effect',
        ),
        'weight' => 1,
      ),
      2 => array(
        'name' => 'image_scale_and_crop',
        'data' => array(
          'width' => 149,
          'height' => 149,
        ),
        'weight' => 2,
      ),
    ),
  );

  return $styles;
}
