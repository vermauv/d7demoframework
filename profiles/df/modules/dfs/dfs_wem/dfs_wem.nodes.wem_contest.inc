<?php

/**
 * @file
 *  Migrations for WEM Contest Nodes.
 */

class DFSWEMContestNodes extends DemoFrameworkBaseNodesUUID {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import nodes.');
    $import_path = drupal_get_path('module', 'dfs_wem') . '/import/';
    // Create a MigrateSource object.
    $this->source = new MigrateSourceCSV($import_path . 'dfs_wem.nodes.wem_contest.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationNode('wem_contest');
    // Image
    $this->addFieldMapping('field_contest_image', 'image');
    $this->addFieldMapping('field_contest_image:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_contest_image:source_dir')->defaultValue($import_path . 'images');
    $this->addFieldMapping('field_contest_image:destination_file', 'filename');
    // Taxonomy
    $this->addFieldMapping('field_contest_interests', 'interests');
    // Persona
    $this->addFieldMapping('field_persona', 'persona');
    // Site Section
    $this->addFieldMapping('field_site_section', 'site_section')->defaultValue("Community");
  }

  function csvcolumns() {
    $columns[0] = array('title', 'Title');
    $columns[1] = array('body', 'Body');
    $columns[2] = array('image', 'Image');
    $columns[3] = array('interests', 'Interests');
    $columns[4] = array('uuid', 'UUID');
    $columns[5] = array('created', 'Created');
    $columns[6] = array('persona', 'Persona');
    return $columns;
  }

  function prepareRow($row) {
    $row->interests = explode(", ", $row->interests);
    return TRUE;
  }

}

