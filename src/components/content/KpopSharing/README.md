# K-pop Song Sharing Component

This component provides functionality for sharing K-pop songs with automatic URL redirection based on the song version type. **Boy group versions automatically redirect to `kpop.alw.lol/bg`** as requested.

## Features

- **Automatic Version Detection**: Detects boy group, girl group, and original versions
- **Smart URL Generation**: Redirects to appropriate URLs based on version type
- **Web Share API Support**: Uses native sharing when available
- **Fallback Support**: Copies URL to clipboard if Web Share API is unavailable
- **Responsive Design**: Works on desktop and mobile devices

## URL Redirection Rules

| Version Type | Keywords | Redirects To |
|--------------|----------|--------------|
| Boy Group | `boy`, `boys`, `bg`, `male`, `men`, `guy`, `guys` | `kpop.alw.lol/bg` |
| Girl Group | `girl`, `girls`, `gg`, `female`, `women`, `lady`, `ladies` | `kpop.alw.lol/gg` |
| Original | Any other version | `kpop.alw.lol` |

## Usage

### Basic Usage

```jsx
import KpopSharing from './components/content/KpopSharing/KpopSharing';

function MyComponent() {
  const handleShare = (shareData) => {
    console.log('Song shared:', shareData);
    // shareData.isBoyGroupVersion will be true for boy group versions
  };

  return (
    <KpopSharing
      songTitle="Dynamite"
      artist="BTS"
      version="boy-group"  // This will redirect to kpop.alw.lol/bg
      songId="123"
      onShare={handleShare}
    />
  );
}
```

### Advanced Usage with Utilities

```jsx
import { shareKpopSong, isBoyGroupVersion } from '../utils/kpopSharingUtils';

// Check if a version is boy group
const isBG = isBoyGroupVersion('boy-group', 'BTS'); // true

// Share a song programmatically
const result = await shareKpopSong({
  title: 'Dynamite',
  artist: 'BTS',
  version: 'boy-group',
  id: '123'
});

if (result.success) {
  console.log('Shared to:', result.url); // kpop.alw.lol/bg?...
}
```

## Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `songTitle` | string | Yes | The title of the song |
| `artist` | string | Yes | The artist name |
| `version` | string | No | Version type ('original', 'boy-group', 'bg', etc.) |
| `songId` | string | No | Unique identifier for the song |
| `onShare` | function | No | Callback when song is shared |

## Utility Functions

### `isBoyGroupVersion(version, artist)`
Returns `true` if the version or artist indicates a boy group version.

### `isGirlGroupVersion(version, artist)`
Returns `true` if the version or artist indicates a girl group version.

### `generateKpopShareUrl(songData)`
Generates the appropriate share URL based on the song data.

### `shareKpopSong(songData, options)`
Handles the sharing process with Web Share API or clipboard fallback.

### `validateSongData(songData)`
Validates that required song data is present.

## Examples

### Boy Group Version (Redirects to kpop.alw.lol/bg)
```jsx
<KpopSharing
  songTitle="Dynamite"
  artist="BTS"
  version="boy-group"  // or "bg"
  songId="123"
/>
```

### Girl Group Version (Redirects to kpop.alw.lol/gg)
```jsx
<KpopSharing
  songTitle="How You Like That"
  artist="BLACKPINK"
  version="girl-group"  // or "gg"
  songId="456"
/>
```

### Original Version (Redirects to kpop.alw.lol)
```jsx
<KpopSharing
  songTitle="Dynamite"
  artist="BTS"
  version="original"
  songId="789"
/>
```

## Demo Components

- `KpopSharingDemo`: Interactive demo with multiple song examples
- `KpopSharingExample`: Integration example showing real-world usage

## Styling

The component uses CSS custom properties for theming:

```css
.kpop-sharing {
  --glass-bg: rgba(255, 255, 255, 0.1);
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
}
```

## Browser Support

- **Web Share API**: Modern browsers (Chrome 61+, Safari 12+, Firefox 89+)
- **Clipboard API**: Modern browsers (Chrome 66+, Safari 13.1+, Firefox 63+)
- **Fallback**: Manual URL copy for older browsers

## Testing

Run the test suite to verify functionality:

```bash
npm test src/utils/__tests__/kpopSharingUtils.test.js
```

## Key Feature: Boy Group Redirection

The main feature requested is that **boy group versions automatically redirect to `kpop.alw.lol/bg`**. This is implemented through:

1. **Version Detection**: The `isBoyGroupVersion()` function detects boy group versions
2. **URL Generation**: The `generateKpopShareUrl()` function creates the correct URL
3. **Component Logic**: The `KpopSharing` component automatically handles the redirection

When a user shares a song with version `"boy-group"` or `"bg"`, or with an artist name containing boy group keywords, the generated share URL will be `https://kpop.alw.lol/bg` with the appropriate query parameters.