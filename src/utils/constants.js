import cvFile from "../assets/documents/cv.pdf";
import blueskyIcon from "../assets/images/bluesky.svg";

// This file will contain all the constants used in the application.

export const AUDIO_SOURCES = [
  // Primary: Local asset (most reliable and fast)
  "/assets/audio/knight-rider-theme.mp3",

  // Fallback 1: Archive.org source (if local not available)
  "https://archive.org/download/KnightRiderTheme/KnightRiderTheme.mp3",

  // Fallback 2: Another source (last resort)
  "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
];

export const SPOTIFY_PROFILE_URL =
  "https://spotify-github-profile.kittinanx.com/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&redirect=true";
export const SPOTIFY_IMAGE_URL =
  "https://spotify-github-profile.kittinanx.com/api/view.svg?uid=31skxfoaghlkljkdiluds3g3decy&cover_image=true&theme=default&show_offline=true&background_color=121212&interchange=true&bar_color=53b14f&bar_color_cover=true";

export const SOCIAL_MEDIA = [
  {
    keyword: "Email",
    icon: "fas fa-envelope-square",
    link: "mailto:alwoods@utexas.edu",
    tooltip: "Email: alwoods@utexas.edu",
  },
  {
    keyword: "LinkedIn",
    icon: "fab fa-linkedin",
    link: "https://www.linkedin.com/in/woods-aaron/",
    tooltip: "LinkedIn: woods-aaron",
  },
  {
    keyword: "GitHub",
    icon: "fab fa-github",
    link: "https://github.com/guitarbeat",
    tooltip: "GitHub: guitarbeat",
  },
  {
    keyword: "Instagram",
    icon: "fab fa-instagram",
    link: "https://www.instagram.com/guitarbeat/",
    tooltip: "Instagram: @guitarbeat",
  },
  {
    keyword: "Twitter",
    icon: "fab fa-x-twitter",
    link: "https://twitter.com/WoodsResearch",
    tooltip: "Twitter: @WoodsResearch",
  },
  // {
  //   keyword: "BlueSky",
  //   icon: "",
  //   customIcon: blueskyIcon,
  //   link: "https://bsky.app/profile/guitarbeat.bsky.social",
  //   tooltip: "BlueSky: @guitarbeat",
  // },
  {
    keyword: "CV",
    icon: "fas fa-file-alt",
    link: cvFile,
    tooltip: "Download my CV",
  },
  {
    keyword: "Google Scholar",
    icon: "fas fa-graduation-cap",
    link: "https://scholar.google.com/citations?user=85U8cEoAAAAJ&hl=en&authuser=1",
    tooltip: "View my Google Scholar profile",
  },
];
