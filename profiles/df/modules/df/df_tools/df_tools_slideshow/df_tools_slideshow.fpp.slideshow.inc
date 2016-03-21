<?php

/**
 * @file
 *  Migrations for Fieldable Panel Panes.
 */

class DFSlideshowFPP extends Migration {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import Slideshow FPPs.');

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
      $import_path = drupal_get_path('module', 'df_tools_slideshow') . '/import/df_tools_slideshow.fpp.slideshow.csv';
    }
    $this->source = new MigrateSourceCSV($import_path, array(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationFieldablePanelsPanes('slideshow', array('text_format' => 'raw_html'));

    $this->addFieldMapping('field_media', 'media_formatted');
    $this->addFieldMapping('field_media:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_media:source_dir')->defaultValue(dirname($import_path) . '/images');
    $this->addFieldMapping('field_media:destination_file', 'filename');

    $this->addFieldMapping('field_title', 'title_formatted');
    $this->addFieldMapping('field_body', 'body_formatted');

    $this->addFieldMapping('title', 'Title');
    $this->addFieldMapping('uuid', 'UUID');
    $this->addFieldMapping('category', 'Category')->defaultValue('Reusable panes');

    $this->addFieldMapping('reusable', 'Reusable')->defaultValue(TRUE);
  }

  public function prepareRow($row) {
    $row->media_formatted = array();
    $row->title_formatted = array();
    $row->body_formatted = array();
    foreach ($row as $column => $value) {
      // Check to see if this is a slide field column
      if (strpos($column, 'Slide ') === 0) {
        // Slide columns are in the format "Slide <index> <Field>"
        $column = explode(' ', $column);
        $row->{strtolower($column[2]) . '_formatted'}[$column[1]] = $value;
      }
    }
    return TRUE;
  }

}
