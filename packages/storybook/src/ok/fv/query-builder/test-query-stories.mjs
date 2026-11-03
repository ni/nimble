import assert from 'node:assert/strict';
import { chromium, webkit } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:6006';
const browsers = { chromium, webkit };
const browserName = process.env.BROWSER ?? 'chromium';
assert.ok(Object.hasOwn(browsers, browserName), `Unsupported browser: ${browserName}`);
const browser = await browsers[browserName].launch();
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
                    editing: builder.allowSavedQueryEditing,
                    savedQueryName: builder.savedQueryName,
                    nameInputValue: builder.shadowRoot.querySelector('[data-control="saved-query-name"]')?.value,
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
                if (state.name.startsWith('Nigel ') && state.name.includes('creation ')) {
                    if (state.editing) {
                        assert.equal(state.nameInputValue, 'Updated production tests', `${story.id}: rename missing for ${state.name}`);
                    } else {
                        assert.equal(state.nameInputValue, undefined, `${story.id}: unexpected rename input for ${state.name}`);
                        assert.equal(state.savedQueryName, 'Failed production tests', `${story.id}: unexpected rename for ${state.name}`);
                    }
                }
            }
        }
        console.log(`${story.id}: passed (${result.width} x ${result.height})`);
        page.off('pageerror', onError);
    }

    await page.goto(`${baseUrl}/iframe.html?id=ok-fv-query-editor--configurable&viewMode=story`);
    const editor = page.locator('ok-fv-query-editor');
    await editor.waitFor();
    await editor.evaluate(element => {
        element.query = { version: 1, root: null };
    });
    await editor.locator('.condition-chip').first().waitFor({ state: 'detached' });
    const input = editor.getByRole('combobox', { name: 'Query conditions', exact: true });
    const conditionPreview = editor.getByRole('button', { name: 'Add condition', exact: true });
    await input.focus();
    await conditionPreview.waitFor({ state: 'visible', timeout: 5000 });
    assert.equal(await editor.locator('.condition-chip-preview, .logic-chip-preview').count(), 1);
    await input.fill('status');
    await conditionPreview.waitFor({ state: 'detached' });
    await input.fill('');
    await conditionPreview.waitFor({ state: 'visible' });
    // macOS WebKit requires Option+Tab to include buttons in keyboard navigation.
    await input.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    assert.equal(await conditionPreview.evaluate(button => button.matches(':focus')), true);
    await conditionPreview.press('Enter');
    await editor.getByRole('dialog').waitFor();
    assert.equal(await editor.evaluate(element => element.editorRegion.anchorElement
        === element.shadowRoot.querySelector(`[data-rule-id="${element.activeRuleId}"]`)), true);
    assert.equal(await editor.locator('.condition-chip-preview, .logic-chip-preview').count(), 0);
    console.log('ok-fv-query-editor--configurable inline condition keyboard interaction: passed');

    await page.goto(`${baseUrl}/iframe.html?id=ok-fv-query-editor--configurable&viewMode=story`);
    await editor.waitFor();
    await editor.evaluate(element => {
        element.query = { version: 1, root: null };
    });
    await editor.locator('.condition-chip').first().waitFor({ state: 'detached' });
    await input.focus();
    await conditionPreview.waitFor({ state: 'visible' });
    const previewBounds = await conditionPreview.boundingBox();
    assert.ok(previewBounds);
    await page.mouse.move(previewBounds.x + previewBounds.width / 2, previewBounds.y + previewBounds.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(150);
    assert.equal(await conditionPreview.isVisible(), true);
    assert.equal(await editor.evaluate(element => element.ruleCount), 0);
    await page.mouse.move(0, 0);
    await page.mouse.up();
    assert.equal(await editor.evaluate(element => element.ruleCount), 0);
    await conditionPreview.click({ delay: 150 });
    await editor.getByRole('dialog').waitFor({ timeout: 5000 });
    assert.equal(await editor.evaluate(element => element.editorRegion.anchorElement
        === element.shadowRoot.querySelector(`[data-rule-id="${element.activeRuleId}"]`)), true);
    console.log('ok-fv-query-editor--configurable inline condition pointer interaction: passed');

    await page.goto(`${baseUrl}/iframe.html?id=ok-fv-query-editor--configurable&viewMode=story&args=layout:formatted`);
    await input.focus();
    const logicPreview = editor.locator('.logic-chip-preview');
    await logicPreview.waitFor({ state: 'visible' });
    await input.press('ArrowLeft');
    await conditionPreview.waitFor({ state: 'visible' });
    assert.deepEqual(await editor.evaluate(element => {
        const queryInput = element.shadowRoot.querySelector('.query-input');
        const preview = element.shadowRoot.querySelector('.condition-chip-preview');
        return {
            adjacent: queryInput.parentElement.nextElementSibling === preview,
            sameRow: queryInput.closest('.formatted-row') === preview.closest('.formatted-row'),
            previewCount: element.shadowRoot.querySelectorAll('.condition-chip-preview, .logic-chip-preview').length
        };
    }), { adjacent: true, sameRow: true, previewCount: 1 });
    await input.press('ArrowRight');
    await logicPreview.waitFor({ state: 'visible' });
    assert.equal(await editor.locator('.condition-chip-preview, .logic-chip-preview').count(), 1);
    const draftBeforeTab = await editor.evaluate(element => JSON.stringify(element.draft));
    await input.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    assert.equal(await logicPreview.evaluate(element => element.matches(':focus-within')), true);
    await logicPreview.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    assert.equal(await logicPreview.evaluate(element => element.matches(':focus-within')), false);
    assert.equal(await editor.evaluate(element => JSON.stringify(element.draft)), draftBeforeTab);
    await logicPreview.focus();
    await logicPreview.press('Enter');
    await conditionPreview.waitFor({ state: 'visible' });
    await conditionPreview.press('Space');
    await editor.getByRole('dialog').waitFor();
    assert.equal(await editor.evaluate(element => element.editorRegion.anchorElement
        === element.shadowRoot.querySelector(`[data-rule-id="${element.activeRuleId}"]`)), true);
    console.log('ok-fv-query-editor--configurable formatted caret and logic transition: passed');

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

    await page.evaluate(() => {
        const fixture = document.createElement('div');
        fixture.innerHTML = `
            <ok-fv-split-button label="Run query">
                <nimble-menu slot="menu"></nimble-menu>
            </ok-fv-split-button>
        `;
        document.body.append(fixture);
    });
    await page.locator('ok-fv-split-button[label="Run query"]')
        .getByRole('button', { name: 'Run query', exact: true })
        .waitFor();
    console.log('ok-fv-split-button multiline menu-only accessible name: passed');
} finally {
    await browser.close();
}
