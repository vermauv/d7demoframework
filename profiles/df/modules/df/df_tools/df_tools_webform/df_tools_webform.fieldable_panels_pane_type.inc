<?php
/**
 * @file
 * df_tools_webform.fieldable_panels_pane_type.inc
 */

/**
 * Implements hook_default_fieldable_panels_pane_type().
 */
function df_tools_webform_default_fieldable_panels_pane_type() {
  $export = array();

  $fieldable_panels_pane_type = new stdClass();
  $fieldable_panels_pane_type->disabled = FALSE; /* Edit this to true to make a default fieldable_panels_pane_type disabled initially */
  $fieldable_panels_pane_type->api_version = 1;
  $fieldable_panels_pane_type->name = 'web_form';
  $fieldable_panels_pane_type->title = 'Webform';
  $fieldable_panels_pane_type->description = 'An entity reference pointing to a Webform node.';
  $export['web_form'] = $fieldable_panels_pane_type;

  return $export;
}
