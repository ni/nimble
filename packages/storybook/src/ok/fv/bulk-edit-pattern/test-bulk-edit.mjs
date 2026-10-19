import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch();
try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = process.env.STORYBOOK_URL ?? 'http://localhost:6006';
    const open = async id => {
        await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`);
    };
    const summary = text => page.locator('ok-fv-edit-commit-bar .summary').filter({ hasText: text }).waitFor();
    const row = id => page.locator(`nimble-table-row[record-id="asset-${id}"]`);
    const location = () => page.getByRole('textbox', { name: /^Location/ });

    await open('ok-patterns-split-pane-bulk-edit--split-pane-bulk-edit');
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
    await page.getByText('20 records', { exact: true }).waitFor();
    await page.getByRole('checkbox', { name: 'Select all rows', exact: true }).click();
    await page.getByRole('heading', { name: 'Edit — 22 rows' }).waitFor();
    await page.getByRole('checkbox', { name: 'Select all rows', exact: true }).click();
    await page.getByRole('heading', { name: 'Edit — 2 rows' }).waitFor();
    await page.getByRole('combobox', { name: 'Filter by status', exact: true }).waitFor();

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

    for (const [story, role] of [['fv-bulk-edit-field', 'textbox'], ['mixed', 'textbox'], ['changed', 'textbox'], ['will-clear', 'textbox'], ['text-area', 'textbox'], ['select', 'combobox'], ['number', 'spinbutton']]) {
        await open(`ok-fv-bulk-edit-field--${story}`);
        await page.getByRole(role, { name: /^Location/ }).waitFor();
    }

    await open('ok-fv-split-layout--narrow');
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
    await open('ok-fv-edit-commit-bar--narrow');
    await page.getByRole('button', { name: 'Save', exact: true }).waitFor();
    const actionsBelowText = await page.locator('ok-fv-edit-commit-bar').evaluate(el => {
        const text = el.shadowRoot.querySelector('.text').getBoundingClientRect();
        const actions = el.shadowRoot.querySelector('.actions').getBoundingClientRect();
        return actions.top >= text.bottom;
    });
    assert.equal(actionsBelowText, true);
    assert.deepEqual(errors, []);
    console.log('Bulk-edit workflow, accessible controls, pane sizing, and responsive actions passed.');
} finally {
    await browser.close();
}
