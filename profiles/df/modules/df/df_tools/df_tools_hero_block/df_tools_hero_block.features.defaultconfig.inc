<?php
/**
 * @file
 * df_tools_hero_block.features.defaultconfig.inc
 */

/**
 * Implements hook_defaultconfig_features().
 */
function df_tools_hero_block_defaultconfig_features() {
  return array(
    'df_tools_hero_block' => array(
      'field_default_fields' => 'field_default_fields',
      'field_group_info' => 'field_group_info',
      'strongarm' => 'strongarm',
    ),
  );
}

/**
 * Implements hook_defaultconfig_field_default_fields().
 */
function df_tools_hero_block_defaultconfig_field_default_fields() {
  $fields = array();

  // Exported field: 'bean-df_bean_hero-field_hero_button'.
  $fields['bean-df_bean_hero-field_hero_button'] = array(
    'field_config' => array(
      'active' => 1,
      'cardinality' => 1,
      'deleted' => 0,
      'entity_types' => array(),
      'field_name' => 'field_hero_button',
      'field_permissions' => array(
        'type' => 0,
      ),
      'foreign keys' => array(),
      'indexes' => array(),
      'locked' => 0,
      'module' => 'link',
      'settings' => array(
        'attributes' => array(
          'class' => '',
          'rel' => '',
          'target' => 'default',
        ),
        'display' => array(
          'url_cutoff' => 80,
        ),
        'enable_tokens' => 1,
        'personalize' => array(
          'agent_type' => 'personalize_target',
          'create_goal' => 1,
          'enabled' => 0,
          'goal_pages' => '',
        ),
        'title' => 'optional',
        'title_maxlength' => 128,
        'title_value' => '',
        'url' => 0,
      ),
      'translatable' => 0,
      'type' => 'link_field',
    ),
    'field_instance' => array(
      'bundle' => 'df_bean_hero',
      'default_value' => NULL,
      'deleted' => 0,
      'description' => '',
      'display' => array(
        'default' => array(
          'label' => 'hidden',
          'module' => 'link',
          'settings' => array(
            'quickedit' => array(
              'editor' => 'form',
            ),
          ),
          'type' => 'link_default',
          'weight' => 5,
        ),
      ),
      'entity_type' => 'bean',
      'field_name' => 'field_hero_button',
      'label' => 'Hero Button',
      'required' => 0,
      'settings' => array(
        'absolute_url' => 1,
        'attributes' => array(
          'class' => 'button radius small',
          'configurable_class' => 0,
          'configurable_title' => 0,
          'rel' => '',
          'target' => 'default',
          'title' => '',
        ),
        'display' => array(
          'url_cutoff' => 80,
        ),
        'enable_tokens' => 1,
        'linkit' => array(
          'button_text' => 'Search',
          'enable' => 0,
          'profile' => '',
        ),
        'rel_remove' => 'default',
        'title' => 'optional',
        'title_label_use_field_label' => 0,
        'title_maxlength' => 128,
        'title_value' => '',
        'url' => 0,
        'user_register_form' => FALSE,
        'validate_url' => 1,
      ),
      'widget' => array(
        'active' => 0,
        'module' => 'link',
        'settings' => array(),
        'type' => 'link_field',
        'weight' => 4,
      ),
    ),
  );

  // Exported field: 'bean-df_bean_hero-field_hero_headline_1'.
  $fields['bean-df_bean_hero-field_hero_headline_1'] = array(
    'field_config' => array(
      'active' => 1,
      'cardinality' => 1,
      'deleted' => 0,
      'entity_types' => array(),
      'field_name' => 'field_hero_headline_1',
      'field_permissions' => array(
        'type' => 0,
      ),
      'foreign keys' => array(
        'format' => array(
          'columns' => array(
            'format' => 'format',
          ),
          'table' => 'filter_format',
        ),
      ),
      'indexes' => array(
        'format' => array(
          0 => 'format',
        ),
      ),
      'locked' => 0,
      'module' => 'text',
      'settings' => array(
        'max_length' => 255,
        'personalize' => array(
          'agent_type' => 'personalize_target',
          'create_goal' => 1,
          'enabled' => 0,
          'goal_pages' => '',
        ),
      ),
      'translatable' => 0,
      'type' => 'text',
    ),
    'field_instance' => array(
      'bundle' => 'df_bean_hero',
      'default_value' => NULL,
      'deleted' => 0,
      'description' => '',
      'display' => array(
        'default' => array(
          'label' => 'hidden',
          'module' => 'text',
          'settings' => array(
            'quickedit' => array(
              'editor' => 'plain_text',
            ),
          ),
          'type' => 'text_default',
          'weight' => 3,
        ),
      ),
      'entity_type' => 'bean',
      'field_name' => 'field_hero_headline_1',
      'label' => 'Headline 1',
      'required' => 0,
      'settings' => array(
        'better_formats' => array(
          'allowed_formats' => array(
            'commerce_order_message' => 'commerce_order_message',
            'filtered_html' => 'filtered_html',
            'full_html' => 'full_html',
            'plain_text' => 'plain_text',
            'raw_html' => 'raw_html',
            'userbase' => 'userbase',
          ),
          'allowed_formats_toggle' => 0,
          'default_order_toggle' => 0,
          'default_order_wrapper' => array(
            'formats' => array(
              'commerce_order_message' => array(
                'weight' => 0,
              ),
              'filtered_html' => array(
                'weight' => -10,
              ),
              'full_html' => array(
                'weight' => -9,
              ),
              'plain_text' => array(
                'weight' => -8,
              ),
              'raw_html' => array(
                'weight' => -6,
              ),
              'userbase' => array(
                'weight' => -7,
              ),
            ),
          ),
        ),
        'linkit' => array(
          'button_text' => 'Search',
          'enable' => 0,
          'profile' => '',
        ),
        'text_processing' => 0,
        'user_register_form' => FALSE,
      ),
      'widget' => array(
        'active' => 1,
        'module' => 'text',
        'settings' => array(
          'size' => 60,
        ),
        'type' => 'text_textfield',
        'weight' => 2,
      ),
    ),
  );

  // Exported field: 'bean-df_bean_hero-field_hero_headline_2'.
  $fields['bean-df_bean_hero-field_hero_headline_2'] = array(
    'field_config' => array(
      'active' => 1,
      'cardinality' => 1,
      'deleted' => 0,
      'entity_types' => array(),
      'field_name' => 'field_hero_headline_2',
      'field_permissions' => array(
        'type' => 0,
      ),
      'foreign keys' => array(
        'format' => array(
          'columns' => array(
            'format' => 'format',
          ),
          'table' => 'filter_format',
        ),
      ),
      'indexes' => array(
        'format' => array(
          0 => 'format',
        ),
      ),
      'locked' => 0,
      'module' => 'text',
      'settings' => array(
        'max_length' => 255,
        'personalize' => array(
          'agent_type' => 'personalize_target',
          'create_goal' => 1,
          'enabled' => 0,
          'goal_pages' => '',
        ),
      ),
      'translatable' => 0,
      'type' => 'text',
    ),
    'field_instance' => array(
      'bundle' => 'df_bean_hero',
      'default_value' => NULL,
      'deleted' => 0,
      'description' => '',
      'display' => array(
        'default' => array(
          'label' => 'hidden',
          'module' => 'text',
          'settings' => array(
            'quickedit' => array(
              'editor' => 'plain_text',
            ),
          ),
          'type' => 'text_default',
          'weight' => 4,
        ),
      ),
      'entity_type' => 'bean',
      'field_name' => 'field_hero_headline_2',
      'label' => 'Headline 2',
      'required' => 0,
      'settings' => array(
        'better_formats' => array(
          'allowed_formats' => array(
            'commerce_order_message' => 'commerce_order_message',
            'filtered_html' => 'filtered_html',
            'full_html' => 'full_html',
            'plain_text' => 'plain_text',
            'raw_html' => 'raw_html',
            'userbase' => 'userbase',
          ),
          'allowed_formats_toggle' => 0,
          'default_order_toggle' => 0,
          'default_order_wrapper' => array(
            'formats' => array(
              'commerce_order_message' => array(
                'weight' => 0,
              ),
              'filtered_html' => array(
                'weight' => -10,
              ),
              'full_html' => array(
                'weight' => -9,
              ),
              'plain_text' => array(
                'weight' => -8,
              ),
              'raw_html' => array(
                'weight' => -6,
              ),
              'userbase' => array(
                'weight' => -7,
              ),
            ),
          ),
        ),
        'linkit' => array(
          'button_text' => 'Search',
          'enable' => 0,
          'profile' => '',
        ),
        'text_processing' => 0,
        'user_register_form' => FALSE,
      ),
      'widget' => array(
        'active' => 1,
        'module' => 'text',
        'settings' => array(
          'size' => 60,
        ),
        'type' => 'text_textfield',
        'weight' => 3,
      ),
    ),
  );

  // Exported field: 'bean-df_bean_hero-field_hero_image'.
  $fields['bean-df_bean_hero-field_hero_image'] = array(
    'field_config' => array(
      'active' => 1,
      'cardinality' => 1,
      'deleted' => 0,
      'entity_types' => array(),
      'field_name' => 'field_hero_image',
      'field_permissions' => array(
        'type' => 0,
      ),
      'foreign keys' => array(
        'fid' => array(
          'columns' => array(
            'fid' => 'fid',
          ),
          'table' => 'file_managed',
        ),
      ),
      'indexes' => array(
        'fid' => array(
          0 => 'fid',
        ),
      ),
      'locked' => 0,
      'module' => 'image',
      'settings' => array(
        'default_image' => 0,
        'personalize' => array(
          'agent_type' => 'personalize_target',
          'create_goal' => 1,
          'enabled' => 0,
          'goal_pages' => '',
        ),
        'uri_scheme' => 'public',
      ),
      'translatable' => 0,
      'type' => 'image',
    ),
    'field_instance' => array(
      'bundle' => 'df_bean_hero',
      'deleted' => 0,
      'description' => '',
      'display' => array(
        'default' => array(
          'label' => 'hidden',
          'module' => 'image',
          'settings' => array(
            'image_link' => '',
            'image_style' => '',
            'quickedit' => array(
              'editor' => 'form',
            ),
          ),
          'type' => 'image',
          'weight' => 0,
        ),
      ),
      'entity_type' => 'bean',
      'field_name' => 'field_hero_image',
      'label' => 'Hero Image',
      'required' => 0,
      'settings' => array(
        'alt_field' => 0,
        'default_image' => 0,
        'file_directory' => 'hero',
        'file_extensions' => 'png gif jpg jpeg',
        'max_filesize' => '',
        'max_resolution' => '',
        'min_resolution' => '',
        'title_field' => 0,
        'user_register_form' => FALSE,
      ),
      'widget' => array(
        'active' => 1,
        'module' => 'media',
        'settings' => array(
          'allowed_schemes' => array(
            'oembed' => 0,
            'public' => 'public',
          ),
          'allowed_types' => array(
            'audio' => 0,
            'document' => 0,
            'image' => 'image',
            'video' => 0,
          ),
          'browser_plugins' => array(
            'media_default--media_browser_1' => 'media_default--media_browser_1',
            'media_default--media_browser_my_files' => 0,
            'media_internet' => 'media_internet',
            'upload' => 'upload',
          ),
          'manualcrop_crop_info' => TRUE,
          'manualcrop_default_crop_area' => TRUE,
          'manualcrop_enable' => FALSE,
          'manualcrop_inline_crop' => FALSE,
          'manualcrop_instant_crop' => FALSE,
          'manualcrop_instant_preview' => TRUE,
          'manualcrop_keyboard' => TRUE,
          'manualcrop_maximize_default_crop_area' => FALSE,
          'manualcrop_require_cropping' => array(),
          'manualcrop_styles_list' => array(),
          'manualcrop_styles_mode' => 'include',
          'manualcrop_thumblist' => FALSE,
        ),
        'type' => 'media_generic',
        'weight' => 1,
      ),
    ),
  );

  // Translatables
  // Included for use with string extractors like potx.
  t('Headline 1');
  t('Headline 2');
  t('Hero Button');
  t('Hero Image');

  return $fields;
}

/**
 * Implements hook_defaultconfig_field_group_info().
 */
function df_tools_hero_block_defaultconfig_field_group_info() {
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

/**
 * Implements hook_defaultconfig_strongarm().
 */
function df_tools_hero_block_defaultconfig_strongarm() {
  $export = array();

  $strongarm = new stdClass();
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'field_bundle_settings_bean__df_bean_hero';
  $strongarm->value = array(
    'view_modes' => array(
      'default' => array(
        'custom_settings' => FALSE,
      ),
      'diff_standard' => array(
        'custom_settings' => FALSE,
      ),
      'token' => array(
        'custom_settings' => FALSE,
      ),
    ),
    'extra_fields' => array(
      'form' => array(
        'label' => array(
          'weight' => '0',
        ),
        'title' => array(
          'weight' => '5',
        ),
        'revision' => array(
          'weight' => '7',
        ),
        'view_mode' => array(
          'weight' => '6',
        ),
      ),
      'display' => array(
        'title' => array(
          'default' => array(
            'weight' => '2',
            'visible' => TRUE,
          ),
        ),
      ),
    ),
  );
  $export['field_bundle_settings_bean__df_bean_hero'] = $strongarm;

  return $export;
}
