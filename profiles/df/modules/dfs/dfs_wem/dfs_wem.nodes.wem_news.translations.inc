<?php

/**
 * @file
 *  Migrations for WEM News Nodes Translations.
 */

class DFSWEMNewsNodesTranslations extends DemoFrameworkBaseNodesTranslations {

  public function __construct($arguments) {
    parent::__construct($arguments);
    $this->description = t('Import node translations.');
    $import_path = drupal_get_path('module', 'dfs_wem') . '/import/';
    // Create a MigrateSource object.
    $this->source = new MigrateSourceCSV($import_path . 'dfs_wem.nodes.wem_news.translations.csv', $this->csvcolumns(), array('header_rows' => 1));
    $this->destination = new MigrateDestinationNode('wem_news');
    // Image
    $this->addFieldMapping('field_wem_image', 'image');
    $this->addFieldMapping('field_wem_image:file_replace')->defaultValue(FILE_EXISTS_REPLACE);
    $this->addFieldMapping('field_wem_image:source_dir')->defaultValue($import_path . 'images');
    $this->addFieldMapping('field_wem_image:destination_file', 'filename');
    // Video
    $this->addFieldMapping('field_wem_video', 'video')->sourceMigration('DFSWEMNewsVideo');
    $this->addFieldMapping('field_wem_video:file_class')->defaultValue('MigrateFileFid');
    // Taxonomy
    $this->addFieldMapping('field_wem_interests', 'interests');
    // Workbench
    $this->addFieldMapping('workbench_moderation_state_new', 'workbench_moderation_state_new')->defaultValue('published');
    // Translations
    $this->addFieldMapping('title', 'translated_title');
    $this->addFieldMapping('tnid', 'title')->sourceMigration('DFSWEMNewsNodes');
    // UUID
    $this->addFieldMapping('uuid', 'uuid');
    // Created
    $this->addFieldMapping('created', 'created')->defaultValue(strtotime("now"));
    // Persona
    $this->addFieldMapping('field_persona', 'persona');
    // Site Section
    $this->addFieldMapping('field_site_section', 'site_section')->defaultValue("Content");
  }

  function csvcolumns() {
    $columns[0] = array('title', 'Source Title');
    $columns[1] = array('language', 'Language');
    $columns[2] = array('translated_title', 'Title');
    $columns[3] = array('body', 'Body');
    $columns[4] = array('image', 'Image');
    $columns[5] = array('video', 'Video');
    $columns[6] = array('interests', 'Interests');
    $columns[7] = array('uuid', 'UUID');
    $columns[8] = array('created', 'Created');
    $columns[9] = array('persona', 'Persona');
    return $columns;
  }

  function prepareRow($row) {
    $row->interests = explode(", ", $row->interests);
    return TRUE;
  }

  function prepare(&$node, $row) {
    if (isset($node->tnid) && ($source = node_load($node->tnid))) {
      $node->translation_source = $source;
    }
  }
}
