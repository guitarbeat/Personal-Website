#!/bin/bash
# Install project dependencies for Codex testing and linting
npm install
npx husky install >/dev/null 2>&1 || true
