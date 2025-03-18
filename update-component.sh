#!/bin/bash

# Script to help migrate component files from _variables.scss to tokens
# Usage: ./update-component.sh [component-file-path]

if [ -z "$1" ]; then
  echo "Please provide a component file path"
  echo "Usage: ./update-component.sh src/components/path/to/component.scss"
  exit 1
fi

COMPONENT_FILE=$1

if [ ! -f "$COMPONENT_FILE" ]; then
  echo "File not found: $COMPONENT_FILE"
  exit 1
fi

echo "Updating $COMPONENT_FILE..."

# Create a backup of the original file
cp "$COMPONENT_FILE" "${COMPONENT_FILE}.bak"
echo "Backup created at ${COMPONENT_FILE}.bak"

# Replace imports
sed -i '' 's/@use ".*\/variables" as vars;/@use "..\/..\/..\/..\/sass\/tokens" as tokens;/g' "$COMPONENT_FILE"
sed -i '' 's/@use ".*\/variables" as var;/@use "..\/..\/..\/..\/sass\/tokens" as tokens;/g' "$COMPONENT_FILE"
sed -i '' 's/@use ".*\/variables" as \*;/@use "..\/..\/..\/..\/sass\/tokens" as tokens;/g' "$COMPONENT_FILE"

# Replace common variable references
sed -i '' 's/vars\.\$shadow-light/tokens.shadow("sm")/g' "$COMPONENT_FILE"
sed -i '' 's/vars\.\$shadow-medium/tokens.shadow("md")/g' "$COMPONENT_FILE"
sed -i '' 's/vars\.\$shadow-heavy/tokens.shadow("lg")/g' "$COMPONENT_FILE"
sed -i '' 's/vars\.\$scale-hover-small/tokens.scale("sm")/g' "$COMPONENT_FILE"
sed -i '' 's/vars\.\$scale-hover-medium/tokens.scale("md")/g' "$COMPONENT_FILE"
sed -i '' 's/vars\.\$scale-hover-large/tokens.scale("lg")/g' "$COMPONENT_FILE"

# Replace var. references (alternative naming)
sed -i '' 's/var\.\$shadow-light/tokens.shadow("sm")/g' "$COMPONENT_FILE"
sed -i '' 's/var\.\$shadow-medium/tokens.shadow("md")/g' "$COMPONENT_FILE"
sed -i '' 's/var\.\$shadow-heavy/tokens.shadow("lg")/g' "$COMPONENT_FILE"
sed -i '' 's/var\.\$scale-hover-small/tokens.scale("sm")/g' "$COMPONENT_FILE"
sed -i '' 's/var\.\$scale-hover-medium/tokens.scale("md")/g' "$COMPONENT_FILE"
sed -i '' 's/var\.\$scale-hover-large/tokens.scale("lg")/g' "$COMPONENT_FILE"

echo "Initial replacements complete."
echo "Please manually check $COMPONENT_FILE for any remaining variables that need to be updated."
echo ""
echo "To compile and verify changes:"
echo "npm run sass:check"
echo ""
echo "To restore the backup if needed:"
echo "mv ${COMPONENT_FILE}.bak $COMPONENT_FILE" 