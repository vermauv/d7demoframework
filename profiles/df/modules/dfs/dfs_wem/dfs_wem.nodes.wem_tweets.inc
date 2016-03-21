<?php

/**
 * @file
 *  Migrations for WEM Tweet Nodes.
 */

class DFSWEMTweetNodes extends DemoFrameworkBaseNodesUUID {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import nodes.');

    // Create a map object for tracking the relationships between source rows
    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'tweet_id' => array(
          'type' => 'varchar',
          'length' => 255,
          'not null' => TRUE,
        ),
      ),
      MigrateDestinationNode::getKeySchema()
    );

    $import_path = drupal_get_path('module', 'dfs_wem') . '/import/';

    // Create a MigrateSource object.
    $this->source = new MigrateSourceCSV($import_path . 'dfs_wem.nodes.wem_tweets.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationNode('wem_tweet');

    // Tweet Fields
    $this->addFieldMapping('title', 'tweet_id');
    $this->addFieldMapping('body', 'tweet');
    $this->addFieldMapping('field_wem_tweet_id', 'tweet_id');
    $this->addFieldMapping('field_wem_tweet_from', 'tweet_from');

  }

  function csvcolumns() {
    $columns[0] = array('tweet', 'Tweet');
    $columns[1] = array('tweet_id', 'ID');
    $columns[2] = array('tweet_from', 'From');
    $columns[3] = array('uuid', 'UUID');
    return $columns;
  }

}

