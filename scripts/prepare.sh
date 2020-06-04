#!/usr/bin/env bash

npm run build:types
npm run build:predicates
tsc -b
