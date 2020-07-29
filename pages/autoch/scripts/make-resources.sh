#!/bin/sh

set -e

node createHanziDict.js "$@" 
node createWordList.js simplified "$@"
node createWordList.js traditional "$@"
