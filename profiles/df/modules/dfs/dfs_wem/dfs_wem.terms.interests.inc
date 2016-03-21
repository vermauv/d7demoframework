<?php

/**
 * @file
 *  Migration for Interests Taxonomy Terms in DFS WEM.
 */

class DFSWEMInterestsTerms extends ImportBaseTerms {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $import_path = drupal_get_path('module', 'dfs_wem') . '/import/';
    $this->source = new MigrateSourceCSV($import_path . 'dfs_wem.terms.interests.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationTerm('interests');
    $this->addFieldMapping('name', 'name');
  }

  function csvcolumns() {
    $columns[0] = array('name', 'Name');
    return $columns;
  }
}
