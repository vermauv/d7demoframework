<?php

/**
 * @file
 *  Migrations for Slideshow Nodes.
 */

class DFSMEDSlideshowNodes extends DemoFrameworkBaseNodesUUID {
  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import nodes.');
    $import_path = drupal_get_path('module', 'dfs_med') . '/import/';
    // Create a MigrateSource object.
    $this->source = new MigrateSourceCSV($import_path . 'dfs_med.nodes.slideshow.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationNode('slideshow_slide');
    // Created
    $this->addFieldMapping('created', 'created')->defaultValue(strtotime("now"));
    // Main Image
    $this->addFieldMapping('field_main_image', 'image');
    $this->addFieldMapping('field_main_image:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_main_image:source_dir')->defaultValue($import_path . 'images');
    $this->addFieldMapping('field_main_image:destination_file', 'filename');
    // Link
    $this->addfieldmapping('field_link', 'link');
    $this->addfieldmapping('field_link:title', 'link_title');
    // Persona
    $this->addFieldMapping('field_persona', 'persona');
    // Site Section
    $this->addFieldMapping('field_site_section', 'site_section')->defaultValue("Content");
  }

  function csvcolumns() {
    $columns[0] = array('uuid', 'UUID');
    $columns[1] = array('title', 'Title');
    $columns[2] = array('body', 'Body');
    $columns[3] = array('image', 'Image');
    $columns[4] = array('link', 'Link');
    $columns[5] = array('link_title', 'Link Title');
    $columns[6] = array('persona', 'Persona');
    return $columns;
  }

}

