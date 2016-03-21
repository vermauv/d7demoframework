<?php

/**
 * @file
 *  Migrations for Collection Nodes.
 */

class DFSMEDCollectionNodes extends DemoFrameworkBaseNodesUUID {
  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import nodes.');
    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'uuid' => array(
          'type' => 'char',
          'length' => 36,
          'not null' => FALSE,
        ),
      ),
      MigrateDestinationNode::getKeySchema()
    );
    $import_path = drupal_get_path('module', 'dfs_med') . '/import/';
    // Create a MigrateSource object.
    $this->source = new MigrateSourceCSV($import_path . 'dfs_med.nodes.collection.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationNode('episodic_collection');
    // Created
    $this->addFieldMapping('created', 'created')->defaultValue(strtotime("now"));
    // Splash Image
    $this->addFieldMapping('field_splash_image', 'splash');
    $this->addFieldMapping('field_splash_image:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_splash_image:source_dir')->defaultValue($import_path . 'images');
    $this->addFieldMapping('field_splash_image:destination_file', 'filename');
    // Associated Product
    $this->addFieldMapping('field_commerce_product', 'commerce')->sourceMigration('DFSMEDCommerceNodes');
    // Brand
    $this->addFieldMapping('field_brand', 'brand')->sourceMigration('DFSMEDBrandNodes');
    // Collected Episodes
    $this->addFieldMapping('field_collected', 'episodes')->separator(',')->sourceMigration('DFSMEDEpisodeNodes');
    // Featured
    $this->addfieldmapping('field_featured', 'featured');
    // Featured Image
    $this->addFieldMapping('field_featured_image', 'image');
    $this->addFieldMapping('field_featured_image:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_featured_image:source_dir')->defaultValue($import_path . 'images');
    $this->addFieldMapping('field_featured_image:destination_file', 'filename');
    // Persona
    $this->addFieldMapping('field_persona', 'persona');
    // Site Section
    $this->addFieldMapping('field_site_section', 'site_section')->defaultValue("Content");
  }

  function csvcolumns() {
    $columns[0] = array('uuid', 'UUID');
    $columns[1] = array('title', 'Title');
    $columns[2] = array('brand', 'Brand');
    $columns[3] = array('splash', 'Splash');
    $columns[4] = array('commerce', 'Commerce');
    $columns[5] = array('body', 'Synopsis');
    $columns[6] = array('featured', 'Featured');
    $columns[7] = array('image', 'Image');
    $columns[8] = array('episodes', 'Episodes');
    $columns[9] = array('persona', 'Persona');
    return $columns;
  }

}

