<?php
/**
 * @file
 * df_tools_moderation.rules_defaults.inc
 */

/**
 * Implements hook_default_rules_configuration().
 */
function df_tools_moderation_default_rules_configuration() {
  $items = array();
  $items['rules_df_email_reviewers_on_content_review'] = entity_import('rules_config', '{ "rules_df_email_reviewers_on_content_review" : {
      "LABEL" : "DF Email reviewers on content review",
      "PLUGIN" : "reaction rule",
      "OWNER" : "rules",
      "TAGS" : [ "Demo Framework" ],
      "REQUIRES" : [ "workbench_moderation", "rules", "mimemail" ],
      "ON" : { "workbench_moderation_after_moderation_transition" : [] },
      "IF" : [
        { "contents_current_state" : { "node" : [ "node" ], "moderation_state" : "needs_review" } }
      ],
      "DO" : [
        { "mimemail" : {
            "key" : "df_review_needed",
            "to" : "[site:mail]",
            "subject" : "Draft of \\u0022[node:title]\\u0022 available for review - [site:name]",
            "body" : "\\u003Ch2 style=\\u0022color: #224660;\\u0022\\u003E[site:name] - New content for review\\u003C\\/h2\\u003E\\r\\n\\r\\nA new draft of \\u003Ca href=\\u0022[node:url]\\u0022\\u003E[node:title]\\u003C\\/a\\u003E has been made available for your review. Please use the links and details below to approve this draft before publishing it.\\r\\n\\r\\nTo view this content, \\u003Ca href=\\u0022[node:url]\\u0022\\u003Eclick here\\u003C\\/a\\u003E. To moderate this draft, \\u003Ca href=\\u0022[site:url]node\\/[node:nid]\\/moderation\\u0022\\u003Eclick here\\u003C\\/a\\u003E.\\r\\n\\r\\n\\u003Ch3 style=\\u0022color: #224660;\\u0022\\u003EContent Details\\u003C\\/h3\\u003E\\r\\n\\r\\n\\u003Ci\\u003ECurrent status:\\u003C\\/i\\u003E [node:status] \\u003Cbr \\/\\u003E\\r\\n\\u003Ci\\u003EAuthor:\\u003C\\/i\\u003E [node:author] \\u003Cbr \\/\\u003E\\r\\n\\u003Ci\\u003EDate:\\u003C\\/i\\u003E [node:changed] \\u003Cbr \\/\\u003E\\r\\n\\u003Ci\\u003ELog Message:\\u003C\\/i\\u003E [node:log] \\u003Cbr \\/\\u003E\\r\\n\\u003Ci\\u003ELanguage:\\u003C\\/i\\u003E [node:language] \\u003Cbr \\/\\u003E",
            "language" : [ "" ]
          }
        }
      ]
    }
  }');
  return $items;
}
