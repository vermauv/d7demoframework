<?php

/**
 * @file
 *  Migration for Persona Taxonomy Terms in DFS MED.
 */

class DFSMEDPersonaTerms extends ImportBaseTerms {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $import_path = drupal_get_path('module', 'dfs_med') . '/import/';
    $this->source = new MigrateSourceCSV($import_path . 'dfs_med.terms.persona.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationTerm('persona');
    $this->addFieldMapping('name', 'name');
  }

  function csvcolumns() {
    $columns[0] = array('name', 'Name');
    return $columns;
  }
}
