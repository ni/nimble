import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:6006';
const browser = await chromium.launch();
try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const response = await page.request.get(`${baseUrl}/index.json`);
    assert.ok(response.ok());
    const { entries } = await response.json();
    const stories = Object.values(entries).filter(entry => entry.type === 'story'
        && /query-(builder|editor)/.test(entry.id));
    assert.ok(stories.length > 0);
    for (const story of stories) {
        const errors = [];
        const onError = error => errors.push(error.message);
        page.on('pageerror', onError);
        await page.goto(`${baseUrl}/iframe.html?id=${story.id}&viewMode=story`);
        await page.waitForFunction(() => ['finished', 'errored'].includes(window.__STORYBOOK_PREVIEW__?.currentRender?.phase));
        const result = await page.evaluate(() => ({
            phase: window.__STORYBOOK_PREVIEW__.currentRender.phase,
            height: document.documentElement.scrollHeight,
            width: document.documentElement.scrollWidth,
            error: document.querySelector('#error-stack')?.textContent ?? ''
        }));
        assert.equal(result.phase, 'finished', `${story.id}: ${result.error}`);
        assert.deepEqual(errors, [], story.id);
        assert.ok(result.height < 16000, `${story.id}: ${result.height}px exceeds the matrix capture budget`);
        assert.ok(result.width <= 1440, `${story.id}: horizontal overflow`);
        if (story.id.startsWith('tests-ok-fv-query-builder--')) {
            const states = await page.locator('ok-fv-query-builder').evaluateAll(builders => builders.map(builder => {
                const bounds = builder.shadowRoot.querySelector('.query-popover').getBoundingClientRect();
                const cell = builder.parentElement.getBoundingClientRect();
                return {
                    name: builder.dataset.state,
                    selectedId: builder.selectedSavedQueryId,
                    open: builder.isManagerOpen,
                    contained: bounds.left >= cell.left && bounds.right <= cell.right
                        && bounds.top >= cell.top && bounds.bottom <= cell.bottom,
                    loaded: builder.queryPopoverRegion.classList.contains('loaded')
                };
            }));
            assert.ok(states.length > 0);
            for (const state of states) {
                if (state.open) {
                    assert.ok(state.loaded && state.contained, `${story.id}: misplaced popover for ${state.name}`);
                }
                if (state.name.includes('saved') || state.name.includes('menu') || [
                    'Delete confirmation', 'Save pending', 'Save error', 'Persistence unavailable', 'Saved-query menu'
                ].includes(state.name)) {
                    if (state.name !== 'Create saved query') {
                        assert.equal(state.selectedId, 'saved', `${story.id}: wrong selection for ${state.name}`);
                    }
                }
            }
        }
        console.log(`${story.id}: passed (${result.width} x ${result.height})`);
        page.off('pageerror', onError);
    }

    await page.goto(`${baseUrl}/iframe.html?id=ok-fv-query-builder--configurable&viewMode=story`);
    const builder = page.locator('ok-fv-query-builder');
    await builder.waitFor();
    await builder.locator('.split-button-primary').click();
    await page.waitForFunction(() => {
        const element = document.querySelector('ok-fv-query-builder');
        return element.queryPopoverRegion?.classList.contains('loaded');
    });
    const placement = await builder.evaluate(element => {
        const anchor = element.shadowRoot.querySelector('ok-fv-split-button').getBoundingClientRect();
        const popover = element.shadowRoot.querySelector('.query-popover').getBoundingClientRect();
        return {
            anchorBottom: anchor.bottom,
            popoverTop: popover.top,
            popoverBottom: popover.bottom,
            viewportHeight: document.documentElement.clientHeight
        };
    });
    assert.ok(
        placement.popoverTop >= placement.anchorBottom - 1,
        `configurable story popover opened above its anchor despite room below: ${JSON.stringify(placement)}`
    );
    assert.ok(
        placement.popoverBottom <= placement.viewportHeight + 1,
        `configurable story popover extends below the viewport: ${JSON.stringify(placement)}`
    );
    console.log('ok-fv-query-builder--configurable short-document placement: passed');
} finally {
    await browser.close();
}
