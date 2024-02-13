#!/bin/bash

# Name of the pm2 process
PROCESS_NAME="clearmail"

# Check if the process is running
if pm2 list | grep -q $PROCESS_NAME; then
  echo "$PROCESS_NAME is running."
else
  echo "$PROCESS_NAME is not running. Starting now..."
  pm2 start ~/dev/clearmail/server.js --name $PROCESS_NAME
fi

# Trigger the /process-emails endpoint
curl -sS http://localhost:3003/process-emails >> ~/dev/clearmail/cron.log 2>&1
