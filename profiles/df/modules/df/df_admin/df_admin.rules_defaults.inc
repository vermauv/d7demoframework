<?php
/**
 * @file
 * df_admin.rules_defaults.inc
 */

/**
 * Implements hook_default_rules_configuration().
 */
function df_admin_default_rules_configuration() {
  $items = array();
  $items['rules_df_admin_login_redirect'] = entity_import('rules_config', '{ "rules_df_admin_login_redirect" : {
      "LABEL" : "DF Admin Initial Login Redirect",
      "PLUGIN" : "reaction rule",
      "WEIGHT" : "-10",
      "OWNER" : "rules",
      "TAGS" : [ "Demo Framework" ],
      "REQUIRES" : [ "rules" ],
      "ON" : { "user_login" : [] },
      "IF" : [
        { "user_has_role" : {
            "account" : [ "account" ],
            "roles" : { "value" : { "30037204" : "30037204" } }
          }
        },
        { "NOT text_matches" : {
            "text" : [ "site:current-page:path" ],
            "match" : "^user\\/reset\\/",
            "operation" : "regex"
          }
        }
      ],
      "DO" : [ { "redirect" : { "url" : "[site:url]" } } ]
    }
  }');
  return $items;
}
