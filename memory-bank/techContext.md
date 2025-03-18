# Technical Context: Personal Website

## Technology Stack

- **Frontend**:
  - HTML5
  - SASS/CSS3
  - Vanilla JavaScript
  - Modern CSS Features (Custom Properties, Container Queries)

- **Build Tools**:
  - Node.js
  - NPM for package management
  - SASS compiler

- **Version Control**:
  - Git
  - GitHub for hosting

## Development Environment

- **Code Editor**: Cursor IDE
- **Browser DevTools**: Chrome/Firefox for debugging
- **Terminal**: zsh shell
- **OS**: macOS 24.4.0

## Dependencies

- **SASS**: Latest version for CSS preprocessing
- **PostCSS**: For CSS post-processing and optimization
- **Autoprefixer**: For cross-browser compatibility
- **Node-SASS**: For SASS compilation
- **NPM Scripts**: For build and development tasks

## Technical Constraints

- Must support modern browsers (Chrome, Firefox, Safari, Edge)
- Must work without JavaScript for core functionality
- Must maintain WCAG 2.1 AA accessibility standards
- Must optimize for mobile devices
- Must follow progressive enhancement principles

## Build & Deployment

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Compile SASS
npm run sass:compile

# Check SASS for errors
npm run sass:check
```

### Production

```bash
# Build for production
npm run build

# Deploy to production
npm run deploy
```

## SASS Architecture

```
src/
├── sass/
│   ├── _base.scss
│   ├── _breakpoints.scss
│   ├── _css-variables.scss
│   ├── _functions.scss
│   ├── _layout.scss
│   ├── _mixins.scss
│   ├── _tokens.scss
│   └── _variables.scss
├── components/
│   ├── content/
│   │   ├── Header/
│   │   ├── Projects/
│   │   └── Work/
│   └── Tools/
│       ├── Bingo/
│       ├── ConflictMediation/
│       ├── Snake/
│       └── ToolsSection/
└── theme/
    ├── _theme-switch.scss
    └── _vignette.scss
```

## Performance Considerations

- Optimize images and assets
- Minimize CSS and JavaScript
- Use appropriate caching strategies
- Implement lazy loading where appropriate
- Monitor bundle sizes
- Use CSS containment for performance
- Implement will-change hints judiciously

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

## Accessibility

- ARIA labels where necessary
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Reduced motion support
- Focus management
- Semantic HTML

## File References

- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `webpack.config.js`: Webpack configuration
- `src/sass/_tokens.scss`: Design tokens
- `src/sass/_mixins.scss`: Reusable mixins
- `src/sass/_breakpoints.scss`: Breakpoint definitions
- `src/sass/_css-variables.scss`: CSS variables
