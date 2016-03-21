<?php

/**
 * @file
 * Admin page callbacks for the df_tools_vertical_tabs module.
 */

/**
 * Administrative settings for the module add-ons.
 */
function df_tools_vertical_tabs_admin_form($form, &$form_state) {
  // Checkbox to toggle the position of the vertical tabs column by setting and unsetting the right column css
  // TODO form alter node-form and block-admin-configure-form to put this configure option right on the page so that the toggle can be done in-place!
  // TODO add the position of the column to the $user data as a per-user preference.
  $form['df_tools_vertical_tabs_vertical_tabs_toggle'] = array(
    '#type' => 'checkbox',
    '#title' => t('Display vertical tabs on the left'),
    '#description' => t('When checked (and when the viewport is greater than 960px) vertical tabs will appear on the left.'),
    '#default_value' => variable_get('df_tools_vertical_tabs_vertical_tabs_toggle', FALSE),
  );

  return system_settings_form($form);
}
