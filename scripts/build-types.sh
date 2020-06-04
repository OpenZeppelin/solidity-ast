#!/usr/bin/env bash

set -euo pipefail

json2ts schema.json types.d.ts --strictIndexSignatures --bannerComment "/* tslint:disable */"
