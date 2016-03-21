<?php

/**
 * @file
 *  Migrations for Fieldable Panel Panes.
 */

class DFToolsCommerceProductFPP extends Migration {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import Commerce Product FPPs.');

    // Create a map object for tracking the relationships between source rows
    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'Title' => array(
          'type' => 'varchar',
          'length' => 255,
          'not null' => FALSE,
        )
      ),
      array(
        'title' => array(
          'type' => 'varchar',
          'length' => 255,
          'not null' => FALSE,
        )
      )
    );

    // Create a MigrateSource object.
    if (isset($arguments['path'])) {
      $import_path = $arguments['path'];
    }
    else {
      $import_path = drupal_get_path('module', 'df_tools_commerce_product') . '/import/df_tools_commerce.fpp.commerce_product.csv';
    }
    $this->source = new MigrateSourceCSV($import_path, array(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationFieldablePanelsPanes('commerce_product');

    $source_migration = isset($arguments['source_migration']) ? $arguments['source_migration'] : 'DemoFrameworkBaseCommerceNodes';
    $this->addFieldMapping('field_commerce_product_reference', 'Product')->separator(',')->sourceMigration($source_migration);;

    $this->addFieldMapping('title', 'Title');
    $this->addFieldMapping('category', 'Category')->defaultValue('Reusable panes');

    // Add optional mapping for UUID
    $this->addFieldMapping('uuid', 'UUID');

    $this->addFieldMapping('reusable', 'Reusable')->defaultValue(TRUE);
  }

}
