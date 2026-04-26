import { createRequire } from 'module';
import { mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);

let puppeteer;
const p = 'C:/Users/Lenovo/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer';
puppeteer = require(p);

const [,, url = 'http://localhost:3000', label] = process.argv;
const screenshotDir = join(__dirname, 'temporary screenshots');
if (!existsSync(screenshotDir)) await mkdir(screenshotDir, { recursive: true });

const files = (await readdir(screenshotDir)).filter(f => /^screenshot-\d/.test(f));
const N = files.length + 1;
const filename = label ? `screenshot-${N}-${label}.png` : `screenshot-${N}.png`;
const outputPath = join(screenshotDir, filename);

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: outputPath, fullPage: true });
await browser.close();
console.log(`Saved: ${outputPath}`);
