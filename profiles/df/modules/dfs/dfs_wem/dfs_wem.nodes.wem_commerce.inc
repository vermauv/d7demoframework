<?php

/**
 * @file
 *  Migrations for WEM Commerce Product Nodes.
 */

class DFSWEMCommerceNodes extends DemoFrameworkBaseCommerceNodes {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import WEM Commerce product nodes.');
    $this->dependencies = array('DFSWEMProducts');
    $import_path = drupal_get_path('module', 'dfs_wem') . '/import/';
    $this->source = new MigrateSourceCSV($import_path . 'dfs_wem.nodes.wem_commerce.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationNode('wem_commerce');
    // Commerce
    $this->addFieldMapping('field_wem_product_ref', 'skus');
    $this->addFieldMapping('field_wem_com_rel_interests', 'interests');
    // UUID
    $this->addFieldMapping('uuid', 'uuid');
    // Persona
    $this->addFieldMapping('field_persona', 'persona');
    // Site Section
    $this->addFieldMapping('field_site_section', 'site_section')->defaultValue("Commerce");
  }

  function csvcolumns() {
    $columns[0] = array('title', 'Title');
    $columns[1] = array('description', 'Description');
    $columns[2] = array('sku', 'SKU');
    $columns[3] = array('interests', 'Interests');
    $columns[4] = array('uuid', 'UUID');
    $columns[5] = array('created', 'Created');
    $columns[6] = array('persona', 'Persona');
    return $columns;
  }

  function prepareRow($row) {
    $products = array();
    foreach (explode(', ', $row->sku) as $sku) {
      $product = commerce_product_load_by_sku($sku);
      $products[] = $product->product_id;
    }
    $row->skus = $products;
    $row->interests = explode(", ", $row->interests);
    return TRUE;
  }

}

