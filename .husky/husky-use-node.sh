#!/bin/sh

# Load Node from .nvmrc if possible
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  nvm use > /dev/null
elif [ -x "$LOCALAPPDATA/Programs/nodejs/node.exe" ]; then
  # Windows Git Bash: prefer the local Node.js install when NVM is absent.
  export PATH="$LOCALAPPDATA/Programs/nodejs:$PATH"
else
  echo "⚠️  NVM not found. Falling back to system Node version."
fi
