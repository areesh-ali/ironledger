#!/bin/bash

set -e

echo "Cleaning root..."
rm -rf node_modules

echo "Cleaning apps..."
rm -rf apps/api/node_modules
rm -rf apps/ui/node_modules

echo "Installing root dependencies..."
npm ci

echo "Installing API dependencies..."
npm --prefix apps/api ci

echo "Installing UI dependencies..."
npm --prefix apps/ui ci

echo "Clean install complete."