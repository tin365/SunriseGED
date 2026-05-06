const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const chokidar = require('chokidar');
const FormData = require('form-data');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 7337;
const SCAN_FOLDER = process.env.SCAN_FOLDER || path.join(require('os').homedir(), 'Scans');
const ADMIN_API = process.env.ADMIN_API_URL || 'https://sunrisegeded.org/api';
const BRIDGE_TOKEN = process.env.BRIDGE_TOKEN;

app.use(cors({ origin: ['https://sunrisegeded.org', 'http://localhost:4321', 'http://127.0.0.1:4321'] }));
app.use(express.json());

app.get('/status', (req, res) => {
  res.json({ status: 'online', version: '1.0.0', scanFolder: SCAN_FOLDER });
});

app.post('/print', async (req, res) => {
  const { url, title } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Download failed with ${response.status}`);
    const tmpFile = path.join(require('os').tmpdir(), `sunrise-print-${Date.now()}.pdf`);
    const buffer = await response.buffer();
    fs.writeFileSync(tmpFile, buffer);

    const platform = process.platform;
    let cmd;
    if (platform === 'win32') cmd = `print /D:"%PRINTER%" "${tmpFile}"`;
    else if (platform === 'darwin') cmd = `lpr "${tmpFile}"`;
    else cmd = `lp "${tmpFile}"`;

    exec(cmd, (err) => {
      fs.rmSync(tmpFile, { force: true });
      if (err) return res.status(500).json({ error: 'Print failed', detail: err.message });
      res.json({ success: true, message: `Printed: ${title || path.basename(tmpFile)}` });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (!fs.existsSync(SCAN_FOLDER)) fs.mkdirSync(SCAN_FOLDER, { recursive: true });

chokidar.watch(SCAN_FOLDER, { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 1500 } }).on('add', async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.pdf', '.jpg', '.jpeg', '.png'].includes(ext)) return;
  if (!BRIDGE_TOKEN) return console.error('BRIDGE_TOKEN is missing; scan upload skipped.');

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('title', path.basename(filePath, ext));
    form.append('type', ext === '.pdf' ? 'document' : 'photo');

    const res = await fetch(`${ADMIN_API}/media/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${BRIDGE_TOKEN}` },
      body: form
    });
    if (res.ok) console.log(`Uploaded scan: ${path.basename(filePath)}`);
    else console.error(`Scan upload failed: ${res.status}`);
  } catch (err) {
    console.error(`Scan upload failed: ${err.message}`);
  }
});

app.listen(PORT, 'localhost', () => {
  console.log(`Sunrise Bridge running at http://localhost:${PORT}`);
  console.log(`Watching for scans in: ${SCAN_FOLDER}`);
});
