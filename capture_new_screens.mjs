import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = path.join(__dirname, 'new_screenshots');

async function capture() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.setDefaultTimeout(120000);

    const BASE_URL = 'http://127.0.0.1:3005';

    try {
        console.log('Waiting for server...');
        await new Promise(r => setTimeout(r, 8000));

        console.log(`Logging in at ${BASE_URL}/login...`);
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 150000 });

        await page.fill('input[type="email"]', 'admin1@leadflow.io');
        await page.fill('input[type="password"]', '1234567890');
        await page.click('button[type="submit"]');

        // Wait for actual dashboard content
        console.log('Waiting for Dashboard content...');
        await page.waitForSelector('h1:has-text("Dashboard")', { timeout: 150000 });
        console.log('Logged in successfully.');

        const targets = [
            { name: 'dashboard-desktop', url: '/', viewport: { width: 1440, height: 900 } },
            { name: 'dashboard-mobile', url: '/', viewport: { width: 375, height: 812 } },
            { name: 'pipeline-desktop', url: '/pipeline', viewport: { width: 1440, height: 900 } },
            { name: 'leads-desktop', url: '/leads', viewport: { width: 1440, height: 900 } },
            { name: 'analytics-desktop', url: '/analytics', viewport: { width: 1440, height: 900 } },
            { name: 'analytics-mobile', url: '/analytics', viewport: { width: 375, height: 812 } },
        ];

        for (const target of targets) {
            console.log(`Capturing ${target.name}...`);
            await page.setViewportSize(target.viewport);
            await page.goto(`${BASE_URL}${target.url}`, { waitUntil: 'networkidle', timeout: 150000 });

            // EXTREME: Remove any Next.js branding/indicators via script injection
            await page.evaluate(() => {
                const removeNextElements = () => {
                    const selectors = [
                        'nextjs-portal',
                        '[data-nextjs-portal]',
                        '[data-nextjs-toast]',
                        '[data-nextjs-indicator]',
                        'nextjs-static-indicator',
                        '#nextjs-indicator',
                        '.nextjs-indicator',
                        '[class*="nextjs-indicator"]',
                        '[id*="nextjs-indicator"]'
                    ];
                    selectors.forEach(s => {
                        document.querySelectorAll(s).forEach(el => el.remove());
                    });

                    document.querySelectorAll('*').forEach(el => {
                        if (el.shadowRoot) {
                            selectors.forEach(s => {
                                el.shadowRoot.querySelectorAll(s).forEach(sub => sub.remove());
                            });
                        }
                    });
                };
                removeNextElements();
                setInterval(removeNextElements, 500);
            });

            await page.waitForTimeout(6000);

            const filePath = path.join(SCREENSHOT_DIR, `${target.name}.png`);
            await page.screenshot({ path: filePath, fullPage: true });
            console.log(`Saved ${target.name}.png`);
        }

    } catch (error) {
        console.error('Error during capture:', error);
    } finally {
        await browser.close();
    }
}

capture();
