import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch();
try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = process.env.STORYBOOK_URL ?? 'http://localhost:6006';
    const openStory = async (id, args = {}) => {
        const query = new URLSearchParams({ id, viewMode: 'story' });
        if (Object.keys(args).length > 0) {
            query.set('args', Object.entries(args).map(([key, value]) => `${key}:${value}`).join(';'));
        }
        await page.goto(`${base}/iframe.html?${query}`);
    };
    const summary = text => page.locator('ok-fv-edit-commit-bar .summary').filter({ hasText: text }).waitFor();
    const row = id => page.locator(`nimble-table-row[record-id="asset-${id}"]`);
    const location = () => page.getByRole('textbox', { name: /^Location/ });

    await openStory('ok-patterns-split-pane-bulk-edit--split-pane-bulk-edit');
    await row(1).waitFor();
    await page.getByRole('heading', { name: 'Edit', exact: true }).waitFor();
    assert.equal(await page.locator('.view-fields').count(), 0);
    await summary('No pending changes');
    assert.equal(await page.getByRole('button', { name: 'View selected assets', exact: true }).isDisabled(), false);
    await page.getByRole('button', { name: 'View selected assets', exact: true }).click();
    await page.getByRole('button', { name: 'Edit selected assets', exact: true }).waitFor();
    await page.getByRole('heading', { name: 'View', exact: true }).waitFor();
    assert.equal(await page.locator('.view-fields').count(), 0);
    assert.equal(await page.locator('ok-fv-edit-commit-bar .summary').count(), 0);
    await page.getByRole('button', { name: 'Edit selected assets', exact: true }).click();
    await page.getByRole('heading', { name: 'Edit', exact: true }).waitFor();
    await page.locator('nimble-button[aria-label="View selected assets"] nimble-icon-eye').waitFor();
    assert.equal(await page.locator('nimble-table').evaluate(table => table.checkValidity()), true);
    assert.equal(await page.locator('.bulk-edit-example').evaluate(el => el.getBoundingClientRect().width), 1440);
    assert.equal(await page.locator('ok-fv-search-input[aria-label="Search assets"]').getAttribute('appearance'), 'underline');
    await row(1).click();
    await page.getByRole('heading', { name: 'Edit — 1 row' }).waitFor();
    await row(2).click();
    await page.getByRole('heading', { name: 'Edit — 2 rows' }).waitFor();
    assert.match(await location().getAttribute('aria-label'), /Mixed values.*overwrite all/);
    await location().fill('Shared lab');
    await summary('1 unsaved change in 2 rows');
    await page.locator('nimble-table-row nimble-icon-circle-filled[aria-label="Unsaved changes"]').nth(1).waitFor();
    assert.equal(await page.locator('nimble-table-row').filter({ has: page.locator('nimble-icon-circle-filled[aria-label="Unsaved changes"]') }).count(), 2);
    assert.equal(await page.locator('.top-toolbar').getByRole('button', { name: 'Save', exact: true }).count(), 1);
    assert.equal(await page.locator('.top-toolbar').getByRole('button', { name: 'Revert', exact: true }).count(), 1);
    assert.equal(await page.locator('.top-toolbar').getByRole('button', { name: 'Deselect all', exact: true }).count(), 1);
    const demo = await page.locator('.demo-actions').boundingBox();
    const deselect = await page.locator('.top-toolbar').getByRole('button', { name: 'Deselect all', exact: true }).boundingBox();
    assert.ok(demo.x < deselect.x);
    await page.getByRole('button', { name: 'View selected assets', exact: true }).click();
    await page.getByRole('button', { name: 'Edit selected assets', exact: true }).waitFor();
    await page.getByRole('heading', { name: 'View — 2 rows' }).waitFor();
    await summary('1 unsaved change in 2 rows');
    await page.locator('.view-fields').waitFor({ state: 'visible' });
    await page.locator('nimble-button[aria-label="Edit selected assets"] nimble-icon-pencil').waitFor();
    await page.locator('.view-fields').getByText('Multiple values', { exact: true }).first().waitFor();
    assert.equal(await page.locator('.view-field').filter({ has: page.locator('dt', { hasText: 'Location' }) }).locator('dd').textContent(), 'Shared lab');
    assert.equal(await page.locator('[slot="secondary"] nimble-text-field:visible').count(), 0);
    assert.equal(await page.locator('.top-toolbar').getByRole('button', { name: 'Save', exact: true }).count(), 0);
    await page.getByRole('button', { name: 'Edit selected assets', exact: true }).click();
    await page.getByRole('button', { name: 'View selected assets', exact: true }).waitFor();
    await page.getByRole('heading', { name: 'Edit — 2 rows' }).waitFor();
    assert.equal(await page.locator('.view-fields').count(), 0);
    await summary('1 unsaved change in 2 rows');
    assert.equal(await location().inputValue(), 'Shared lab');

    const builder = page.locator('ok-fv-query-builder');
    assert.deepEqual(await builder.evaluate(el => [
        el.showNigelPrompt, el.allowSavedQueryCreation, el.allowSavedQueryEditing, el.allowSavedQueryDeletion
    ]), [false, true, true, true]);
    const openingFrames = await builder.evaluate(async element => {
        element.shadowRoot.querySelector('ok-fv-split-button').shadowRoot.querySelector('.split-button-primary').click();
        const frames = [];
        for (let frame = 0; frame < 12; frame += 1) {
            await new Promise(resolve => requestAnimationFrame(resolve));
            const popover = element.shadowRoot.querySelector('.query-popover');
            const regionStyle = getComputedStyle(element.queryPopoverRegion);
            if (!popover.hidden && regionStyle.opacity !== '0' && regionStyle.visibility !== 'hidden') {
                const bounds = popover.getBoundingClientRect();
                frames.push({ left: bounds.left, top: bounds.top });
            }
        }
        return frames;
    });
    assert.ok(openingFrames.length > 0);
    assert.ok(openingFrames.every(frame => Math.abs(frame.left - openingFrames.at(-1).left) <= 1
        && Math.abs(frame.top - openingFrames.at(-1).top) <= 1), 'Popover must not move after becoming visible');
    const assertQueryInViewport = async (timeout = 30000) => {
        await page.waitForFunction(() => {
            const el = document.querySelector('ok-fv-query-builder');
            const rect = el.shadowRoot.querySelector('.query-popover').getBoundingClientRect();
            return rect.width > 0 && rect.left >= -1 && rect.top >= -1
                && rect.right <= document.documentElement.clientWidth + 1
                && rect.bottom <= document.documentElement.clientHeight + 1;
        }, { timeout });
    };
    for (const viewport of [
        { width: 900, height: 650 },
        { width: 600, height: 650 },
        { width: 445, height: 600 },
        { width: 375, height: 600 },
        { width: 320, height: 600 },
        { width: 1440, height: 900 }
    ]) {
        await page.setViewportSize(viewport);
        await assertQueryInViewport();
        const footer = await builder.evaluate(el => {
            const query = el.shadowRoot.querySelector('.query-popover').getBoundingClientRect();
            const actions = ['cancel-query', 'done-manager', 'apply-query'].map(action => el.shadowRoot
                .querySelector(`[data-action="${action}"]`).getBoundingClientRect().toJSON());
            const secondary = el.shadowRoot.querySelector('.footer-secondary-actions').getBoundingClientRect();
            return { width: query.width, left: query.left, right: query.right, actions, secondaryTop: secondary.top };
        });
        assert.ok(footer.width <= 600);
        assert.equal(new Set(footer.actions.map(action => action.top)).size, 1);
        assert.ok(footer.actions.every(action => action.left >= footer.left && action.right <= footer.right));
        if (viewport.width >= 445) {
            assert.equal(footer.actions[0].top, footer.secondaryTop);
        }
    }
    await builder.evaluate(el => {
        el.style.position = 'fixed';
        el.style.bottom = '16px';
        el.queryPopoverRegion.update();
    });
    await assertQueryInViewport();
    await page.setViewportSize({ width: 900, height: 320 });
    await builder.evaluate(el => {
        el.style.removeProperty('bottom');
        el.style.top = '140px';
        el.queryPopoverRegion.update();
        window.dispatchEvent(new Event('resize'));
    });
    await assertQueryInViewport();
    await builder.evaluate(el => {
        el.style.removeProperty('position');
        el.style.removeProperty('bottom');
        el.style.removeProperty('top');
        el.queryPopoverRegion.update();
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await assertQueryInViewport();
    const setQuery = async root => {
        await builder.evaluate(async (el, node) => {
            el.queryEditor.query = { version: 1, root: node };
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }, root);
    };
    const available = { kind: 'predicate', fieldId: 'status', operatorId: 'is', value: 'Available' };
    await setQuery(available);
    const conditionEditor = builder.locator('ok-fv-query-editor');
    await conditionEditor.locator('[data-rule-id]').first().click();
    await conditionEditor.locator('[data-control="operator"]').click();
    await conditionEditor.getByRole('option', { name: 'Is not', exact: true }).click();
    await page.waitForFunction(() => {
        const editor = document.querySelector('ok-fv-query-builder').queryEditor;
        return editor.query.root.operatorId === 'is-not';
    });
    assert.equal(await conditionEditor.getByText('A value is required.', { exact: true }).isVisible(), false);
    assert.equal(await conditionEditor.evaluate(editor => editor.valid), true);
    assert.deepEqual(await conditionEditor.evaluate(editor => editor.query.root), { ...available, operatorId: 'is-not' });
    await setQuery(available);
    const queryInput = builder.locator('ok-fv-query-editor').getByRole('combobox', { name: 'Query conditions', exact: true });
    await page.setViewportSize({ width: 445, height: 600 });
    await builder.evaluate(element => {
        element.shadowRoot.querySelector('.query-popover').style.maxHeight = '140px';
    });
    await queryInput.fill('AND');
    await builder.getByRole('option', { name: 'AND Logical operator', exact: true }).waitFor();
    const suggestions = await builder.locator('ok-fv-query-editor').evaluate(editor => {
        const list = editor.shadowRoot.querySelector('.suggestions');
        const rect = list.getBoundingClientRect();
        return {
            topLayer: list.matches(':popover-open'),
            width: rect.width,
            right: rect.right,
            hit: editor.shadowRoot.elementFromPoint(rect.right - 10, rect.bottom - 10)?.className,
            bottom: rect.bottom,
            containerBottom: editor.getRootNode().querySelector('.query-popover').getBoundingClientRect().bottom
        };
    });
    assert.equal(suggestions.topLayer, true);
    assert.ok(suggestions.width < 300);
    assert.ok(suggestions.right <= 445);
    assert.equal(suggestions.hit, 'suggestion');
    assert.ok(suggestions.bottom > suggestions.containerBottom);
    await builder.getByRole('option', { name: 'AND Logical operator', exact: true }).click();
    await page.waitForFunction(() => {
        const editor = document.querySelector('ok-fv-query-builder').queryEditor;
        const input = editor.shadowRoot.querySelector('.query-input').shadowRoot.querySelector('input');
        return editor.queryInputText === '' && input.value === '';
    });
    assert.equal(await builder.getByRole('listbox').count(), 0);
    await setQuery(available);
    await builder.evaluate(element => {
        element.shadowRoot.querySelector('.query-popover').style.removeProperty('max-height');
    });
    await queryInput.fill('AND');
    await builder.getByRole('option', { name: 'AND Logical operator', exact: true }).waitFor();
    await queryInput.press('Escape');
    await builder.getByRole('option', { name: 'AND Logical operator', exact: true }).waitFor({ state: 'hidden' });
    assert.equal(await builder.getByRole('button', { name: 'Apply', exact: true }).isVisible(), true);
    await page.setViewportSize({ width: 1440, height: 900 });
    assert.equal(await page.locator('.table-footer').textContent(), '120 records2 pending');
    await builder.getByRole('button', { name: 'Apply', exact: true }).click();
    await page.locator('.table-footer').getByText('60 records', { exact: true }).waitFor();
    const filterBar = page.locator('ok-fv-filter-bar');
    assert.equal(await filterBar.locator('.filter-bar-expression').textContent(), 'Status Is Available');
    assert.equal(await filterBar.locator('.filter-bar-label').textContent(), '60 records');
    assert.equal(await filterBar.evaluate(element => element.previousElementSibling.classList.contains('table-tools')
        && element.nextElementSibling.classList.contains('table-body')), true);
    await filterBar.getByRole('button', { name: 'Edit filters: 60 records', exact: true }).click();
    await builder.getByRole('button', { name: 'Cancel', exact: true }).click();
    await filterBar.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await page.locator('.table-footer').getByText('120 records', { exact: true }).waitFor();
    assert.equal(await filterBar.locator('.filter-bar-expression').count(), 0);
    await filterBar.getByRole('button', { name: 'Edit filters: 120 records', exact: true }).click();
    await setQuery(available);
    await builder.getByRole('button', { name: 'Apply', exact: true }).click();
    await page.locator('.table-footer').getByText('60 records', { exact: true }).waitFor();
    await summary('1 unsaved change in 2 rows (1 hidden)');
    await setQuery({ kind: 'predicate', fieldId: 'status', operatorId: 'is', value: 'Maintenance' });
    await builder.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.locator('.table-footer').getByText('60 records', { exact: true }).waitFor();
    assert.equal(await filterBar.locator('.filter-bar-expression').textContent(), 'Status Is Available');
    await page.getByRole('textbox', { name: 'Search assets' }).fill('Precision DMM');
    await page.locator('.table-footer').getByText('20 records', { exact: true }).waitFor();
    await page.getByRole('textbox', { name: 'Search assets' }).fill('');
    await builder.getByRole('button', { name: 'Configure query', exact: true }).click();
    await setQuery({
        kind: 'group',
        combinator: 'and',
        children: [
            available,
            {
                kind: 'group',
                combinator: 'or',
                children: [
                    { kind: 'predicate', fieldId: 'name', operatorId: 'contains', value: 'precision dmm' },
                    { kind: 'predicate', fieldId: 'status', operatorId: 'is-not', value: 'Available' }
                ]
            }
        ]
    });
    await builder.getByRole('button', { name: 'Apply', exact: true }).click();
    await page.locator('.table-footer').getByText('20 records', { exact: true }).waitFor();
    await summary('1 unsaved change in 2 rows (1 hidden)');
    await builder.getByRole('button', { name: 'Clear all', exact: true }).click();
    await builder.getByRole('button', { name: 'Apply', exact: true }).click();
    await page.locator('.table-footer').getByText('120 records', { exact: true }).waitFor();
    await builder.getByRole('button', { name: 'Done', exact: true }).click();
    assert.equal(await location().inputValue(), 'Shared lab');

    const openQueryMenu = async () => {
        await builder.getByRole('button', { name: /^More actions for/ }).click();
    };
    await openQueryMenu();
    await builder.getByRole('menuitem', { name: 'Available assets', exact: true }).click();
    await page.locator('.table-footer').getByText('60 records', { exact: true }).waitFor();
    await summary('1 unsaved change in 2 rows (1 hidden)');
    await openQueryMenu();
    await builder.getByRole('menuitem', { name: 'Battery Lab assets', exact: true }).click();
    await page.locator('.table-footer').getByText('30 records', { exact: true }).waitFor();
    await openQueryMenu();
    await builder.getByRole('menuitem', { name: 'Create saved query', exact: true }).click();
    const queryName = builder.getByRole('textbox', { name: 'Name', exact: true });
    await queryName.fill('Lab copy');
    await builder.getByRole('button', { name: 'Save', exact: true }).click();
    await builder.getByRole('button', { name: 'Lab copy', exact: true }).waitFor();
    await page.locator('.table-footer').getByText('30 records', { exact: true }).waitFor();
    await queryName.fill('Renamed lab query');
    await builder.getByRole('button', { name: 'Save changes', exact: true }).click();
    await builder.getByRole('button', { name: 'Renamed lab query', exact: true }).waitFor();
    await builder.getByRole('button', { name: 'Delete', exact: true }).click();
    await builder.getByRole('button', { name: 'Delete query', exact: true }).click();
    await builder.getByRole('button', { name: 'Configure query', exact: true }).waitFor();
    await openQueryMenu();
    assert.equal(await builder.getByRole('menuitem', { name: 'Renamed lab query', exact: true }).count(), 0);
    await builder.getByRole('menuitem', { name: 'Current query', exact: true }).click();
    await builder.getByRole('button', { name: 'Configure query', exact: true }).click();
    await builder.getByRole('button', { name: 'Apply', exact: true }).click();
    await page.locator('.table-footer').getByText('120 records', { exact: true }).waitFor();
    await builder.getByRole('button', { name: 'Done', exact: true }).click();
    assert.equal(await location().inputValue(), 'Shared lab');

    await page.getByRole('textbox', { name: 'Search assets' }).fill('Precision DMM');
    await summary('1 unsaved change in 2 rows (1 hidden)');
    await row(7).waitFor();
    await row(7).click();
    await page.getByRole('button', { name: 'Keep editing', exact: true }).click();
    await page.getByRole('heading', { name: 'Edit — 2 rows' }).waitFor();
    assert.equal(await location().inputValue(), 'Shared lab');
    assert.equal(await row(1).getAttribute('aria-selected'), 'true');
    assert.equal(await row(7).getAttribute('aria-selected'), 'false');

    await page.getByRole('textbox', { name: 'Search assets' }).fill('no-matching-assets');
    await page.getByText('No records match the filters.', { exact: true }).waitFor();
    await summary('1 unsaved change in 2 rows (2 hidden)');
    await page.getByRole('textbox', { name: 'Search assets' }).fill('');
    await row(1).waitFor();
    await page.getByRole('tab', { name: 'Properties', exact: true }).click();
    await page.getByRole('textbox', { name: /^Notes/ }).fill('Shared notes');
    await page.getByRole('button', { name: 'Collapse edit pane', exact: true }).click();
    await page.getByRole('separator').waitFor({ state: 'detached' });
    await page.locator('nimble-button[aria-label="Expand edit pane"] nimble-icon-arrow-left-two-rectangles').waitFor();
    assert.equal(await page.getByRole('separator').count(), 0);
    await page.getByRole('button', { name: 'Expand edit pane', exact: true }).click();
    await page.locator('nimble-button[aria-label="Collapse edit pane"] nimble-icon-arrow-right-two-rectangles').waitFor();
    await page.locator('#bulk-properties-tab[aria-selected="true"]').waitFor();
    assert.equal(await page.getByRole('textbox', { name: /^Notes/ }).inputValue(), 'Shared notes');
    await page.getByRole('button', { name: 'Reset Notes', exact: true }).click();
    await page.getByRole('tab', { name: 'General', exact: true }).click();
    assert.equal(await location().inputValue(), 'Shared lab');

    await page.getByRole('button', { name: 'Clear Location', exact: true }).click();
    await page.getByRole('textbox', { name: 'Location. Will clear', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Reset Location', exact: true }).click();
    await summary('No pending changes');
    await location().fill('Shared lab');
    await page.getByRole('checkbox', { name: 'Fail next save', exact: true }).click();
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await page.locator('nimble-banner').filter({ hasText: 'Save failed. No records were changed' }).waitFor();
    assert.equal(await location().inputValue(), 'Shared lab');
    await summary('1 unsaved change in 2 rows');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await page.locator('nimble-banner').filter({ hasText: 'Saved changes to 2 rows.' }).waitFor();
    await summary('No pending changes');
    assert.equal(await location().inputValue(), 'Shared lab');
    await row(2).getByRole('cell', { name: 'Shared lab', exact: true }).waitFor();
    await page.getByRole('button', { name: 'View selected assets', exact: true }).click();
    await page.getByRole('heading', { name: 'View — 2 rows' }).waitFor();
    assert.equal(await page.locator('ok-fv-edit-commit-bar .summary').count(), 0);
    await page.getByRole('button', { name: 'Edit selected assets', exact: true }).click();
    await page.getByRole('heading', { name: 'Edit — 2 rows' }).waitFor();
    const workspace = page.getByRole('combobox', { name: /^Workspace/ });
    await workspace.click();
    await page.getByRole('option', { name: 'Validation', exact: true }).click();
    await summary('1 unsaved change in 2 rows');
    await page.getByRole('combobox', { name: 'Workspace. Changed', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Reset Workspace', exact: true }).click();
    await location().fill('Another lab');
    await page.getByRole('button', { name: 'Revert', exact: true }).click();
    await page.locator('nimble-banner').filter({ hasText: 'Pending changes reverted.' }).waitFor();
    assert.equal(await location().inputValue(), 'Shared lab');

    await location().fill('Discard me');
    await row(3).click();
    await page.getByRole('button', { name: 'Discard changes', exact: true }).click();
    await page.getByRole('heading', { name: 'Edit — 3 rows' }).waitFor();
    await summary('No pending changes');
    await page.getByRole('button', { name: 'Deselect all', exact: true }).click();
    await page.getByText('Select one or more rows to edit.', { exact: true }).waitFor();

    await row(1).locator('nimble-checkbox[aria-checked="false"]').waitFor();
    await row(1).getByRole('checkbox', { name: 'Select row', exact: true }).press('Space');
    await page.getByRole('heading', { name: 'Edit — 1 row' }).waitFor();
    await row(1).click({ modifiers: ['ControlOrMeta'] });
    await page.getByText('Select one or more rows to edit.', { exact: true }).waitFor();
    await row(1).locator('nimble-checkbox[aria-checked="false"]').waitFor();
    await row(1).click();
    await row(1).locator('nimble-checkbox[aria-checked="true"]').waitFor();
    await row(3).click({ modifiers: ['Shift'] });
    await page.getByRole('heading', { name: 'Edit — 3 rows' }).waitFor();
    await page.getByRole('textbox', { name: 'Search assets' }).fill('Precision DMM');
    await page.locator('.table-footer').getByText('20 records', { exact: true }).waitFor();
    await page.getByRole('checkbox', { name: 'Select all rows', exact: true }).click();
    await page.getByRole('heading', { name: 'Edit — 22 rows' }).waitFor();
    await page.getByRole('checkbox', { name: 'Select all rows', exact: true }).click();
    await page.getByRole('heading', { name: 'Edit — 2 rows' }).waitFor();
    await builder.getByRole('button', { name: 'Configure query', exact: true }).waitFor();

    await page.setViewportSize({ width: 900, height: 650 });
    const geometry = await page.locator('.bulk-edit-example').evaluate(el => {
        const table = el.querySelector('nimble-table').getBoundingClientRect();
        const footer = el.querySelector('.table-footer').getBoundingClientRect();
        const pane = el.querySelector('[slot="primary"]').getBoundingClientRect();
        const actions = el.querySelector('.table-actions').getBoundingClientRect();
        return { tableBottom: table.bottom, footerTop: footer.top, footerBottom: footer.bottom, paneBottom: pane.bottom, actionsRight: actions.right, paneRight: pane.right };
    });
    assert.ok(Math.abs(geometry.tableBottom - geometry.footerTop) < 2);
    assert.ok(Math.abs(geometry.footerBottom - geometry.paneBottom) < 2);
    assert.ok(Math.abs(geometry.actionsRight - (geometry.paneRight - 8)) < 2);

    const divider = page.getByRole('separator');
    const beforeDrag = Number(await divider.getAttribute('aria-valuenow'));
    const bounds = await divider.boundingBox();
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + 20);
    await page.mouse.down();
    await page.mouse.move(bounds.x + 25, bounds.y + 20);
    await page.mouse.up();
    await page.waitForFunction(value => document.querySelector('ok-fv-split-layout').position !== value, beforeDrag);

    const bulkEditFieldStory = 'ok-fv-bulk-edit-field--fv-bulk-edit-field';
    for (const [args, role] of [
        [{}, 'textbox'],
        [{ status: 'mixed' }, 'textbox'],
        [{ status: 'changed' }, 'textbox'],
        [{ status: 'will-clear' }, 'textbox'],
        [{ status: 'mixed', control: 'textarea' }, 'textbox'],
        [{ status: 'mixed', control: 'select' }, 'combobox'],
        [{ status: 'mixed', control: 'number' }, 'spinbutton']
    ]) {
        await openStory(bulkEditFieldStory, args);
        await page.getByRole(role, { name: /^Location/ }).waitFor();
    }

    await openStory('ok-fv-split-layout--fv-split-layout', { width: '445px' });
    const layout = page.locator('ok-fv-split-layout');
    await layout.waitFor();
    await page.waitForFunction(() => document.querySelector('ok-fv-split-layout').availableWidth === 445);
    const sizes = await layout.evaluate(el => ({
        height: el.getBoundingClientRect().height,
        primary: el.querySelector('[slot="primary"]').getBoundingClientRect().height,
        secondary: el.querySelector('[slot="secondary"]').getBoundingClientRect().width
    }));
    assert.equal(sizes.primary, sizes.height);
    assert.ok(sizes.secondary >= 299.9);
    const separator = page.getByRole('separator');
    await separator.press('End');
    assert.equal(await separator.getAttribute('aria-valuenow'), await separator.getAttribute('aria-valuemax'));
    await separator.press('Home');
    assert.equal(await separator.getAttribute('aria-valuenow'), await separator.getAttribute('aria-valuemin'));
    await openStory('ok-fv-edit-commit-bar--fv-edit-commit-bar', { width: '388px', changeCount: 2, affectedRowCount: 5 });
    await page.getByRole('button', { name: 'Save', exact: true }).waitFor();
    const actionsBelowText = await page.locator('ok-fv-edit-commit-bar').evaluate(el => {
        const text = el.shadowRoot.querySelector('.text').getBoundingClientRect();
        const actions = el.shadowRoot.querySelector('.actions').getBoundingClientRect();
        return actions.top >= text.bottom;
    });
    assert.equal(actionsBelowText, true);

    await page.setViewportSize({ width: 1440, height: 900 });
    await openStory('ok-patterns-split-pane-bulk-edit--split-pane-bulk-edit');
    await page.waitForFunction(() => window.__STORYBOOK_PREVIEW__?.currentRender?.phase === 'finished');
    const dragBuilder = page.locator('ok-fv-query-builder');
    await dragBuilder.waitFor();
    await dragBuilder.locator('.split-button-primary').click();
    await dragBuilder.locator('.popover-header').waitFor({ state: 'visible' });
    const dragHeader = await dragBuilder.locator('.popover-header').boundingBox();
    assert.ok(dragHeader);
    await page.mouse.move(dragHeader.x + 40, dragHeader.y + 15);
    await page.mouse.down();
    await page.mouse.move(2200, 1400, { steps: 10 });
    await page.mouse.up();
    await page.setViewportSize({ width: 800, height: 500 });
    await page.waitForTimeout(400);
    await page.setViewportSize({ width: 375, height: 500 });
    await page.waitForTimeout(750);
    const draggedPopover = await dragBuilder.locator('.query-popover').boundingBox();
    assert.ok(draggedPopover);
    assert.ok(draggedPopover.x >= -1
        && draggedPopover.x + draggedPopover.width <= 376
        && draggedPopover.y >= -1
        && draggedPopover.y + draggedPopover.height <= 501,
    `dragged query popover escaped the resized viewport: ${JSON.stringify(draggedPopover)}`);

    assert.deepEqual(errors, []);
    console.log('Bulk-edit workflow, accessible controls, pane sizing, and responsive actions passed.');
} finally {
    await browser.close();
}
