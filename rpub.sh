#!/bin/sh

echo Updating remote ...
ssh $RED "cd ~/Sites/Website && git pull && ./pub.sh"

