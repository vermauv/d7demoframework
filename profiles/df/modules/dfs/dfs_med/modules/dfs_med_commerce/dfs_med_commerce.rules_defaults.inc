<?php
/**
 * @file
 * dfs_med_commerce.rules_defaults.inc
 */

/**
 * Implements hook_default_rules_configuration().
 */
function dfs_med_commerce_default_rules_configuration() {
  $items = array();
  $items['dfs_med_commerce_add_to_cart_checkout_anonymous_'] = entity_import('rules_config', '{ "dfs_med_commerce_add_to_cart_checkout_anonymous_" : {
      "LABEL" : "Add to cart checkout redirect (anonymous)",
      "PLUGIN" : "reaction rule",
      "OWNER" : "rules",
      "TAGS" : [ "DFS MED" ],
      "REQUIRES" : [ "rules", "commerce_cart" ],
      "ON" : { "commerce_cart_product_add" : [] },
      "IF" : [
        { "user_has_role" : {
            "account" : [ "site:current-user" ],
            "roles" : { "value" : { "1" : "1" } }
          }
        }
      ],
      "DO" : [ { "redirect" : { "url" : "\\/user?destination=checkout" } } ]
    }
  }');
  $items['dfs_med_commerce_checkout_order_status_completed'] = entity_import('rules_config', '{ "dfs_med_commerce_checkout_order_status_completed" : {
      "LABEL" : "Complete orders automatically on checkout",
      "PLUGIN" : "reaction rule",
      "OWNER" : "rules",
      "TAGS" : [ "DFS MED" ],
      "REQUIRES" : [ "commerce_order", "commerce_checkout" ],
      "ON" : { "commerce_checkout_complete" : [] },
      "DO" : [
        { "commerce_order_update_state" : { "commerce_order" : [ "commerce-order" ], "order_state" : "completed" } }
      ]
    }
  }');
  $items['rules_add_to_cart_checkout'] = entity_import('rules_config', '{ "rules_add_to_cart_checkout" : {
      "LABEL" : "Add to cart checkout redirect (authenticated)",
      "PLUGIN" : "reaction rule",
      "OWNER" : "rules",
      "TAGS" : [ "DFS MED" ],
      "REQUIRES" : [ "rules", "commerce_cart" ],
      "ON" : { "commerce_cart_product_add" : [] },
      "IF" : [
        { "user_has_role" : {
            "account" : [ "site:current-user" ],
            "roles" : { "value" : { "2" : "2" } }
          }
        }
      ],
      "DO" : [ { "redirect" : { "url" : "\\/checkout" } } ]
    }
  }');
  $items['rules_clean_cart_before_adding'] = entity_import('rules_config', '{ "rules_clean_cart_before_adding" : {
      "LABEL" : "Clean cart before adding product",
      "PLUGIN" : "reaction rule",
      "OWNER" : "rules",
      "TAGS" : [ "DFS MED" ],
      "REQUIRES" : [ "commerce_cart" ],
      "ON" : { "commerce_cart_product_prepare" : [] },
      "DO" : [
        { "commerce_cart_empty" : { "commerce_order" : [ "site:current-cart-order" ] } }
      ]
    }
  }');
  $items['rules_commerce_add_to_cart'] = entity_import('rules_config', '{ "rules_commerce_add_to_cart" : {
      "LABEL" : "Commerce Content auto add to cart",
      "PLUGIN" : "reaction rule",
      "OWNER" : "rules",
      "TAGS" : [ "DFS MED" ],
      "REQUIRES" : [ "commerce_cart", "rules" ],
      "ON" : { "node_view--commerce" : { "bundle" : "commerce" } },
      "DO" : [
        { "commerce_cart_product_add_by_sku" : {
            "USING" : {
              "user" : [ "site:current-user" ],
              "sku" : [ "node:field-product:0:sku" ],
              "quantity" : "1",
              "combine" : 1
            },
            "PROVIDE" : { "product_add_line_item" : { "product_add_line_item" : "Added product line item" } }
          }
        }
      ]
    }
  }');
  $items['rules_complete_checkout_my_shows'] = entity_import('rules_config', '{ "rules_complete_checkout_my_shows" : {
      "LABEL" : "Complete checkout My Shows redirect",
      "PLUGIN" : "reaction rule",
      "OWNER" : "rules",
      "TAGS" : [ "DFS MED" ],
      "REQUIRES" : [ "rules", "commerce_checkout" ],
      "ON" : { "commerce_checkout_complete" : [] },
      "DO" : [
        { "variable_add" : {
            "USING" : { "type" : "user", "value" : [ "site:current-user" ] },
            "PROVIDE" : { "variable_added" : { "current_user" : "Added variable" } }
          }
        },
        { "redirect" : { "url" : "user\\/[current-user:uid]\\/my-shows" } }
      ]
    }
  }');
  return $items;
}
