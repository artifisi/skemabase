#!/usr/bin/env bash
# Generate Mermaid ER diagrams for all example schemas
set -euo pipefail

for sb in examples/*/*.sb; do
  dir="$(dirname "$sb")"
  base="$(basename "$sb" .sb)"
  out="$dir/${base}.mmd"
  echo "Generating diagram for $sb -> $out"
  node "$PWD/bin/cli.js" generate diagram "$sb" --format mermaid --output "$out"
done