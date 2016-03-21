<?php

/**
 * @file
 *  Migration for Commerce Products used in DFS WEM.
 */

class DFSWEMProducts extends DemoFrameworkBaseProducts {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import DFS WEM products.');

    // Create a map object for tracking the relationships between source rows
    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'sku' => array(
          'type' => 'varchar',
          'length' => 32,
          'not null' => TRUE,
        ),
      ),
      MigrateDestinationEntityAPI::getKeySchema('commerce_product', 'wem_product')
    );

    $this->destination = new MigrateDestinationEntityAPI('commerce_product', 'wem_product');

    // Define a default import path.
    $import_path = drupal_get_path('module', 'dfs_wem') . '/import/';

    // Create a MigrateSource object.
    $this->source = new MigrateSourceCSV($import_path . 'dfs_wem.products.csv', $this->csvcolumns(), array('header_rows' => 1));

    $this->addFieldMapping('field_images:source_dir')->defaultValue($import_path . 'images');

    $this->addFieldMapping('field_wem_product_interests', 'interests');

  }

  function csvcolumns() {
    $columns[0] = array('title', 'Title');
    $columns[1] = array('sku', 'SKU');
    $columns[2] = array('commerce_price', 'Price');
    $columns[3] = array('images', 'Images');
    $columns[4] = array('interests', 'Interests');
    return $columns;
  }

  function prepareRow($row) {
    $row->images = explode(', ', $row->images);
    $row->uid = 1;
    $row->language = LANGUAGE_NONE;
    $row->status = 1;
    $row->interests = explode(", ", $row->interests);
    return TRUE;
  }

}
