# Loading Sequence Variants

This directory contains different loading sequence animations for the application.

## Available Variants

### 1. Spiral Reveal (Default)
- **File**: `LoadingSequenceVariants.js` - `LoadingSequenceVariant1`
- **Description**: A colorful spiral that rotates and scales to reveal the content
- **Duration**: 2 seconds
- **Style**: Smooth, elegant transition

### 2. Particle Burst
- **File**: `LoadingSequenceVariants.js` - `LoadingSequenceVariant2`
- **Description**: Multiple colored particles that burst outward from the center
- **Duration**: 2 seconds
- **Style**: Dynamic, energetic effect

### 3. Wave Ripple
- **File**: `LoadingSequenceVariants.js` - `LoadingSequenceVariant3`
- **Description**: Concentric wave ripples expanding outward
- **Duration**: 3 seconds
- **Style**: Calm, water-like effect

### 4. Typewriter
- **File**: `LoadingSequenceVariants.js` - `LoadingSequenceVariant4`
- **Description**: Text that types out "INITIALIZING..." with a blinking cursor
- **Duration**: 4 seconds
- **Style**: Retro, terminal-like effect

### 5. Matrix Rain
- **File**: `LoadingSequenceVariants.js` - `LoadingSequenceVariant5`
- **Description**: Falling green lines reminiscent of The Matrix
- **Duration**: 2.5 seconds
- **Style**: Cyberpunk, digital effect

### 6. Glitch Effect
- **File**: `LoadingSequenceVariants.js` - `LoadingSequenceVariant6`
- **Description**: Glitchy text with color shifts and movement
- **Duration**: 2 seconds
- **Style**: Distorted, digital glitch effect

## Usage

The loading sequence can be controlled via the `variant` prop:

```jsx
<LoadingSequence 
  variant={1} // 1-6, default is 1
  onComplete={handleComplete}
  showMatrix={showMatrix}
  onMatrixReady={handleMatrixReady}
/>
```

## Variant Selector

A debug component `LoadingVariantSelector` is available in development mode to easily switch between variants. It appears in the top-right corner of the screen.

## Customization

Each variant can be customized by modifying the styled components and keyframes in `LoadingSequenceVariants.js`. The variants use:

- **Colors**: Green (#00ff88), Blue (#0088ff), Pink (#ff0088), Orange (#ff8800)
- **Timing**: Various easing functions and durations
- **Effects**: CSS animations, transforms, and transitions

## Original Implementation

The original loading sequence used simple mask animations and is preserved in `LoadingSequence.js` for reference.