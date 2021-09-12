#!/usr/bin/env bash

npm run build:schema
npm run build:types
npm run build:node-type
npm run build:finder
npm run build:referrers
tsc -b
