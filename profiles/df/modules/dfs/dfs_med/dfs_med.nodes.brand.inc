<?php

/**
 * @file
 *  Migrations for Brand Nodes.
 */

class DFSMEDBrandNodes extends DemoFrameworkBaseNodesUUID {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import nodes.');
    $import_path = drupal_get_path('module', 'dfs_med') . '/import/';
    // Create a MigrateSource object.
    $this->source = new MigrateSourceCSV($import_path . 'dfs_med.nodes.brand.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationNode('brand');
    // Created
    $this->addFieldMapping('created', 'created')->defaultValue(strtotime("now"));
    // Logo Image
    $this->addFieldMapping('field_logo', 'logo');
    $this->addFieldMapping('field_logo:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_logo:source_dir')->defaultValue($import_path . 'images');
    $this->addFieldMapping('field_logo:destination_file', 'filename');
    // Splash Image
    $this->addFieldMapping('field_splash_image', 'splash');
    $this->addFieldMapping('field_splash_image:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_splash_image:source_dir')->defaultValue($import_path . 'images');
    $this->addFieldMapping('field_splash_image:destination_file', 'filename');
    // Superbrand Link Image
    $this->addfieldmapping('field_link_image', 'link_image');
    $this->addfieldmapping('field_link_image:file_replace')->defaultvalue(FILE_EXISTS_REPLACE);
    $this->addfieldmapping('field_link_image:source_dir')->defaultvalue($import_path . 'images');
    $this->addfieldmapping('field_link_image:destination_file', 'filename');
    // Superbrand Link Image
    $this->addfieldmapping('field_link_image_hover', 'link_image_hover');
    $this->addfieldmapping('field_link_image_hover:file_replace')->defaultvalue(FILE_EXISTS_REPLACE);
    $this->addfieldmapping('field_link_image_hover:source_dir')->defaultvalue($import_path . 'images');
    $this->addfieldmapping('field_link_image_hover:destination_file', 'filename');
    // Booleans
    $this->addfieldmapping('field_superbrand', 'superbrand');
    $this->addfieldmapping('field_greylist', 'greylist');
    // Persona
    $this->addFieldMapping('field_persona', 'persona');
    // Site Section
    $this->addFieldMapping('field_site_section', 'site_section')->defaultValue("Content");
  }

  function csvcolumns() {
    $columns[0] = array('uuid', 'UUID');
    $columns[1] = array('title', 'Title');
    $columns[2] = array('body', 'Body');
    $columns[3] = array('logo', 'Logo');
    $columns[4] = array('splash', 'Splash');
    $columns[5] = array('link_image', 'Link Image');
    $columns[6] = array('link_image_hover', 'Link Hover');
    $columns[7] = array('superbrand', 'Superbrand');
    $columns[8] = array('greylist', 'Greylist');
    $columns[9] = array('persona', 'Persona');
    return $columns;
  }

}

