api = 2
core = 7.x

; Libraries
libraries[ckeditor_lite][download][type] = "get"
libraries[ckeditor_lite][download][url] = "https://github.com/loopindex/ckeditor-track-changes/archive/5d5af36e3ab394be8f84c3be0776b73d083d0028.zip"
libraries[ckeditor_lite][type] = "libraries"
libraries[ckeditor_lite][directory_name] = "lite"

; Stop CKLite from acting on content insertion.
; http://drupal.org/node/2482879
libraries[ckeditor_lite][patch][2482879] = "http://drupal.org/files/issues/cklite-content-insertion-2482879-1.patch"
