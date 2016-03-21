<?php
/**
 * @file
 * dfs_med_episodes.rules_defaults.inc
 */

/**
 * Implements hook_default_rules_configuration().
 */
function dfs_med_episodes_default_rules_configuration() {
  $items = array();
  $items['rules_save_collection_count_episodes'] = entity_import('rules_config', '{ "rules_save_collection_count_episodes" : {
      "LABEL" : "Save Collection count Episodes",
      "PLUGIN" : "reaction rule",
      "OWNER" : "rules",
      "TAGS" : [ "DFS MED" ],
      "REQUIRES" : [ "rules" ],
      "ON" : { "node_presave--episodic_collection" : { "bundle" : "episodic_collection" } },
      "DO" : [
        { "variable_add" : {
            "USING" : { "type" : "integer", "value" : "0" },
            "PROVIDE" : { "variable_added" : { "collected_count" : "Added count" } }
          }
        },
        { "LOOP" : {
            "USING" : { "list" : [ "node:field-collected" ] },
            "ITEM" : { "collected_list" : "Current collection item" },
            "DO" : [
              { "data_calc" : {
                  "USING" : { "input_1" : [ "collected-count" ], "op" : "+", "input_2" : "1" },
                  "PROVIDE" : { "result" : { "collected_result" : "Calculation result" } }
                }
              },
              { "data_set" : { "data" : [ "collected-count" ], "value" : [ "collected-result" ] } }
            ]
          }
        },
        { "data_set" : {
            "data" : [ "node:field-collected-count" ],
            "value" : [ "collected-count" ]
          }
        },
        { "entity_save" : { "data" : [ "node" ] } }
      ]
    }
  }');
  return $items;
}
