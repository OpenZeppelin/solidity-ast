#!/usr/bin/env bash

npm run build:types
npm run build:node-type
npm run build:finder
tsc -b
