<?php

/**
 * @file
 *  Migrations for Episode Nodes.
 */

class DFSMEDEpisodeNodes extends DemoFrameworkBaseNodesUUID {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import nodes.');

    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'uuid' => array(
          'type' => 'char',
          'length' => 36,
          'not null' => FALSE,
        ),
      ),
      MigrateDestinationNode::getKeySchema()
    );

    $import_path = drupal_get_path('module', 'dfs_med') . '/import/';

    // Create a MigrateSource object.
    $this->source = new MigrateSourceCSV($import_path . 'dfs_med.nodes.episode.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationNode('episode');

    // Created
    $this->addFieldMapping('created', 'created')->defaultValue(strtotime("now"));

    // Splash Image
    $this->addFieldMapping('field_splash_image', 'splash');
    $this->addFieldMapping('field_splash_image:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_splash_image:source_dir')->defaultValue($import_path . 'images');
    $this->addFieldMapping('field_splash_image:destination_file', 'filename');

    // Metadata
    $this->addfieldmapping('field_author', 'author');
    $this->addfieldmapping('field_length', 'length');
    $this->addfieldmapping('field_guidance', 'guidance');

    // Text
    $this->addFieldMapping('field_quote', 'quote');
    $this->addFieldMapping('field_quote:format')->defaultValue('filtered_html');
    $this->addFieldMapping('field_quote_by', 'quote_by');
    $this->addFieldMapping('field_supplemental', 'supplemental');
    $this->addFieldMapping('field_supplemental:format')->defaultValue('filtered_html');

    // Video
    $this->addFieldMapping('field_video', 'video')->sourceMigration('DFSMEDEpisodeVideo');
    $this->addFieldMapping('field_video:file_class')->defaultValue('MigrateFileFid');

  }

  function csvcolumns() {
    $columns[0] = array('uuid', 'UUID');
    $columns[1] = array('title', 'Title');
    $columns[2] = array('splash', 'Image');
    $columns[3] = array('body', 'Synopsis');
    $columns[4] = array('author', 'Author');
    $columns[5] = array('length', 'Duration');
    $columns[6] = array('guidance', 'Guidance');
    $columns[7] = array('quote', 'Quote');
    $columns[8] = array('quote_by', 'Cited');
    $columns[9] = array('supplemental', 'Supplemental');
    $columns[10] = array('video', 'Video');
    return $columns;
  }

}

class DFSMEDEpisodeVideo extends Migration {
  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'video' => array(
          'type' => 'varchar',
          'length' => 255,
          'not null' => TRUE,
        ),
      ),
      MigrateDestinationFile::getKeySchema()
    );
    $this->destination = new MigrateDestinationFile('video', 'MigrateExtrasFileYoutube');
    $import_path = drupal_get_path('module', 'dfs_med') . '/import/';
    $this->source = new MigrateSourceCSV($import_path . 'dfs_med.nodes.episode.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->addFieldMapping('value', 'video');
   }

  function csvcolumns() {
    $columns[10] = array('video', 'Video');
    return $columns;
  }

}
