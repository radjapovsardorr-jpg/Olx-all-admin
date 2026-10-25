import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectDir = __dirname;
const zipPath = path.join(projectDir, '..', 'olx-neo-admin.zip');
const desktopZip = path.join('C:', 'Users', 'Acer', 'Desktop', 'olx-neo-admin.zip');
const downloadsZip = path.join('C:', 'Users', 'Acer', 'Downloads', 'olx-neo-admin.zip');
const brainZip = path.join('C:', 'Users', 'Acer', '.gemini', 'antigravity', 'brain', '3695ef62-65ff-40c6-85d2-eb8d0288a367', 'olx-neo-admin.zip');

const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', {
  zlib: { level: 9 },
  forceZip64: false
});

output.on('close', function () {
  console.log(`ZIP created successfully! Size: ${archive.pointer()} bytes`);
  
  [desktopZip, downloadsZip, brainZip].forEach((target) => {
    try {
      fs.copyFileSync(zipPath, target);
      console.log(`Copied to: ${target}`);
    } catch (err) {
      console.error(`Copy error to ${target}:`, err.message);
    }
  });
});

archive.on('warning', function (err) {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on('error', function (err) {
  throw err;
});

archive.pipe(output);

// Exclude node_modules, .next, and temporary files
archive.glob('**/*', {
  cwd: projectDir,
  ignore: ['node_modules/**', '.next/**', 'create-zip.*', '*.log'],
  dot: true
});

archive.finalize();
