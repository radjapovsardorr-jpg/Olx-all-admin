const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const projectDir = __dirname;
const zipPath = path.join(projectDir, '..', 'olx-neo-admin.zip');
const desktopZip = path.join('C:', 'Users', 'Acer', 'Desktop', 'olx-neo-admin.zip');
const downloadsZip = path.join('C:', 'Users', 'Acer', 'Downloads', 'olx-neo-admin.zip');

const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', {
  zlib: { level: 9 }, // Maximum standard Deflate compression
  forceZip64: false   // Standard 32-bit PKZip format, 100% compatible with Windows Explorer
});

output.on('close', function () {
  console.log(`ZIP created successfully: ${archive.pointer()} total bytes`);
  
  // Copy to Desktop and Downloads
  try {
    fs.copyFileSync(zipPath, desktopZip);
    console.log(`Copied to Desktop: ${desktopZip}`);
  } catch (err) {
    console.error('Desktop copy error:', err.message);
  }

  try {
    fs.copyFileSync(zipPath, downloadsZip);
    console.log(`Copied to Downloads: ${downloadsZip}`);
  } catch (err) {
    console.error('Downloads copy error:', err.message);
  }
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

// Append files from projectDir, excluding node_modules, .next, etc.
archive.glob('**/*', {
  cwd: projectDir,
  ignore: ['node_modules/**', '.next/**', 'create-zip.js', '*.log'],
  dot: true
});

archive.finalize();
