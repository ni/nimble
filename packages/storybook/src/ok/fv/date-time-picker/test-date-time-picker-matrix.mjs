import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { chromium, firefox, webkit } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:6006';
const browsers = { chromium, firefox, webkit };
const browserName = process.env.BROWSER ?? 'chromium';
assert.ok(Object.hasOwn(browsers, browserName), `Unsupported browser: ${browserName}`);
const browser = await browsers[browserName].launch();
try {
    const hashes = [];
    for (const date of ['2024-11-13', '2024-11-15', '2026-03-20']) {
        const page = await browser.newPage({
            viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2, timezoneId: 'UTC'
        });
        await page.clock.setFixedTime(new Date(`${date}T12:00:00Z`));
        await page.goto(`${baseUrl}/iframe.html?id=tests-ok-fv-date-time-picker--popup-theme-matrix&viewMode=story`);
        await page.waitForFunction(() => ['finished', 'errored'].includes(window.__STORYBOOK_PREVIEW__?.currentRender?.phase));
        const result = await page.evaluate(() => ({
            phase: window.__STORYBOOK_PREVIEW__.currentRender.phase,
            pickers: [...document.querySelectorAll('ok-fv-date-time-picker')].map(picker => {
                const anchor = picker.shadowRoot.querySelector('.root').getBoundingClientRect();
                const popup = picker.region.getBoundingClientRect();
                return {
                    open: picker.region.matches(':popover-open'),
                    loaded: picker.region.classList.contains('loaded') && picker.region.style.opacity !== '0',
                    offset: [popup.left - anchor.left, popup.top - anchor.bottom],
                    today: [...picker.shadowRoot.querySelectorAll('[aria-current="date"]')]
                        .map(day => day.getAttribute('data-date'))
                };
            })
        }));
        assert.equal(result.phase, 'finished', `${date}: story failed`);
        assert.equal(result.pickers.length, 21);
        for (const picker of result.pickers) {
            assert.ok(picker.open && picker.loaded, `${date}: popup is not ready`);
            assert.ok(picker.offset.every(offset => Math.abs(offset) < 1), `${date}: popup is misaligned`);
            assert.deepEqual(picker.today, ['2024-11-14'], `${date}: incorrect today marker`);
        }
        const screenshot = await page.screenshot({ fullPage: true, animations: 'disabled' });
        hashes.push(createHash('sha256').update(screenshot).digest('hex'));
        if (date === '2024-11-15') {
            await page.evaluate(async () => {
                const render = window.__STORYBOOK_PREVIEW__.currentRender;
                await Promise.race([
                    render.story.playFunction({ canvasElement: render.canvasElement }),
                    new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Story interaction did not finish on rerun')), 5000);
                    })
                ]);
            });
            const rerun = await page.screenshot({ fullPage: true, animations: 'disabled' });
            assert.equal(createHash('sha256').update(rerun).digest('hex'), hashes.at(-1), 'Story rerun changed the snapshot');
        }
        await page.close();
    }
    assert.equal(new Set(hashes).size, 1, 'Matrix screenshots vary with the current date');
    console.log(`${browserName}: date-picker matrix is stable across current dates`);
} finally {
    await browser.close();
}
