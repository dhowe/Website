#!/bin/sh

echo Updating remote server...
ssh $RED "cd ~/Sites/Website && git pull && ./pub.sh"

