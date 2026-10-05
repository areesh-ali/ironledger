#!/bin/bash

set -e

for dir in apps/*; do
  if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
    echo "Installing dependencies in $dir"
    (
      cd "$dir"
      npm i
    )
  fi
done
