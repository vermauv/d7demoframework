<?php

/**
 * @file
 *  Migrations for Basic Nodes' Translations.
 */

class DemoFrameworkBaseNodesTranslations extends Migration {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import node translations.');

    // Create a map object for tracking the relationships between source rows
    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'translated_title' => array(
          'type' => 'varchar',
          'length' => 255,
          'not null' => TRUE,
        ),
      ),
      MigrateDestinationNode::getKeySchema()
    );

    $import_path = drupal_get_path('module', 'df_translate') . '/import/';

    // Create a MigrateSource object.
    $this->source = new MigrateSourceCSV($import_path . 'df_translate.base.nodes.translations.csv', $this->csvcolumns(), array('header_rows' => 1));

    $this->destination = new MigrateDestinationNode('page');

    $this->addFieldMapping('uid', 'uid')->defaultValue(1);
    $this->addFieldMapping('status', 'status')->defaultValue(1);
    $this->addFieldMapping('language', 'language');
    $this->addFieldMapping('title', 'translated_title');
    $this->addFieldMapping('body', 'body');
    $this->addFieldMapping('body:format')->defaultValue('full_html');
    $this->addFieldMapping('tnid', 'title')->sourceMigration('ImportBaseNodes');
  }

  function csvcolumns() {
    $columns[0] = array('title', 'Title');
    $columns[1] = array('language', 'Language');
    $columns[2] = array('translated_title', 'Translated Title');
    $columns[3] = array('body', 'Body');
    return $columns;
  }

  function prepare(&$node, $row) {
    if (isset($node->tnid) && ($source = node_load($node->tnid))) {
      $node->translation_source = $source;
    }
  }
}
