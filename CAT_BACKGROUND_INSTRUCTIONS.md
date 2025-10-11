# Cat Background Setup Instructions

## Current Implementation
Your website now has a cat background! I've added a placeholder SVG cat image that works with both light and dark themes.

## To Replace with Your Actual Cat Photo

1. **Add your cat image** to `/workspace/src/assets/images/`
   - Name it `cat-background.jpg` (or `.png`, `.webp`)
   - Recommended size: 1920x1080 or larger
   - Format: JPG, PNG, or WebP

2. **Update the CSS** in `/workspace/src/sass/_base.scss`
   - Find line 159: `background: var(--background-color) url("../assets/images/cat-background.svg") no-repeat center center fixed;`
   - Change `cat-background.svg` to `cat-background.jpg` (or your file extension)

3. **Rebuild the project**
   ```bash
   npm run build
   ```

## Current Features
- ✅ Cat background image (placeholder SVG)
- ✅ Works with both light and dark themes
- ✅ Semi-transparent overlay for text readability
- ✅ Responsive design
- ✅ Fixed background (doesn't scroll with content)

## Theme Support
- **Dark theme**: Dark overlay (30% opacity) for better text contrast
- **Light theme**: Light overlay (70% opacity) for better text contrast

The background will automatically adjust its overlay based on the current theme!