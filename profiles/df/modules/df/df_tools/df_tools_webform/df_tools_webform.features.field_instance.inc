<?php
/**
 * @file
 * df_tools_webform.features.field_instance.inc
 */

/**
 * Implements hook_field_default_field_instances().
 */
function df_tools_webform_field_default_field_instances() {
  $field_instances = array();

  // Exported field_instance: 'fieldable_panels_pane-web_form-field_inline_webform'
  $field_instances['fieldable_panels_pane-web_form-field_inline_webform'] = array(
    'bundle' => 'web_form',
    'default_value' => NULL,
    'default_value_function' => '',
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'hidden',
        'module' => 'entityreference',
        'settings' => array(
          'links' => 1,
          'quickedit' => array(
            'editor' => 'form',
          ),
          'view_mode' => 'full',
        ),
        'type' => 'entityreference_entity_view',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'fieldable_panels_pane',
    'field_name' => 'field_inline_webform',
    'label' => 'Webform',
    'required' => 0,
    'settings' => array(
      'behaviors' => array(
        'prepopulate' => array(
          'status' => 0,
        ),
      ),
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(
        'fields' => array(),
        'match_operator' => 'CONTAINS',
        'path' => '',
        'size' => 60,
        'type_settings' => array(
          'allow_existing' => FALSE,
          'delete_references' => 1,
          'label_plural' => 'webforms',
          'label_singular' => 'webform',
          'match_operator' => 'CONTAINS',
          'override_labels' => 1,
        ),
      ),
      'type' => 'options_select',
      'weight' => -4,
    ),
  );

  // Translatables
  // Included for use with string extractors like potx.
  t('Webform');

  return $field_instances;
}
