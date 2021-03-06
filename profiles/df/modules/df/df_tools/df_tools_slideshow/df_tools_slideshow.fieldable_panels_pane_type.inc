<?php
/**
 * @file
 * df_tools_slideshow.fieldable_panels_pane_type.inc
 */

/**
 * Implements hook_default_fieldable_panels_pane_type().
 */
function df_tools_slideshow_default_fieldable_panels_pane_type() {
  $export = array();

  $fieldable_panels_pane_type = new stdClass();
  $fieldable_panels_pane_type->disabled = FALSE; /* Edit this to true to make a default fieldable_panels_pane_type disabled initially */
  $fieldable_panels_pane_type->api_version = 1;
  $fieldable_panels_pane_type->name = 'slideshow';
  $fieldable_panels_pane_type->title = 'Slideshow';
  $fieldable_panels_pane_type->description = 'An image slideshow fieldable panel pane.';
  $export['slideshow'] = $fieldable_panels_pane_type;

  return $export;
}
