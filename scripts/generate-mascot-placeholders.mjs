/**
 * Generate 64x64 pixel-art placeholder mascot PNGs.
 * Each pose has a distinct cat silhouette using the AquaClaw warm palette.
 *
 * Colors:
 *   #FF6B35 - primary orange (body)
 *   #F7C948 - golden yellow (belly/face)
 *   #2D1B0E - dark brown (outline/eyes)
 *   #FFFFFF - white (eyes highlight)
 *   #FF8C94 - coral pink (nose/cheeks)
 *   #E55A25 - dark orange (stripes)
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('public/mascot', { recursive: true });

// Color palette as RGBA
const C = {
  transparent: [0, 0, 0, 0],
  outline: [45, 27, 14, 255],      // #2D1B0E
  body: [255, 107, 53, 255],       // #FF6B35
  belly: [247, 201, 72, 255],      // #F7C948
  stripe: [229, 90, 37, 255],      // #E55A25
  nose: [255, 140, 148, 255],      // #FF8C94
  eyeWhite: [255, 255, 255, 255],
  eyePupil: [45, 27, 14, 255],
};

function createPixelBuffer(width, height, drawFn) {
  const buf = Buffer.alloc(width * height * 4, 0); // RGBA, all transparent
  const setPixel = (x, y, [r, g, b, a]) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = (y * width + x) * 4;
    buf[idx] = r;
    buf[idx + 1] = g;
    buf[idx + 2] = b;
    buf[idx + 3] = a;
  };
  const fillRect = (x0, y0, w, h, color) => {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++)
        setPixel(x0 + dx, y0 + dy, color);
  };
  drawFn({ setPixel, fillRect });
  return buf;
}

function drawCatBase({ setPixel, fillRect }) {
  // Ears (triangular)
  // Left ear
  fillRect(16, 6, 8, 2, C.outline);
  fillRect(17, 4, 6, 2, C.outline);
  fillRect(18, 2, 4, 2, C.outline);
  fillRect(18, 4, 4, 2, C.body);
  // Right ear
  fillRect(40, 6, 8, 2, C.outline);
  fillRect(41, 4, 6, 2, C.outline);
  fillRect(42, 2, 4, 2, C.outline);
  fillRect(42, 4, 4, 2, C.body);

  // Head (round)
  fillRect(14, 8, 36, 2, C.outline);    // top
  fillRect(12, 10, 40, 16, C.body);     // main head
  fillRect(14, 8, 36, 2, C.body);       // top fill

  // Eyes
  fillRect(20, 14, 6, 4, C.eyeWhite);
  fillRect(38, 14, 6, 4, C.eyeWhite);
  fillRect(22, 15, 3, 3, C.eyePupil);
  fillRect(40, 15, 3, 3, C.eyePupil);
  // Eye highlights
  setPixel(22, 15, C.eyeWhite);
  setPixel(40, 15, C.eyeWhite);

  // Nose
  fillRect(30, 19, 4, 2, C.nose);

  // Mouth
  fillRect(28, 22, 2, 1, C.outline);
  fillRect(34, 22, 2, 1, C.outline);
  fillRect(30, 23, 4, 1, C.outline);

  // Cheeks
  fillRect(16, 20, 4, 2, C.nose);
  fillRect(44, 20, 4, 2, C.nose);

  // Body (chunky Garfield-style)
  fillRect(14, 26, 36, 20, C.body);

  // Belly
  fillRect(22, 30, 20, 12, C.belly);

  // Stripes on body
  fillRect(16, 28, 4, 2, C.stripe);
  fillRect(44, 28, 4, 2, C.stripe);
  fillRect(16, 34, 4, 2, C.stripe);
  fillRect(44, 34, 4, 2, C.stripe);

  // Legs
  fillRect(16, 46, 8, 10, C.body);
  fillRect(40, 46, 8, 10, C.body);
  // Feet
  fillRect(14, 54, 12, 4, C.body);
  fillRect(38, 54, 12, 4, C.body);

  // Outline feet
  fillRect(14, 58, 12, 2, C.outline);
  fillRect(38, 58, 12, 2, C.outline);

  // Tail (sticking out right side)
  fillRect(50, 38, 6, 4, C.body);
  fillRect(54, 34, 4, 6, C.body);
  fillRect(56, 32, 4, 4, C.body);
}

function drawDefault(ctx) {
  drawCatBase(ctx);
}

function drawWaving(ctx) {
  drawCatBase(ctx);
  const { fillRect } = ctx;
  // Right arm raised (waving)
  fillRect(48, 28, 4, 4, C.body);
  fillRect(50, 24, 4, 4, C.body);
  fillRect(52, 20, 4, 4, C.body);
  // Paw at top
  fillRect(52, 18, 6, 3, C.belly);
  // Small sparkle
  fillRect(56, 14, 2, 2, C.belly);
  fillRect(58, 16, 2, 2, C.belly);
}

function drawThinking(ctx) {
  drawCatBase(ctx);
  const { fillRect, setPixel } = ctx;
  // Right arm up to chin
  fillRect(46, 24, 4, 6, C.body);
  fillRect(44, 22, 4, 4, C.body);
  // Thought bubble dots
  fillRect(52, 8, 2, 2, C.eyeWhite);
  fillRect(54, 4, 3, 3, C.eyeWhite);
  fillRect(56, 0, 4, 4, C.eyeWhite);
  // Changed eye expression: one pupil shifted
  fillRect(23, 15, 3, 3, C.eyePupil);  // looking up-right
  fillRect(41, 14, 3, 3, C.eyePupil);
}

function drawSleeping(ctx) {
  drawCatBase(ctx);
  const { fillRect } = ctx;
  // Closed eyes (overwrite open eyes with body color then draw lines)
  fillRect(20, 14, 6, 4, C.body);  // cover left eye
  fillRect(38, 14, 6, 4, C.body);  // cover right eye
  // Closed eye lines
  fillRect(20, 16, 6, 1, C.outline);
  fillRect(38, 16, 6, 1, C.outline);
  // Z's for sleeping
  fillRect(50, 6, 6, 1, C.belly);
  fillRect(53, 7, 1, 1, C.belly);
  fillRect(50, 8, 6, 1, C.belly);
  fillRect(54, 2, 4, 1, C.belly);
  fillRect(56, 3, 1, 1, C.belly);
  fillRect(54, 4, 4, 1, C.belly);
}

const poses = [
  { name: 'default', draw: drawDefault },
  { name: 'waving', draw: drawWaving },
  { name: 'thinking', draw: drawThinking },
  { name: 'sleeping', draw: drawSleeping },
];

for (const { name, draw } of poses) {
  const buf = createPixelBuffer(64, 64, draw);
  await sharp(buf, { raw: { width: 64, height: 64, channels: 4 } })
    .png()
    .toFile(`public/mascot/mascot-${name}.png`);
  console.log(`Created public/mascot/mascot-${name}.png`);
}

console.log('All mascot placeholders generated.');
