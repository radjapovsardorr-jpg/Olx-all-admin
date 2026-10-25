import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ZipArchive } from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectDir = __dirname;
const zipPath = path.join(projectDir, '..', 'olx-neo-admin.zip');
const desktopZip = path.join('C:', 'Users', 'Acer', 'Desktop', 'olx-neo-admin.zip');
const downloadsZip = path.join('C:', 'Users', 'Acer', 'Downloads', 'olx-neo-admin.zip');

// Clean up old files
[zipPath, desktopZip, downloadsZip].forEach((file) => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
    } catch (e) {}
  }
});

const output = fs.createWriteStream(zipPath);
const archive = new ZipArchive({
  zlib: { level: 9 },
  forceZip64: false
});

output.on('close', function () {
  const bytes = archive.pointer();
  console.log(`\n========================================`);
  console.log(` SUCCESS! ZIP FILE CREATED (${bytes} bytes)`);
  console.log(`========================================`);

  try {
    fs.copyFileSync(zipPath, desktopZip);
    console.log(`>>> Joylandi: ${desktopZip}`);
  } catch (err) {
    console.error(`Desktop copy error:`, err.message);
  }

  try {
    fs.copyFileSync(zipPath, downloadsZip);
    console.log(`>>> Joylandi: ${downloadsZip}`);
  } catch (err) {
    console.error(`Downloads copy error:`, err.message);
  }
  console.log(`\nEndi Desktopdagi "olx-neo-admin.zip" ni bemalol ochishingiz mumkin!\n`);
});

archive.on('error', function (err) {
  console.error('Archive error:', err);
  process.exit(1);
});

archive.pipe(output);

// Add 'src' directory
const srcPath = path.join(projectDir, 'src');
if (fs.existsSync(srcPath)) {
  archive.directory(srcPath, 'src');
}

// Add root configuration files
const rootFiles = [
  'package.json',
  'package-lock.json',
  'next.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'jsconfig.json',
  'README.md'
];

for (const file of rootFiles) {
  const filePath = path.join(projectDir, file);
  if (fs.existsSync(filePath)) {
    archive.file(filePath, { name: file });
  }
}

archive.finalize();
