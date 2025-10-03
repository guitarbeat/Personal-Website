# Personal Website

This is a personal website designed to showcase my projects and career. The website features a blog section where I share updates on my research and experiences, as well as a publications section where I list my academic papers and presentations.

The website is built using HTML, Sass, JavaScript, and React. The design is clean and professional, with a focus on highlighting my skills and accomplishments. I hope you enjoy exploring my website and learning more about my work.

## Features

- Responsive design for mobile and desktop viewing
- Blog section with updates on research and experiences
- Publications section with academic papers and presentations
- Social media links in the header and footer for easy access
- Custom theme toggle for dark/light mode viewing
- Back to top button for easy navigation

## How to Use

To view the website, simply visit the link provided. The website is mobile-friendly and can be accessed on any device. Use the navigation bar at the top of the page to explore the different sections of the website. The blog and publications sections are organized by tags and date, and can be filtered using the search bar. Use the theme toggle in the top right corner of the page to switch between dark and light mode. Click the back to top button in the bottom right corner to quickly return to the top of the page.

## Future Plans

In the future, I plan to continue updating the blog and publications sections with new content. I also plan to add more features to the website, such as a contact form and a project gallery. Stay tuned for updates and new additions to the website.

## Development Notes

- Run `./setup.sh` after cloning to install dependencies.
- Run `npm run compress-images` to write optimized copies to `src/assets/images/optimized`.
- The same command also converts JPEG/PNG files to `.avif` using `imagemin-avif` (requires Node.js 18 or later).
- A pre-commit hook runs this command automatically.
- Consider using Git LFS for large image files.

## Project Structure

### Directory Overview

| Directory | Description | Key Files | Status |
|-----------|-------------|-----------|--------|
| `/src` | Main source code directory | `App.js`, `index.js` | ✅ Active |
| `/src/components` | React components organized by type | `content/`, `Core/`, `effects/`, `shared/` | ✅ Active |
| `/src/components/content` | Main page content components | `About/`, `Header/`, `NavBar/`, `Projects/`, `Work/` | ✅ Active |
| `/src/components/effects` | Visual effects and animations | `Blur/`, `Loading/`, `Matrix/`, `Moiree/` | ✅ Active |
| `/src/sass` | Styling and SCSS files | `main.scss`, theme files, utilities | ✅ Active |
| `/src/assets` | Static assets (images, audio, documents) | `images/`, `audio/`, `documents/` | ✅ Active |
| `/src/hooks` | Custom React hooks | `useMobileDetection.js`, `useScrollThreshold.js` | ✅ Active |
| `/src/utils` | Utility functions | `audioUtils.js`, `colorUtils.js`, `throttle.js` | ✅ Active |
| `/public` | Public static files | `index.html`, `favicon.ico` | ✅ Active |

### Project Structure Diagram

```
personal-website/
├── 📁 public/
│   ├── 📁 assets/audio/
│   ├── 📄 favicon.ico
│   └── 📄 index.html
├── 📁 src/
│   ├── 📄 App.js
│   ├── 📄 index.js
│   ├── 📁 assets/
│   │   ├── 📁 audio/
│   │   ├── 📁 documents/
│   │   └── 📁 images/
│   ├── 📁 components/
│   │   ├── 📁 content/
│   │   │   ├── 📁 About/
│   │   │   ├── 📁 Header/
│   │   │   ├── 📁 NavBar/
│   │   │   ├── 📁 Projects/
│   │   │   └── 📁 Work/
│   │   ├── 📁 Core/
│   │   │   ├── 📄 constants.js
│   │   │   └── 📄 ErrorBoundary.js
│   │   ├── 📁 effects/
│   │   │   ├── 📁 Blur/
│   │   │   ├── 📁 Loading/
│   │   │   ├── 📁 Matrix/
│   │   │   └── 📁 Moiree/
│   │   ├── 📁 shared/
│   │   │   └── 📄 ErrorDisplay.js
│   │   └── 📄 index.js
│   ├── 📁 hooks/
│   │   ├── 📄 useMobileDetection.js
│   │   └── 📄 useScrollThreshold.js
│   ├── 📁 sass/
│   │   ├── 📄 main.scss
│   │   ├── 📁 theme/
│   │   ├── 📁 utilities/
│   │   └── 📄 _*.scss (various SCSS modules)
│   ├── 📁 types/
│   │   └── 📄 declarations.d.ts
│   └── 📁 utils/
│       ├── 📄 audioUtils.js
│       ├── 📄 colorUtils.js
│       ├── 📄 printfulConfig.js
│       ├── 📄 printfulHelpers.js
│       └── 📄 throttle.js
├── 📄 package.json
├── 📄 README.md
├── 📄 TODO.md
├── 📄 setup.sh
└── 📄 *.config.js (various config files)
```

### Key Components

| Component | Location | Purpose | Status |
|-----------|----------|---------|--------|
| **App** | `src/App.js` | Main application component | ✅ Active |
| **About** | `src/components/content/About/` | About page content | ✅ Active |
| **Header** | `src/components/content/Header/` | Site header with navigation | ✅ Active |
| **Projects** | `src/components/content/Projects/` | Projects showcase | ✅ Active |
| **Work** | `src/components/content/Work/` | Work experience section | ✅ Active |
| **Matrix Effect** | `src/components/effects/Matrix/` | Matrix rain animation effect | ✅ Active |
| **Loading Effect** | `src/components/effects/Loading/` | Loading animations | ✅ Active |
| **Blur Effect** | `src/components/effects/Blur/` | Motion blur effects | ✅ Active |

## Analysis Tools

- **Motion Blur Analysis**: Run `./check-motion-blur.sh [commit-sha]` to analyze if a commit added motion blur functionality. See [check-motion-blur.README.md](check-motion-blur.README.md) for detailed usage.
