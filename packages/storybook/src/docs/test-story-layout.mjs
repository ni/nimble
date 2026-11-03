import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch();
try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = process.env.STORYBOOK_URL ?? 'http://localhost:6006';
    const open = async (id, viewMode = 'docs') => {
        await page.goto(`${base}/iframe.html?${new URLSearchParams({ id, viewMode })}`);
    };

    await open('tests-story-layout--light-theme', 'story');
    const toc = page.getByRole('navigation', { name: 'Contents', exact: true });
    await toc.getByRole('link', { name: 'Resources', exact: true }).waitFor();
    assert.deepEqual(await toc.getByRole('link').allTextContents(), ['Overview', 'Usage', 'Guidance', 'Resources']);
    assert.equal(await toc.getByRole('link', { name: 'Outside page content' }).count(), 0);
    assert.equal(await toc.locator('li[data-level="3"]').textContent(), 'Guidance');

    const fixtureUrl = page.url();
    await toc.getByRole('link', { name: 'Resources', exact: true }).click();
    await page.waitForFunction(() => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1);
    await page.waitForFunction(() => document.querySelector('.story-table-of-contents [aria-current="location"]')?.textContent === 'Resources');
    assert.equal(page.url(), fixtureUrl);
    await page.evaluate(() => window.scrollTo(0, 0));
    await toc.locator('[aria-current="location"]').filter({ hasText: 'Overview' }).waitFor();

    for (const component of ['button', 'select', 'anchor-button']) {
        await open(`components-${component}--docs`);
        await toc.getByRole('link').first().waitFor();
        assert.equal(await page.getByRole('navigation').count(), 1);
        assert.equal(await page.locator('.story-page').count(), 1);
        if (component !== 'select') {
            assert.equal(await page.locator('.story-showcase-preview').count(), 5);
            assert.equal(await page.locator('.story-showcase-preview').first().evaluate(el => Boolean(el.closest('nimble-theme-provider'))), true);
            await toc.getByRole('link', { name: 'Appearances', exact: true }).waitFor();
        }
    }

    await open('components-checkbox--docs');
    await page.getByRole('navigation', { name: 'Table of contents', exact: true }).getByRole('link').first().waitFor();
    assert.equal(await page.locator('.story-page').count(), 0);

    await page.goto(`${base}/?path=/docs/components-button--docs`);
    const docs = page.frameLocator('#storybook-preview-iframe');
    const lastLink = docs.getByRole('navigation', { name: 'Contents', exact: true })
        .getByRole('link', { name: 'Alternatives to Consider', exact: true });
    await lastLink.waitFor();
    const hostUrl = page.url();
    const frameUrl = await docs.locator('body').evaluate(() => window.location.href);
    await lastLink.click();
    await docs.locator('.story-table-of-contents [aria-current="location"]').filter({ hasText: 'Alternatives to Consider' }).waitFor();
    assert.equal(page.url(), hostUrl);
    assert.equal(await docs.locator('body').evaluate(() => window.location.href), frameUrl);
    assert.deepEqual(errors, []);
} finally {
    await browser.close();
}
