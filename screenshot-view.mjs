import { createRequire } from 'module';
import { mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/Lenovo/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');

const [,, url, label, clickSel] = process.argv;
const screenshotDir = join(__dirname, 'temporary screenshots');
const files = (await readdir(screenshotDir)).filter(f => /^screenshot-\d/.test(f));
const N = files.length + 1;
const outputPath = join(screenshotDir, `screenshot-${N}-${label||'view'}.png`);

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 500));
if (clickSel) {
  await page.click(clickSel);
  await new Promise(r => setTimeout(r, 600));
}
await page.screenshot({ path: outputPath });
await browser.close();
console.log(`Saved: ${outputPath}`);
