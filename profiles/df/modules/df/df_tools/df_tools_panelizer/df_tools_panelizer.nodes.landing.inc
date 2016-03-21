<?php

/**
 * @file
 *  Migrations for Landing Nodes.
 */

class DFLandingNodes extends ImportBaseNodes {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import Landing nodes.');

    // Our parent defines this, but since we have indeterminate csvcolumns "title" is no longer set, just "Title"
    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'Title' => array(
          'type' => 'varchar',
          'length' => 255,
          'not null' => TRUE,
        ),
      ),
      MigrateDestinationNode::getKeySchema()
    );

    // Create a MigrateSource object.
    if (isset($arguments['path'])) {
      $import_path = $arguments['path'];
    }
    else {
      $import_path = drupal_get_path('module', 'df_tools_panelizer') . '/import/df_tools_panelizer.nodes.landing.csv';
    }
    $this->source = new MigrateSourceCSV($import_path, array(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationNode('landing');

    $this->addFieldMapping('path', 'Path');
    $this->addFieldMapping('title', 'Title');
  }

  public function prepareRow($row) {
    // Check for columns that define region content
    foreach ($row as $key => $value) {
      // Set the value of this key to the exploded list of UUIDs
      if (strpos($key, 'region-') === 0) {
        $row->$key = explode(",", $value);
      }
    }
    return TRUE;
  }

  public function complete($entity, stdClass $row) {
    // Load the new node
    list($id) = entity_extract_ids('node', $entity);
    $node = node_load($id);

    // As each node is imported, add default Panels displays and Panels if necessary
    foreach ($row as $key => $value) {
      // Check if this is a region column and that there are UUIDs set
      if (strpos($key, 'region-') === 0 && !empty($value)) {
        // Parse out the region name
        $location = str_replace('region-', '', $key);

        // Grab the display from the new Landing node
        $display = $node->panelizer['page_manager']->display;

        // Loop through each UUID in this region and add a new pane for this node
        foreach ($value as $uuid) {
          $pane = panels_new_pane('fieldable_panels_pane', 'uuid:' . $uuid, TRUE);
          // Check to see if any classy panel styles are included for this pane
          if (array_key_exists($uuid . '-style', $row) && $settings = json_decode($row->{$uuid . '-style'}, TRUE)) {
            // Add our default settings
            $settings['classy_panel_styles_flag'] = 'classy-panel-styles pane';
            $pane->style = array(
              'style' => 'classy_panel_styles:cps_default',
              'settings' => $settings
            );
          }
          // Add the pane to the display
          $display->add_pane($pane, $location);
          // Save the display
          $display = panels_save_display($display);
        }

        // Mark the Node as modified so that Panelizer is aware of our changes
        $node->panelizer['page_manager']->display_is_modified = TRUE;
      }
      // Check to see if a display setting needs to be changed
      elseif (strpos($key, 'display-') === 0) {
        // Parse out the display setting name
        $setting = str_replace('display-', '', $key);

        // Change the value for this display setting
        $node->panelizer['page_manager']->display->$setting = $value;
        // Mark the Node as modified so that Panelizer is aware of our changes
        $node->panelizer['page_manager']->display_is_modified = TRUE;
        panels_save_display($node->panelizer['page_manager']->display);
      }
      // Check to see if a panelizer settings needs to be changed
      elseif (strpos($key, 'panelizer-') === 0) {
        // Parse out the panelizer setting name
        $setting = str_replace('panelizer-', '', $key);
        $node->panelizer['page_manager']->$setting = $value;
      }
    }

    // If we've made changes, save the node
    if ($node->panelizer['page_manager']->display_is_modified == TRUE) {
      node_save($node);
    }

  }

}
