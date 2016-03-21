<?php

/**
 *  @file
 *   Contains Base Group Membership Migration
 */

class DemoFrameworkBaseGroups extends Migration {
  public function __construct($arguments) {
    parent::__construct($arguments);

    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'key' => array(
          'type' => 'varchar',
          'length' => 255,
          'not null' => TRUE,
        ),
      ),
      MigrateDestinationOGMembership::getKeySchema()
    );
    
    $this->dependencies = array('DemoFrameworkBaseNodesGroup', 'ImportBaseUsers');

    $import_path = drupal_get_path('module', 'df_tools_og') . '/import/';
    $this->source = new MigrateSourceCSV($import_path . 'df_tools_og.base.groups.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationOGMembership();

    // Group
    $this->addFieldMapping('group_type')->defaultValue('node');
    $this->addFieldMapping('gid', 'group')->sourceMigration('DemoFrameworkBaseNodesGroup');
    // User 
    $this->addFieldMapping('entity_type')->defaultValue('user');
    $this->addFieldMapping('etid', 'user')->sourceMigration('ImportBaseUsers');
    // Membership
    $this->addFieldMapping('state')->defaultValue(OG_STATE_ACTIVE);
    $this->addFieldMapping('is_admin')->defaultValue(0);
  }

  function csvcolumns() {
    $columns[0] = array('group', 'Group');
    $columns[1] = array('user', 'User');
    $columns[2] = array('key', 'Key');
    return $columns;
  }

}
