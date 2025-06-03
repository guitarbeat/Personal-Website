const path = require('path');
const fs = require('fs/promises');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const imagesDir = path.resolve(__dirname, 'src', 'assets', 'images');
const optimizedDir = path.join(imagesDir, 'optimized');

async function compressImages() {
  try {
    await fs.mkdir(optimizedDir, { recursive: true });
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
      console.log(`Compressed ${files.length} images to ${optimizedDir}`);
    }
  } catch (error) {
    console.error('Image compression failed:', error);
    process.exitCode = 1;
  }
}

compressImages();
