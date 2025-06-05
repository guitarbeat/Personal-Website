const fs = require('fs').promises;
const path = require('path');

// imagemin and its plugins are ESM-only, so they are loaded dynamically.
const loadImagemin = async () => (await import('imagemin')).default;
const loadMozjpeg = async () => (await import('imagemin-mozjpeg')).default;
const loadPngquant = async () => (await import('imagemin-pngquant')).default;

const imagesDir = path.resolve(__dirname, 'src', 'assets', 'images');
const outputDir = path.join(imagesDir, 'optimized');

async function listFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((d) => {
      const res = path.resolve(dir, d.name);
      return d.isDirectory() ? listFiles(res) : res;
    }),
  );
  return files.flat();
}

async function compressImages() {
  try {
    const allFiles = await listFiles(imagesDir);
    const images = allFiles.filter((f) => /\.(jpe?g|png)$/i.test(f));
    await fs.mkdir(outputDir, { recursive: true });

    if (images.length === 0) {
      return;

    await Promise.all(
      images.map(async (file) => {
        try {
          const data = await fs.readFile(file);
          const out = await imagemin.buffer(data, {
            plugins: [
              imageminMozjpeg({ quality: 75 }),
              imageminPngquant({ quality: [0.6, 0.8] }),
            ],
          });
          const rel = path.relative(imagesDir, file);
          const dest = path.join(outputDir, rel);
          await fs.mkdir(path.dirname(dest), { recursive: true });
          await fs.writeFile(dest, out);
        } catch (err) {
          console.error(`Failed to compress ${file}:`, err);
        }
      }),
    );

    console.log(`Compressed ${images.length} images to ${outputDir}.`);
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
