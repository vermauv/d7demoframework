<?php
/**
 * @file
 * df_tools_hero_block.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function df_tools_hero_block_field_group_info() {
  $field_groups = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_hero_elements|bean|df_bean_hero|default';
  $field_group->group_name = 'group_hero_elements';
  $field_group->entity_type = 'bean';
  $field_group->bundle = 'df_bean_hero';
  $field_group->mode = 'default';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Hero elements',
    'weight' => '1',
    'children' => array(
      0 => 'field_hero_headline_1',
      1 => 'field_hero_headline_2',
      2 => 'field_hero_button',
      3 => 'title',
    ),
    'format_type' => 'div',
    'format_settings' => array(
      'label' => 'Hero elements',
      'instance_settings' => array(
        'classes' => 'group-hero-elements field-group-div hero-elements',
        'description' => '',
        'show_label' => '0',
        'label_element' => 'h3',
        'effect' => 'none',
        'speed' => 'fast',
      ),
      'formatter' => 'open',
    ),
  );
  $field_groups['group_hero_elements|bean|df_bean_hero|default'] = $field_group;

  // Translatables
  // Included for use with string extractors like potx.
  t('Hero elements');

  return $field_groups;
}
