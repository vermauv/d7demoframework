<?php

/**
 * @file
 *  Migrations for Series Nodes.
 */

class DFSMEDSeriesNodes extends DemoFrameworkBaseNodesUUID {
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
    $this->source = new MigrateSourceCSV($import_path . 'dfs_med.nodes.series.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationNode('series');
    // Created
    $this->addFieldMapping('created', 'created')->defaultValue(strtotime("now"));
    // Brand
    $this->addFieldMapping('field_brand', 'brand')->sourceMigration('DFSMEDBrandNodes');
    // Associated Product
    $this->addFieldMapping('field_commerce_product', 'commerce')->sourceMigration('DFSMEDCommerceNodes');
    // Year
    $this->addfieldmapping('field_year', 'year');
    // Splash Image
    $this->addFieldMapping('field_splash_image', 'splash');
    $this->addFieldMapping('field_splash_image:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_splash_image:source_dir')->defaultValue($import_path . 'images');
    $this->addFieldMapping('field_splash_image:destination_file', 'filename');
    // Series Episodes
    $this->addFieldMapping('field_series_episodes', 'episodes')->separator(',')->sourceMigration('DFSMEDEpisodeNodes');
    // Persona
    $this->addFieldMapping('field_persona', 'persona');
    // Site Section
    $this->addFieldMapping('field_site_section', 'site_section')->defaultValue("Content");
  }

  function csvcolumns() {
    $columns[0] = array('uuid', 'UUID');
    $columns[1] = array('title', 'Title');
    $columns[2] = array('brand', 'Brand');
    $columns[3] = array('commerce', 'Commerce');
    $columns[4] = array('year', 'Year');
    $columns[5] = array('splash', 'Splash');
    $columns[6] = array('body', 'Body');
    $columns[7] = array('episodes', 'Episodes');
    $columns[8] = array('persona', 'Persona');
    return $columns;
  }

}

