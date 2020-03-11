#!/usr/bin/env bash

# Enable bash strict mode
set -euo pipefail
IFS=$'\n\t'

export NVM_DIR="$HOME/.nvm"

set +x

. /usr/share/nvm/init-nvm.sh
cd card-librarian
nvm install
nvm use --silent

function finish {
  curl -X POST $(< ~/slack-webhook-url) -d "{ \"text\": \"❌💣❌ Pipeline $JOB_ID at $JOB_URL failed\", \"format\": \"plain\", \"displayName\": \"Card Librarian CI\", \"avatarUrl\": \"https://mtg.tim.schumacher.im/assets/apple-touch-icon.png\" }" -H 'Content-Type: application/json'
}

trap finish ERR
