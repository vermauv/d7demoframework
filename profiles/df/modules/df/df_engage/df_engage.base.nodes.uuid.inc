<?php

/**
 * @file
 *  Migrations for Nodes with UUIDs.
 */

class DemoFrameworkBaseNodesUUID extends LightningModerationNodes {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import UUID nodes.');

    $import_path = drupal_get_path('module', 'df_engage') . '/import/';

    // Create a MigrateSource object.
    $this->source = new MigrateSourceCSV($import_path . 'df_engage.base.nodes.uuid.csv', $this->csvcolumns(), array('header_rows' => 1));

    $this->destination = new MigrateDestinationNode('page');

    $this->addFieldMapping('uuid', 'uuid');
  }

  function csvcolumns() {
    $columns[0] = array('title', 'Title');
    $columns[1] = array('body', 'Body');
    $columns[2] = array('uuid', 'UUID');
    return $columns;
  }

}

