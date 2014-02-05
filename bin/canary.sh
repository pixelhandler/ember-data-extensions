#!/bin/bash

DIR="`pwd`"
VENDOR_DIR=$DIR"/bower_components"

function remove_file() {
  # $1 - filename
  echo "Try to remove "$1
  if [ -e $1 ]; then
    rm $1
    echo "Removed "$1
  fi
}

function update_file_via_curl() {
  # $1 - filename, $2 - url, $3 - directory
  remove_file $1
  echo "Download "$2" to "$1
  curl -o $1 $2
  echo "Downloaded... "$1
}

file=$VENDOR_DIR"/ember/ember.js"
remove_file $file
src="http://builds.emberjs.com/canary/ember.js"
update_file_via_curl $file $src $VENDOR_DIR

file=$VENDOR_DIR"/ember-data/ember-data.js"
remove_file $file
src="http://builds.emberjs.com/canary/ember-data.js"
update_file_via_curl $file $src $VENDOR_DIR

unset DIR
unset VENDOR_DIR
unset file
unset src
unset update_file_via_curl
unset remove_file
