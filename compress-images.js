const path = require('path');
const imagemin = require('imagemin').default || require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg').default || require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant').default || require('imagemin-pngquant');

const imagesDir = path.resolve(__dirname, 'src', 'assets', 'images');

(async () => {
  const files = await imagemin([`${imagesDir}/*.{jpg,jpeg,png}`], {
    destination: imagesDir,
    plugins: [
      imageminMozjpeg({quality: 75}),
      imageminPngquant({quality: [0.6, 0.8]})
    ],
  });
  console.log(`Compressed ${files.length} images`);
})();
