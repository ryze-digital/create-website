#!/bin/bash

set -euo pipefail
export NODEJS_VERSION=22

npm install grunt@1.6 grunt-cache-bust@1.7 grunt-contrib-copy@1.0 --no-package-lock
npm run pre-production