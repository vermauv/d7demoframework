<?php
/**
 * @file
 * dfs_med_series.rules_defaults.inc
 */

/**
 * Implements hook_default_rules_configuration().
 */
function dfs_med_series_default_rules_configuration() {
  $items = array();
  $items['dfs_med_episodes_save_series_count_episodes'] = entity_import('rules_config', '{ "dfs_med_episodes_save_series_count_episodes" : {
      "LABEL" : "Save Series count Episodes",
      "PLUGIN" : "reaction rule",
      "OWNER" : "rules",
      "TAGS" : [ "DFS MED" ],
      "REQUIRES" : [ "rules" ],
      "ON" : { "node_presave--series" : { "bundle" : "series" } },
      "DO" : [
        { "variable_add" : {
            "USING" : { "type" : "integer", "value" : "0" },
            "PROVIDE" : { "variable_added" : { "series_list_count" : "Added count" } }
          }
        },
        { "LOOP" : {
            "USING" : { "list" : [ "node:field-series-episodes" ] },
            "ITEM" : { "series_list" : "Current series list" },
            "DO" : [
              { "data_calc" : {
                  "USING" : { "input_1" : [ "series-list-count" ], "op" : "+", "input_2" : "1" },
                  "PROVIDE" : { "result" : { "series_result" : "Calculation result" } }
                }
              },
              { "data_set" : { "data" : [ "series-list-count" ], "value" : [ "series-result" ] } }
            ]
          }
        },
        { "data_set" : {
            "data" : [ "node:field-collected-count" ],
            "value" : [ "series-list-count" ]
          }
        },
        { "entity_save" : { "data" : [ "node" ] } }
      ]
    }
  }');
  return $items;
}
