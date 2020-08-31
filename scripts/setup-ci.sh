#!/usr/bin/env bash

# Enable bash strict mode
set -euo pipefail
IFS=$'\n\t'

export NVM_DIR="$HOME/.nvm"

set +x

export DOCKER_BUILDKIT=1

. /usr/share/nvm/init-nvm.sh
cd card-librarian
nvm install
nvm use --silent

if [ ! -d node_modules ]; then
    npm ci
fi;

function finish {
  curl -X POST $(< ~/slack-webhook-url) -d "{ \"text\": \"❌💣❌ Pipeline $JOB_ID at $JOB_URL failed\", \"format\": \"plain\", \"displayName\": \"Card Librarian CI\", \"avatarUrl\": \"https://mtg.tim.schumacher.im/assets/apple-touch-icon.png\" }" -H 'Content-Type: application/json'
}

trap finish ERR
