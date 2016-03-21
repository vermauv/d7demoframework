<?php
/**
 * @file
 * Classy Panel Styles API include file.
 */

/**
 * Implements hook_classy_panel_styles().
 *
 * Provides a set of example Classy Panel Styles definitions.
 */
function df_tools_styles_classy_panel_styles() {
  $export = array();

  $options = array(
    'hide-pane-title' => 'Hidden',
    'show-pane-title' => 'Visible',
  );
  $name = 'df_tools_styles_hide_title';
  $title = 'Title visibility';
  $description = 'Toggle to show/hide pane title.';
  $style = df_tools_styles_create_style($name, $title, $description, $options, 'show-pane-title');
  $export[$name] = $style;

  $options = array(
    'text-align-left' => 'Left',
    'text-align-center' => 'Center',
    'text-align-right' => 'Right',
  );
  $name = 'df_tools_styles_text_align';
  $title = 'Text alignment';
  $description = 'Determines how text should be aligned within the pane.';
  $style = df_tools_styles_create_style($name, $title, $description, $options);
  $export[$name] = $style;

  $options = array(
    'pane-align-left' => 'Left',
    'pane-align-center' => 'Centered',
    'pane-align-right' => 'Right',
  );
  $name = 'df_tools_styles_centered';
  $title = 'Pane alignment';
  $description = 'Determines if a pane should be centered.';
  $style = df_tools_styles_create_style($name, $title, $description, $options);
  $export[$name] = $style;

  $options = array(
    'pane-width-25' => '25%',
    'pane-width-50' => '50%',
    'pane-width-75' => '75%',
    'pane-width-100' => '100%',
  );
  $name = 'df_tools_styles_width';
  $title = 'Pane width';
  $description = 'Changes the percentage width of a pane.';
  $style = df_tools_styles_create_style($name, $title, $description, $options);
  $export[$name] = $style;

  $options = array(
    'pane-background-white' => 'White',
    'pane-background-black' => 'Black',
    'pane-background-lightgray' => 'Light Gray',
  );
  $name = 'df_tools_styles_background';
  $title = 'Background color';
  $description = 'Sets a default background color for a pane.';
  $style = df_tools_styles_create_style($name, $title, $description, $options);
  $export[$name] = $style;

  $options = array(
    'pane-image-gradient-white-ltr' => 'White, Left to Right',
    'pane-image-gradient-white-rtl' => 'White, Right to Left',
    'pane-image-gradient-black-rtl' => 'Black, Right to Left',
    'pane-image-gradient-black-ltr' => 'Black, Left to Right',
  );
  $name = 'df_tools_styles_image_gradient';
  $title = 'Image gradient';
  $description = 'Adds a gradient background color to images within a pane. Only supported by panes that have explicit CSS support.';
  $style = df_tools_styles_create_style($name, $title, $description, $options);
  $export[$name] = $style;

  $options = array(
    'pane-hide-phone' => 'Phone',
    'pane-hide-phone-xl' => 'Large phone',
    'pane-hide-tablet' => 'Tablet',
  );
  $name = 'df_tools_styles_mobile';
  $title = 'Hide for device';
  $description = 'Hides the pane for a specific mobile device (and all smaller devices).';
  $style = df_tools_styles_create_style($name, $title, $description, $options);
  $export[$name] = $style;

  return $export;
}

/**
 * Helper function to assist in style creation
 *
 * @param string $name A machine name
 * @param string $title A human readable title
 * @param string $description A description
 * @param array $options An associative array of options in the format $css_class => $label
 * @param string $default_value The default css class to use for this style
 * @return stdClass The new style
 */
function df_tools_styles_create_style($name, $title, $description, $options, $default_value = '') {
  $style = new stdClass();
  $style->disabled = FALSE; /* Edit this to true to make a default style disabled initially */
  $style->api_version = 1;
  $style->name = 'df_tools_styles_' . $name;
  $style->visibility = 1;
  $style->groups = serialize(array('df_tools_styles'));
  $style->title = $title;
  $style->required = FALSE;
  $style->description = $description;
  $style->options = serialize($options);
  $style->default_value = $default_value;
  $style->layouts_setting = 0;
  $style->layouts = serialize(array());
  return $style;
}
