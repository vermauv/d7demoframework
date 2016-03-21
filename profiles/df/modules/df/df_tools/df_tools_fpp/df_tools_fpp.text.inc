<?php

/**
 * @file
 *  Migrations for Fieldable Panel Panes.
 */

class DFTextFPP extends Migration {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import Text FPPs.');

    // Create a map object for tracking the relationships between source rows
    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'UUID' => array(
          'type' => 'varchar',
          'length' => 36,
          'not null' => FALSE,
          'description' => 'The Universally Unique Identifier.',
        )
      ),
      array(
        'uuid' => array(
          'type' => 'varchar',
          'length' => 36,
          'not null' => FALSE,
          'description' => 'The Universally Unique Identifier.',
        )
      )
    );

    // Create a MigrateSource object.
    if (isset($arguments['path'])) {
      $import_path = $arguments['path'];
    }
    else {
      $import_path = drupal_get_path('module', 'df_tools_fpp') . '/import/df_tools_fpp.text.csv';
    }
    $this->source = new MigrateSourceCSV($import_path, array(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationFieldablePanelsPanes('text', array('text_format' => 'full_html'));

    $this->addFieldMapping('field_basic_text_text', 'HTML');
    $this->addFieldMapping('title', 'Title');
    $this->addFieldMapping('uuid', 'UUID');
    $this->addFieldMapping('category', 'Category')->defaultValue('Add text');
  }

}
