/**
 * Generate favicon files from the mascot default pose.
 * - src/app/favicon.ico (16x16 PNG data in .ico extension — Next.js accepts this)
 * - src/app/icon.png (32x32)
 * - src/app/apple-icon.png (180x180)
 *
 * All resizes use nearest-neighbor (kernel: 'nearest') to preserve pixel-art crispness.
 */
import sharp from 'sharp';
import { unlinkSync, existsSync } from 'fs';

const source = 'public/mascot/mascot-default.png';

// Remove public/favicon.ico if it exists (prevents precedence conflict)
if (existsSync('public/favicon.ico')) {
  unlinkSync('public/favicon.ico');
  console.log('Removed public/favicon.ico');
}

// Generate 16x16 favicon.ico (PNG data in .ico extension)
await sharp(source)
  .resize(16, 16, { kernel: 'nearest' })
  .png()
  .toFile('src/app/favicon.ico');
console.log('Created src/app/favicon.ico (16x16)');

// Generate 32x32 icon.png
await sharp(source)
  .resize(32, 32, { kernel: 'nearest' })
  .png()
  .toFile('src/app/icon.png');
console.log('Created src/app/icon.png (32x32)');

// Generate 180x180 apple-icon.png
await sharp(source)
  .resize(180, 180, { kernel: 'nearest' })
  .png()
  .toFile('src/app/apple-icon.png');
console.log('Created src/app/apple-icon.png (180x180)');

console.log('All favicon files generated.');
