import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple SVG icon template
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.1}" fill="#4f46e5"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.3}" fill="white"/>
  <text x="${size/2}" y="${size/2 + size * 0.05}" font-family="Arial, sans-serif" font-size="${size * 0.3}" 
        fill="#4f46e5" text-anchor="middle" dominant-baseline="middle">L</text>
</svg>
`;

// Create icons directory
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons for different sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent.trim());
  console.log(`Generated ${filename}`);
});

console.log('All PWA icons generated successfully!');