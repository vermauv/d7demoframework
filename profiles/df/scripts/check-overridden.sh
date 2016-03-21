#!/bin/bash

: ${DRUSH:=drush}
: ${DRUSH_ARGS:=}

DEMO_FRAMEWORK_FEATURES="df_admin df_commerce df_engage df_tools_color df_tools_hero df_tools_moderation df_tools_rest df_tools_services df_tools_vertical_tabs"

# TODO: We should make sure that 'diff' is downloaded first!
$DRUSH $DRUSH_ARGS en -y diff

# Notify which features are overridden.
for demo_framework_feature in $DEMO_FRAMEWORK_FEATURES; do
  echo "Checking $demo_framework_feature..."
  if $DRUSH $DRUSH_ARGS features-diff $demo_framework_feature 2>&1 | grep -v 'Feature is in its default state'; then
    echo "$demo_framework_feature is overridden."
  fi
done

exit 0
