<?php
/**
 * @file
 * dfs_med_commerce.features.features_overrides.inc
 */

/**
 * Implements hook_features_override_default_overrides().
 */
function dfs_med_commerce_features_override_default_overrides() {
  // This code is only used for UI in features. Exported alters hooks do the magic.
  $overrides = array();

  // Exported overrides for: field_group
  $overrides["field_group.group_com_tabs|node|commerce|form.data|weight"] = 2;
  $overrides["field_group.group_product|node|commerce|form.data|children|2"] = 'field_product_image';

 return $overrides;
}
