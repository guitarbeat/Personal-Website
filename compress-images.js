const fs = require('fs');
const path = require('path');
// imagemin and its plugins are ESM-only, so we load them dynamically
const loadImagemin = async () => (await import('imagemin')).default;
const loadMozjpeg = async () => (await import('imagemin-mozjpeg')).default;
const loadPngquant = async () => (await import('imagemin-pngquant')).default;

const imagesDir = path.resolve(__dirname, 'src', 'assets', 'images');
const optimizedDir = path.join(imagesDir, 'optimized');

async function compressImages() {
  try {
    const imagemin = await loadImagemin();
    const imageminMozjpeg = await loadMozjpeg();
    const imageminPngquant = await loadPngquant();

    fs.mkdirSync(optimizedDir, { recursive: true });

    const files = await imagemin([`${imagesDir}/**/*.{jpg,jpeg,png}`], {
      destination: optimizedDir,
      plugins: [
        imageminMozjpeg({ quality: 75 }),
        imageminPngquant({ quality: [0.6, 0.8] }),
      ],
    });

    if (files.length === 0) {
      console.log('No images found to compress.');
    } else {
      console.log(`Compressed ${files.length} images to ${optimizedDir}.`);
    }
  } catch (error) {
    console.error('Image compression failed:', error);
    process.exitCode = 1;
  }
}

compressImages();
