#!/bin/sh

MAKEFILE='build-df.make'
TARGET=$1
CALLPATH=`dirname $0`
# Remove target directory if it exists.
if [[ -r $TARGET ]]; then
  rm -rf $TARGET
fi
# Macro the distro name.
echo '      ____________________________'
echo '     _/\/\/\/\/\____/\/\/\/\/\/\_'
echo '    _/\/\____/\/\__/\/\_________'
echo '   _/\/\____/\/\__/\/\/\/\/\___'
echo '  _/\/\____/\/\__/\/\_________'
echo ' _/\/\/\/\/\____/\/\_________'
echo '____________________________'
# Run drush make using --working-copy directive
drush make --working-copy --concurrency=5 $CALLPATH/$MAKEFILE $TARGET
