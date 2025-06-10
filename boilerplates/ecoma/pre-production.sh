#!/bin/bash

set -euo pipefail

npm install grunt@1.6 grunt-cache-bust@1.7 grunt-contrib-copy@1.0 --no-package-lock
npm run pre-production