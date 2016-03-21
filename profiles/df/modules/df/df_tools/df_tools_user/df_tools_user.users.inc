<?php

/**
 *  @file
 *   Contains base User migration class
 */

class DFUsers extends ImportBaseUsers {

  public function __construct($arguments) {
    parent::__construct($arguments);
    // Create a MigrateSource object.
    if (isset($arguments['path'])) {
      $import_path = $arguments['path'];
    }
    else {
      $import_path = drupal_get_path('module', 'df_tools_user') . '/import/df_tools_user.users.csv';
    }
    $this->source = new MigrateSourceCSV($import_path, $this->csvcolumns(), array('header_rows' => 1));

    $picture_source = isset($arguments['picture_source']) ? $arguments['picture_source'] : 'DFUserPictures';
    $this->addFieldMapping('picture', 'picture')->sourceMigration($picture_source);
    $this->addFieldMapping('field_user_interests', 'interests');
    $this->addFieldMapping('field_user_bio', 'bio');
    $this->addFieldMapping('field_user_bio:format')->defaultValue('userbase');
    $this->addFieldMapping('field_user_first', 'first');
    $this->addFieldMapping('field_user_last', 'last');
    // Last login
    $this->addFieldMapping('login', 'access')->defaultValue(strtotime("-1 week"));
    $this->addFieldMapping('login', 'login')->defaultValue(strtotime("-1 week"));
  }

  function csvcolumns() {
    $columns[0] = array('name', 'Name');
    $columns[1] = array('pass', 'Pass');
    $columns[2] = array('mail', 'Mail');
    $columns[3] = array('status', 'Status');
    $columns[4] = array('roles', 'Roles');
    $columns[5] = array('picture', 'Picture');
    $columns[6] = array('interests', 'Interests');
    $columns[7] = array('bio', 'Bio');
    $columns[8] = array('first', 'First');
    $columns[9] = array('last', 'Last');
    $columns[10] = array('login', 'Last Login');
    return $columns;
  }

  public function prepareRow($row) {
    $user_roles = explode(", ", $row->roles);
    $roles = array('2' => '2');
    foreach ($user_roles as $role_name) {
      $rid = db_query('SELECT rid FROM {role} WHERE name = :name', array(':name' => $role_name))->fetchField();
      $roles[$rid] = $rid;
    }
    $row->roles = $roles;
    $row->interests = explode(", ", $row->interests);
    // Convert date string in csv to a datetime
    if (isset($row->login)) {
      $row->login = strtotime($row->login);
    }
    return TRUE;
  }

}

class DFUserPictures extends ImportBaseUserPictures {
  public function __construct($arguments) {
    parent::__construct($arguments);
    if (isset($arguments['path'])) {
      $import_path = $arguments['path'];
    }
    else {
      $import_path = drupal_get_path('module', 'df_tools_user') . '/import/df_tools_user.users.csv';
    }
    $this->source = new MigrateSourceCSV($import_path, $this->csvcolumns(), array('header_rows' => 1));

    // Get the base path, which is where we assume /images is located
    $base_path = dirname($import_path);
    $this->addFieldMapping('source_dir')->defaultValue($base_path . '/images');
  }

  function csvcolumns() {
    $columns[5] = array('picture', 'Picture');
    return $columns;
  }

}
