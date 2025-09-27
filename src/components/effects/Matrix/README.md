# Matrix Component

A sophisticated Matrix-style authentication system with enhanced visual effects and security features. This component has been refactored to eliminate incongruencies and improve maintainability.

## Recent Improvements

### 🔧 **Code Quality Enhancements**
- **Consolidated Color System**: Single source of truth for all color definitions
- **Standardized Animations**: Consistent timing using CSS custom properties
- **Organized CSS**: Removed duplicate rules and improved structure
- **Consistent Z-Index Scale**: Proper layering system (1000s for overlays, 2000s for modals)
- **Extracted Constants**: All magic numbers moved to centralized constants file
- **Standardized Error Handling**: Consistent error patterns across all functions
- **Improved Cleanup**: Proper cleanup of all event listeners and animations
- **Aligned Performance Detection**: Consistent breakpoints between CSS and JavaScript

## Features

### 🎨 Visual Enhancements

- **Enhanced Matrix Rain Effect**: Improved character trails, better gradients, and smoother animations
- **Performance Optimized**: Frame rate limiting and efficient rendering
- **Accessibility**: ARIA labels, keyboard navigation, and high contrast support
- **Responsive Design**: Optimized for mobile and desktop devices

### 🔐 Security Features

- **Rate Limiting**: Prevents brute force attacks with configurable limits
- **Session Management**: Secure session persistence with automatic expiration
- **Environment Variables**: Password stored securely via `REACT_APP_AUTH_PASSWORD`
- **Input Validation**: Proper password trimming and validation

### ⌨️ User Experience

- **Keyboard Shortcuts**:
  - `ESC`: Exit Matrix
  - `H`: Toggle hint system
  - `ENTER`: Submit password
- **Hint System**: Contextual hints to help users
- **Visual Feedback**: Enhanced success/error animations
- **Logout Functionality**: Secure logout with session cleanup

### 🎯 Easter Egg Activation

- **Theme Click Sequence**: Click the theme toggle 5 times within 2 seconds to activate
- **URL Parameter Support**: Direct access via `?password=yourpassword`
- **Session Persistence**: Stays unlocked for 24 hours

## Configuration

### Environment Variables

```bash
REACT_APP_AUTH_PASSWORD=your_secure_password
```

### Constants File

All configuration is now centralized in `constants.js`:

```javascript
// Colors, animations, performance settings, etc.
import { MATRIX_COLORS, ANIMATION_TIMING, PERFORMANCE } from './constants';
```

### Rate Limiting Settings

- **Max Attempts**: 5 attempts per window
- **Window Duration**: 15 minutes
- **Lockout Duration**: 30 minutes

### Session Settings

- **Session Duration**: 24 hours
- **Storage**: Session storage (cleared on browser close)

## Usage

### Basic Implementation

```jsx
import Matrix from './components/effects/Matrix/Matrix';
import { AuthProvider } from './components/effects/Matrix/AuthContext';

function App() {
  const [showMatrix, setShowMatrix] = useState(false);
  
  return (
    <AuthProvider>
      <Matrix 
        isVisible={showMatrix} 
        onSuccess={() => setShowMatrix(false)} 
      />
    </AuthProvider>
  );
}
```

### Authentication Hook

```jsx
import { useAuth } from './components/effects/Matrix/AuthContext';

function MyComponent() {
  const { isUnlocked, logout, rateLimitInfo } = useAuth();
  
  return (
    <div>
      {isUnlocked && <button onClick={logout}>Logout</button>}
      {rateLimitInfo.isLimited && <p>Rate limited!</p>}
    </div>
  );
}
```

## Accessibility

- **Screen Reader Support**: Proper ARIA labels and roles
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Mode**: Enhanced visibility for accessibility
- **Reduced Motion**: Respects user motion preferences

## Performance

- **Optimized Rendering**: 60 FPS target with frame limiting
- **Memory Management**: Proper cleanup of event listeners and animations
- **Efficient Updates**: Minimal re-renders with useCallback optimization

## Security Considerations

- **No Password Logging**: Passwords are never logged or stored in plain text
- **Session Security**: Secure session storage with automatic expiration
- **Rate Limiting**: Protection against brute force attacks
- **Input Sanitization**: Proper input validation and trimming

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Canvas Support**: Required for Matrix rain effect
- **Session Storage**: Required for session management
- **ES6+ Features**: Required for React hooks and modern JavaScript
