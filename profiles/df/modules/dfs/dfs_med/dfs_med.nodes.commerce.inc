<?php

/**
 * @file
 *  Migrations for Commerce Product Nodes.
 */

class DFSMEDCommerceNodes extends DemoFrameworkBaseCommerceNodes {
  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import Commerce Product nodes.');
    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'sku' => array(
          'type' => 'varchar',
          'length' => 32,
          'not null' => TRUE,
        ),
      ),
      MigrateDestinationNode::getKeySchema()
    );
    $this->dependencies = array('DFSMEDProducts');
    $import_path = drupal_get_path('module', 'dfs_med') . '/import/';
    $this->source = new MigrateSourceCSV($import_path . 'dfs_med.nodes.commerce.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationNode('commerce');
    // Created
    $this->addFieldMapping('created', 'created')->defaultValue(strtotime("now"));
    // Brand
    $this->addFieldMapping('field_brand', 'brand')->sourceMigration('DFSMEDBrandNodes');
    // Commerce
    $this->addFieldMapping('field_product', 'skus');
    // Feature Image
    $this->addFieldMapping('field_product_image', 'image');
    $this->addFieldMapping('field_product_image:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_product_image:source_dir')->defaultValue($import_path . 'images');
    $this->addFieldMapping('field_product_image:destination_file', 'filename');
    // Booleans
    $this->addfieldmapping('field_featured', 'featured');
    $this->addfieldmapping('field_bestseller', 'bestseller');
    // Persona
    $this->addFieldMapping('field_persona', 'persona');
    // Site Section
    $this->addFieldMapping('field_site_section', 'site_section')->defaultValue("Commerce");
  }

  function csvcolumns() {
    $columns[0] = array('title', 'Title');
    $columns[1] = array('brand', 'Brand');
    $columns[2] = array('sku', 'SKU');
    $columns[3] = array('image', 'Image');
    $columns[4] = array('featured', 'Featured');
    $columns[5] = array('bestseller', 'Bestseller');
    $columns[7] = array('persona', 'Persona');
    return $columns;
  }

  function prepareRow($row) {
    $products = array();
    foreach (explode(', ', $row->sku) as $sku) {
      $product = commerce_product_load_by_sku($sku);
      $products[] = $product->product_id;
    }
    $row->skus = $products;
  }

}

class DFSMEDProducts extends DemoFrameworkBaseProducts {
  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import Commerce products.');
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
    $import_path = drupal_get_path('module', 'dfs_med') . '/import/';
    // Create a MigrateSource object.
    $this->source = new MigrateSourceCSV($import_path . 'dfs_med.nodes.commerce.csv', $this->csvcolumns(), array('header_rows' => 1));
  }

  function csvcolumns() {
    $columns[0] = array('title', 'Title');
    $columns[2] = array('sku', 'SKU');
    $columns[6] = array('commerce_price', 'Price');
    return $columns;
  }

}
