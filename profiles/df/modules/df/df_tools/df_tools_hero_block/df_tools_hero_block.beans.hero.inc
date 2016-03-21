<?php

/**
 * @file
 *  Migrations for Block Entities.
 */

class DFHeroBeans extends Migration {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import Hero Blocks.');

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
      $import_path = drupal_get_path('module', 'df_tools_hero') . '/import/df_tools_hero.fpp.hero.csv';
    }
    $this->source = new MigrateSourceCSV($import_path, array(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationBean('df_bean_hero');

    $this->addFieldMapping('field_hero_image', 'Image');
    $this->addFieldMapping('field_hero_image:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_hero_image:source_dir')->defaultValue(dirname($import_path) . '/images');
    $this->addFieldMapping('field_hero_image:destination_file', 'filename');

    $this->addFieldMapping('field_hero_headline_1', 'Headline 1');
    $this->addFieldMapping('field_hero_headline_2', 'Headline 2');
    $this->addFieldMapping('field_hero_button', 'Button Link');
    $this->addFieldMapping('field_hero_button:title', 'Button Title');

    $this->addFieldMapping('label', 'Title');
    $this->addFieldMapping('uuid', 'UUID');
  }

}
