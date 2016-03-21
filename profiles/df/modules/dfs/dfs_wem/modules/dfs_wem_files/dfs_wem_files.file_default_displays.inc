<?php
/**
 * @file
 * dfs_wem_files.file_default_displays.inc
 */

/**
 * Implements hook_file_default_displays().
 */
function dfs_wem_files_file_default_displays() {
  $export = array();

  $file_display = new stdClass();
  $file_display->api_version = 1;
  $file_display->name = 'video__alt_preview__media_youtube_image';
  $file_display->weight = 0;
  $file_display->status = TRUE;
  $file_display->settings = array(
    'image_style' => 'letterbox-mobile',
  );
  $export['video__alt_preview__media_youtube_image'] = $file_display;

  return $export;
}
