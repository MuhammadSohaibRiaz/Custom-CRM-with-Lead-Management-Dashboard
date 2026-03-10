import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

async function capture() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.setDefaultTimeout(120000);

    const BASE_URL = 'http://localhost:3007';

    try {
        console.log(`Navigating to ${BASE_URL}/login...`);
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 150000 });

        console.log('Waiting for login form...');
        await page.waitForSelector('input[type="email"]', { state: 'visible' });

        console.log('Filling login form with user credentials...');
        await page.fill('input[type="email"]', 'admin1@leadflow.io');
        await page.fill('input[type="password"]', '1234567890');

        console.log('Clicking Sign in button...');
        await page.click('button[type="submit"]');

        console.log('Waiting for Dashboard to load...');
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
            console.log(`Capturing ${target.name} at ${target.url}...`);
            await page.setViewportSize(target.viewport);
            await page.goto(`${BASE_URL}${target.url}`, { waitUntil: 'load', timeout: 150000 });

            // EXTREME: Remove any Next.js branding/indicators via script injection
            await page.evaluate(() => {
                const removeNextElements = () => {
                    // Normal DOM
                    const selectors = ['nextjs-portal', '[data-nextjs-portal]', '[data-nextjs-toast]', '[data-nextjs-indicator]', 'nextjs-static-indicator'];
                    selectors.forEach(s => {
                        document.querySelectorAll(s).forEach(el => el.remove());
                    });

                    // Check all elements for shadow roots (common for Next.js indicators)
                    const all = document.querySelectorAll('*');
                    all.forEach(el => {
                        if (el.shadowRoot) {
                            const shadowSelectors = ['nextjs-portal', '[data-nextjs-portal]', '.nextjs-static-indicator', '#nextjs-indicator'];
                            shadowSelectors.forEach(s => {
                                el.shadowRoot.querySelectorAll(s).forEach(subEl => subEl.remove());
                            });
                        }
                    });
                };
                removeNextElements();
                // Run it again after a short delay just in case
                setTimeout(removeNextElements, 1000);
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
