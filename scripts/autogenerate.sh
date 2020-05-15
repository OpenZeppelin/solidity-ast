#!/usr/bin/env bash

set -euo pipefail

dir="solidity/test/libsolidity/ASTJSON"

# We ignore documentation.json because it's invalid json.
# See https://github.com/ethereum/solidity/issues/8954
input=($(find "$dir" -maxdepth 1 -type f -name '*.json' ! -name '*_legacy.json' ! -name 'documentation.json'))

node_types=($(jq -sr '[recurse(.[]?) | objects | .nodeType | values] | unique | .[]' "${input[@]}"))

for node_type in "${node_types[@]}"; do
  node_dir="samples/${node_type}"

  mkdir -p "$node_dir"

  jq -sc 'recurse(.[]?) | objects | select(.nodeType == "'"${node_type}"'")' "${input[@]}" \
    | split -dl1 --additional-suffix='.json' - "$node_dir/"
done

quicktype -l schema -o schema.json samples
