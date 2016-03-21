<?php
/**
 * @file
 * df_tools_hero.fieldable_panels_pane_type.inc
 */

/**
 * Implements hook_default_fieldable_panels_pane_type().
 */
function df_tools_hero_default_fieldable_panels_pane_type() {
  $export = array();

  $fieldable_panels_pane_type = new stdClass();
  $fieldable_panels_pane_type->disabled = FALSE; /* Edit this to true to make a default fieldable_panels_pane_type disabled initially */
  $fieldable_panels_pane_type->api_version = 1;
  $fieldable_panels_pane_type->name = 'hero';
  $fieldable_panels_pane_type->title = 'Hero';
  $fieldable_panels_pane_type->description = 'Defines a Hero FPP that contains a title, body text, and a hero image.';
  $export['hero'] = $fieldable_panels_pane_type;

  return $export;
}
