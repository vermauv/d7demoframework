<?php

/**
 * @file
 *  Base Migrations for Commerce Products used in DF.
 */

class DemoFrameworkBaseProducts extends Migration {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import products.');

    // Create a map object for tracking the relationships between source rows
    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'sku' => array(
          'type' => 'varchar',
          'length' => 32,
          'not null' => TRUE,
        ),
      ),
      MigrateDestinationEntityAPI::getKeySchema('commerce_product', 'product')
    );

    $this->destination = new MigrateDestinationEntityAPI('commerce_product', 'product');

    // Define a default import path.
    $import_path = drupal_get_path('module', 'df_commerce') . '/import/';
    
    // Create a MigrateSource object.
    $this->source = new MigrateSourceCSV($import_path . 'df_commerce.base.products.csv', $this->csvcolumns(), array('header_rows' => 1));

    $this->addFieldMapping('title', 'title');
    $this->addFieldMapping('sku', 'sku');
    $this->addFieldMapping('commerce_price', 'commerce_price');

    // Images
    $this->addFieldMapping('field_images', 'images');
    $this->addFieldMapping('field_images:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_images:source_dir')->defaultValue($import_path . 'images');
    $this->addFieldMapping('field_images:destination_file', 'filename');

    $this->addFieldMapping('uid', 'uid');
    $this->addFieldMapping('language', 'language');
    $this->addFieldMapping('status', 'status');
  }

  function csvcolumns() {
    $columns[0] = array('title', 'Title');
    $columns[1] = array('sku', 'SKU');
    $columns[2] = array('commerce_price', 'Price');
    $columns[3] = array('images', 'Images');
    return $columns;
  }

  function prepareRow($row) {
    $row->images = explode(', ', $row->images);
    $row->uid = 1;
    $row->language = LANGUAGE_NONE;
    $row->status = 1;
    return TRUE;
  }

}

