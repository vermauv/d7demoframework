<?php

/**
 * @file
 *  Migration for Site Section Taxonomy Terms in DF.
 */

class DemoFrameworkSiteSectionTerms extends ImportBaseTerms {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $import_path = drupal_get_path('module', 'df_engage') . '/import/';
    $this->source = new MigrateSourceCSV($import_path . 'df_engage.terms.site_section.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationTerm('site_section');
    $this->addFieldMapping('name', 'name');
  }

  function csvcolumns() {
    $columns[0] = array('name', 'Name');
    return $columns;
  }
}
