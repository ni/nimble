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
        if (story.id === 'tests-ok-fv-query-editor--autocomplete-theme-matrix') {
            const assertAutocompleteAnchors = async () => {
                const menus = await page.locator('ok-fv-query-editor').evaluateAll(editors => editors.map(editor => {
                    const input = editor.shadowRoot.querySelector('.query-input').getBoundingClientRect();
                    const list = editor.shadowRoot.querySelector('.suggestions');
                    const menu = list.getBoundingClientRect();
                    return {
                        open: list.matches(':popover-open'),
                        horizontalOffset: menu.left - input.left,
                        verticalOffset: menu.top - input.bottom
                    };
                }));
                assert.equal(menus.length, 6);
                for (const menu of menus) {
                    assert.ok(menu.open, `${story.id}: autocomplete menu is closed`);
                    assert.ok(Math.abs(menu.horizontalOffset) < 1, `${story.id}: autocomplete is detached horizontally`);
                    assert.ok(Math.abs(menu.verticalOffset - 4) < 1, `${story.id}: autocomplete is detached vertically`);
                }
            };
            await assertAutocompleteAnchors();
            try {
                await page.evaluate(async () => {
                    document.querySelector('#storybook-root').style.paddingTop = '80px';
                    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                });
                await assertAutocompleteAnchors();
            } finally {
                await page.evaluate(async () => {
                    document.querySelector('#storybook-root').style.removeProperty('padding-top');
                    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                });
            }
            await assertAutocompleteAnchors();
        }
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
                    loaded: builder.queryPopoverRegion.classList.contains('loaded'),
                    actionMenuOpen: builder.shadowRoot.querySelector('.query-action-split-button')?.region?.matches(':popover-open'),
                    dirtyMenuItem: Boolean(builder.shadowRoot.querySelector('[data-saved-query-id="saved"] .dirty-indicator')),
                    dirtySplitButton: Boolean(builder.shadowRoot.querySelector('.queries-menu-button > [slot="end"] .dirty-indicator')),
                    actionMenuContained: (() => {
                        const menu = builder.shadowRoot.querySelector('.query-action-menu').getBoundingClientRect();
                        return menu.width > 0 && menu.height > 0 && menu.left >= cell.left && menu.right <= cell.right
                            && menu.top >= cell.top && menu.bottom <= cell.bottom;
                    })()
                };
            }));
            assert.ok(states.length > 0);
            for (const state of states) {
                if (story.id === 'tests-ok-fv-query-builder--features-theme-matrix') {
                    assert.ok(state.actionMenuOpen && state.actionMenuContained, `${story.id}: action menu not visible within cell for ${state.name}`);
                }
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
                        assert.ok(state.dirtyMenuItem && state.dirtySplitButton, `${story.id}: dirty indicators missing for ${state.name}`);
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
    const conditionEditor = page.locator('ok-fv-query-editor');
    await conditionEditor.locator('.condition-chip').first().click();
    const hint = conditionEditor.locator('.editor-hint');
    await hint.waitFor({ state: 'visible' });
    const activeRuleId = await conditionEditor.evaluate(element => element.activeRuleId);
    await hint.click();
    assert.equal(await conditionEditor.evaluate(element => element.activeRuleId), activeRuleId);
    await conditionEditor.locator('.editor-panel').click({ position: { x: 4, y: 4 } });
    assert.equal(await conditionEditor.evaluate(element => element.activeRuleId), activeRuleId);
    await conditionEditor.locator('.query-input').click();
    assert.equal(await conditionEditor.evaluate(element => element.activeRuleId), null);
    console.log('ok-fv-query-editor--configurable condition background clicks retain editor: passed');

    await conditionEditor.evaluate(element => {
        element.query = {
            version: 1,
            root: { kind: 'predicate', fieldId: 'duration', operatorId: 'greater-than', value: 500 }
        };
    });
    const chip = conditionEditor.locator('.condition-chip').first();
    await chip.click();
    const originalSummary = await chip.textContent();
    const originalBounds = await chip.boundingBox();
    const numberInput = conditionEditor.locator('[data-control="scalar-number"] input');
    await numberInput.fill('999999');
    assert.equal(await chip.textContent(), originalSummary);
    assert.deepEqual(await chip.boundingBox(), originalBounds);
    await numberInput.press('Escape');
    await page.waitForFunction(() => document.querySelector('ok-fv-query-editor').shadowRoot
        .querySelector('.condition-chip').textContent.includes('999999'));
    await chip.hover();
    const removeButton = chip.getByRole('button', { name: 'Remove', exact: true });
    const removeBounds = await removeButton.boundingBox();
    assert.ok(removeBounds);
    assert.equal(removeBounds.width, 16);
    assert.equal(removeBounds.height, 16);
    const cornersHitRemove = await removeButton.evaluate(button => {
        const rect = button.getBoundingClientRect();
        const root = button.getRootNode();
        return [-11.5, 11.5].every(x => [-11.5, 11.5].every(y => root.elementFromPoint(
            rect.left + rect.width / 2 + x,
            rect.top + rect.height / 2 + y
        ) === button));
    });
    assert.ok(cornersHitRemove, 'All corners of the 24px target must activate Remove');
    const iconBounds = await chip.locator('.remove-button nimble-icon-times').boundingBox();
    assert.ok(iconBounds);
    assert.equal(iconBounds.width, 16);
    assert.equal(iconBounds.height, 16);
    await page.mouse.click(removeBounds.x - 3.5, removeBounds.y - 3.5);
    await chip.waitFor({ state: 'detached' });
    assert.equal(await conditionEditor.evaluate(element => element.ruleCount), 0);
    assert.equal(await conditionEditor.evaluate(element => element.activeRuleId), null);
    console.log('ok-fv-query-editor--configurable frozen summary and chip removal: passed');

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
    await logicPreview.waitFor({ state: 'detached' });
    assert.equal(await editor.locator('.condition-chip-preview, .logic-chip-preview').count(), 0);
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
    await builder.locator('.queries-menu-button .split-button-primary').click();
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

    const popover = builder.locator('.query-popover');
    const editorField = builder.locator('ok-fv-query-editor .editor-field');
    const initialSize = await popover.boundingBox();
    const initialEditorSize = await editorField.boundingBox();
    assert.ok(initialSize);
    assert.ok(initialEditorSize);
    await page.mouse.move(initialSize.x + initialSize.width - 5, initialSize.y + initialSize.height - 5);
    await page.mouse.down();
    await page.mouse.move(initialSize.x + initialSize.width + 91, initialSize.y + initialSize.height + 75, { steps: 10 });
    await page.mouse.up();
    await page.waitForFunction(({ width, height }) => {
        const rect = document.querySelector('ok-fv-query-builder').shadowRoot.querySelector('.query-popover').getBoundingClientRect();
        return Math.abs(rect.width - width) < 1 && Math.abs(rect.height - height) < 1;
    }, { width: initialSize.width + 96, height: initialSize.height + 80 });
    const expandedEditor = await editorField.boundingBox();
    assert.ok(expandedEditor);
    assert.ok(expandedEditor.height > initialEditorSize.height + 30);
    await popover.focus();
    await popover.press('Shift+ArrowLeft');
    const editorBeforeShrink = await editorField.boundingBox();
    await popover.press('Shift+ArrowUp');
    const resized = await popover.boundingBox();
    assert.ok(resized);
    assert.equal(resized.width, initialSize.width + 84);
    assert.equal(resized.height, initialSize.height + 68);
    assert.equal((await editorField.boundingBox()).height, editorBeforeShrink.height - 12);
    const queryInput = builder.locator('ok-fv-query-editor .query-input');
    await queryInput.press('Shift+ArrowRight');
    assert.equal((await popover.boundingBox()).width, resized.width);
    await builder.locator('ok-fv-query-editor').evaluate(editor => {
        editor.layout = 'formatted';
    });
    await builder.locator('ok-fv-query-editor .editor-field[data-layout="formatted"]').waitFor();
    const formattedHeight = (await editorField.boundingBox()).height;
    await popover.focus();
    await popover.press('Shift+ArrowDown');
    assert.equal((await editorField.boundingBox()).height, formattedHeight + 12);
    await popover.press('Shift+ArrowUp');
    assert.equal((await editorField.boundingBox()).height, formattedHeight);
    await page.setViewportSize({ width: 375, height: 500 });
    await page.waitForFunction(() => {
        const rect = document.querySelector('ok-fv-query-builder').shadowRoot.querySelector('.query-popover').getBoundingClientRect();
        return rect.left >= 0 && rect.right <= 375 && rect.top >= 0 && rect.bottom <= 500;
    });
    await popover.focus();
    for (let i = 0; i < 40; i++) {
        await popover.press('Shift+ArrowLeft');
        await popover.press('Shift+ArrowUp');
    }
    const minimumSize = await popover.boundingBox();
    assert.equal(minimumSize.width, 320);
    assert.equal(minimumSize.height, 200);
    await builder.getByRole('button', { name: 'Cancel', exact: true }).click();
    await builder.locator('.queries-menu-button .split-button-primary').click();
    await popover.waitFor({ state: 'visible' });
    assert.equal((await popover.boundingBox()).width, minimumSize.width);
    assert.equal((await popover.boundingBox()).height, minimumSize.height);
    await page.setViewportSize({ width: 1440, height: 900 });
    console.log('ok-fv-query-builder--configurable pointer and keyboard resizing: passed');

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
