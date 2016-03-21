#!/bin/sh

MAKEFILE='build-df.make'
TARGET=$1
CALLPATH=`dirname $0`
echo '      ____________________________'
echo '     _/\/\/\/\/\____/\/\/\/\/\/\_'
echo '    _/\/\____/\/\__/\/\_________'
echo '   _/\/\____/\/\__/\/\/\/\/\___'
echo '  _/\/\____/\/\__/\/\_________'
echo ' _/\/\/\/\/\____/\/\_________'
echo '____________________________'
drush make --concurrency=5 $CALLPATH/$MAKEFILE $TARGET
