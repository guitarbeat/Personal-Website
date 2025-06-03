const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const imagesDir = path.resolve(__dirname, 'src', 'assets', 'images');

async function compressImages() {
  try {
    const files = await imagemin([`${imagesDir}/**/*.{jpg,jpeg,png}`], {
      destination: imagesDir,
      plugins: [
        imageminMozjpeg({ quality: 75 }),
        imageminPngquant({ quality: [0.6, 0.8] }),
      ],
    });

    if (files.length === 0) {
      console.log('No images found to compress.');
    } else {
      console.log(`Compressed ${files.length} images in place.`);
    }
  } catch (error) {
    console.error('Image compression failed:', error);
    process.exitCode = 1;
  }
}

compressImages();
