#!/bin/bash

# Script to check if the last commit added motion blur functionality
# This script automates the manual commands described in the problem statement
#
# Usage: ./check-motion-blur.sh [commit-sha]
#   If no commit-sha is provided, checks the last commit (HEAD)

# Don't exit on error, we'll handle errors gracefully
set +e

# Get commit to analyze (default to HEAD)
COMMIT=${1:-HEAD}

echo "============================================"
echo "Motion Blur Functionality Analysis"
echo "Analyzing commit: $COMMIT"
echo "============================================"
echo ""

# Check the commit message
echo "1. Commit Message:"
echo "----------------------"
git log -1 --oneline "$COMMIT"
echo ""

# View what files were modified
echo "2. Files Modified in Commit:"
echo "--------------------------------"
FILES=$(git show "$COMMIT" --name-only --format="" | grep -v "^$")
if [ -z "$FILES" ]; then
    echo "(No files modified in this commit)"
else
    echo "$FILES"
fi
echo ""

# Search for motion blur related terms
echo "3. Motion Blur Related Terms in Commit:"
echo "-------------------------------------------"
if git show "$COMMIT" | grep -i "motion\|blur\|velocity\|temporal" > /dev/null 2>&1; then
    git show "$COMMIT" | grep -i "motion\|blur\|velocity\|temporal" | head -20
    echo ""
    echo "✓ Found motion blur related terms in the commit"
else
    echo "✗ No motion blur related terms found"
fi
echo ""

# Check for specific file types and patterns
echo "4. Analysis Summary:"
echo "-------------------"

HAS_MOTION_BLUR=false

# Check commit message
if git log -1 --oneline "$COMMIT" | grep -i "motion.*blur\|blur.*motion" > /dev/null 2>&1; then
    echo "✓ Commit message mentions motion blur"
    HAS_MOTION_BLUR=true
else
    echo "✗ Commit message does not explicitly mention motion blur"
fi

# Check for blur-related files
if git show "$COMMIT" --name-only --format="" | grep -i "blur" > /dev/null 2>&1; then
    echo "✓ Blur-related files were modified:"
    git show "$COMMIT" --name-only --format="" | grep -i "blur"
    HAS_MOTION_BLUR=true
else
    echo "✗ No blur-related files were modified"
fi

# Check for shader files
if git show "$COMMIT" --name-only --format="" | grep -E "\.(glsl|hlsl|vert|frag)$" > /dev/null 2>&1; then
    echo "✓ Shader files were modified:"
    git show "$COMMIT" --name-only --format="" | grep -E "\.(glsl|hlsl|vert|frag)$"
    HAS_MOTION_BLUR=true
fi

# Check for specific keywords in the diff
if git show "$COMMIT" | grep -i "motion.*blur\|blur.*motion\|velocity.*blur\|temporal.*blur" > /dev/null 2>&1; then
    echo "✓ Found motion blur implementation keywords in changes"
    HAS_MOTION_BLUR=true
fi

echo ""
echo "============================================"
if [ "$HAS_MOTION_BLUR" = true ]; then
    echo "CONCLUSION: This commit likely ADDED motion blur functionality"
else
    echo "CONCLUSION: This commit likely DID NOT add motion blur functionality"
fi
echo "============================================"
