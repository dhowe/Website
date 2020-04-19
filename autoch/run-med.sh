#!/bin/bash
node --max-old-space-size=16384 writeAllMeds.js 9 -f 2>&1 | tee log.txt
