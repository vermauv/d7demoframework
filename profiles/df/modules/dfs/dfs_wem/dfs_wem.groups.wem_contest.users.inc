<?php

/**
 *  @file
 *   Contains group migration class for DFS WEM Contests
 */

class DFSWEMGroupsWEMContestUsers extends DemoFrameworkBaseGroups {
  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->dependencies = array('DFSWEMContestNodes', 'DFSWEMUsers');
    $import_path = drupal_get_path('module', 'dfs_wem') . '/import/';
    $this->source = new MigrateSourceCSV($import_path . 'dfs_wem.groups.wem_contest.users.csv', $this->csvcolumns(), array('header_rows' => 1));
    // Group
    $this->addFieldMapping('gid', 'group')->sourceMigration('DFSWEMContestNodes');
    // User 
    $this->addFieldMapping('etid', 'user')->sourceMigration('DFSWEMUsers');
  }
  function csvcolumns() {
    $columns[0] = array('group', 'Group');
    $columns[1] = array('user', 'User');
    $columns[2] = array('key', 'Key');
    return $columns;
  }
}
