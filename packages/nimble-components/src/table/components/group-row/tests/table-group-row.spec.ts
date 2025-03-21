import { html } from '@ni/fast-element';
import { TableGroupRow, tableGroupRowTag } from '..';
import { waitForEvent } from '../../../../utilities/testing/component';
import { fixture, type Fixture } from '../../../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import {
    TableRowSelectionState,
    type TableRowSelectionToggleEventDetail
} from '../../../types';

type TableRowSelectionToggleEventHandler = (
    evt: CustomEvent<TableRowSelectionToggleEventDetail>
) => void;

// prettier-ignore
async function setup(): Promise<Fixture<TableGroupRow>> {
    return await fixture<TableGroupRow>(
        html`<${tableGroupRowTag}>
            </${tableGroupRowTag}>`
    );
}

describe('TableGroupRow', () => {
    let element: TableGroupRow;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(tableGroupRowTag)).toBeInstanceOf(
            TableGroupRow
        );
    });

    it('should have role of row', async () => {
        await connect();

        expect(element.getAttribute('role')).toBe('row');
    });

    it('clicking group row emits group-expand-toggle event', async () => {
        await connect();
        const spy = jasmine.createSpy();
        const groupExpandListener = waitForEvent(
            element,
            'group-expand-toggle',
            spy
        );

        element.click();
        await groupExpandListener;
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('shows selection checkbox when row is selectable', async () => {
        await connect();
        element.selectable = true;
        await waitForUpdatesAsync();

        expect(element.selectionCheckbox).toBeDefined();
    });

    it('hides selection checkbox when row is not selectable', async () => {
        await connect();
        element.selectable = false;
        await waitForUpdatesAsync();

        expect(element.selectionCheckbox).not.toBeDefined();
    });

    it('selection checkbox is checked when group is selected', async () => {
        await connect();
        element.selectable = true;
        element.selectionState = TableRowSelectionState.selected;
        await waitForUpdatesAsync();

        expect(element.selectionCheckbox!.checked).toBeTrue();
        expect(element.selectionCheckbox!.indeterminate).toBeFalse();
    });

    it('selection checkbox is not checked when group is not selected', async () => {
        await connect();
        element.selectable = true;
        element.selectionState = TableRowSelectionState.notSelected;
        await waitForUpdatesAsync();

        expect(element.selectionCheckbox!.checked).toBeFalse();
        expect(element.selectionCheckbox!.indeterminate).toBeFalse();
    });

    it('selection checkbox is indeterminate when group is partially selected', async () => {
        await connect();
        element.selectable = true;
        element.selectionState = TableRowSelectionState.partiallySelected;
        await waitForUpdatesAsync();

        expect(element.selectionCheckbox!.indeterminate).toBeTrue();
    });

    it('selection state can be set before connect()', async () => {
        element.selectable = true;
        element.selectionState = TableRowSelectionState.partiallySelected;
        await connect();

        expect(element.selectionCheckbox!.indeterminate).toBeTrue();
    });

    it('checking selection checkbox fires "group-selection-toggle" event', async () => {
        element.selectable = true;
        element.selectionState = TableRowSelectionState.notSelected;
        await connect();

        const spy = jasmine.createSpy<TableRowSelectionToggleEventHandler>();
        const listener = waitForEvent(element, 'group-selection-toggle', spy);
        element.selectionCheckbox!.click();
        await listener;

        expect(spy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableRowSelectionToggleEventDetail = {
            newState: true,
            oldState: false
        };
        const event = spy.calls.first().args[0];
        expect(event.detail).toEqual(expectedDetails);
    });

    it('unchecking selection checkbox fires "group-selection-toggle" event', async () => {
        element.selectable = true;
        element.selectionState = TableRowSelectionState.selected;
        await connect();

        const spy = jasmine.createSpy<TableRowSelectionToggleEventHandler>();
        const listener = waitForEvent(element, 'group-selection-toggle', spy);
        element.selectionCheckbox!.click();
        await listener;

        expect(spy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableRowSelectionToggleEventDetail = {
            newState: false,
            oldState: true
        };
        const event = spy.calls.first().args[0];
        expect(event.detail).toEqual(expectedDetails);
    });

    it('checking indeterminate selection checkbox fires "group-selection-toggle" event', async () => {
        element.selectable = true;
        element.selectionState = TableRowSelectionState.partiallySelected;
        await connect();

        const spy = jasmine.createSpy<TableRowSelectionToggleEventHandler>();
        const listener = waitForEvent(element, 'group-selection-toggle', spy);
        element.selectionCheckbox!.click();
        await listener;

        expect(spy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableRowSelectionToggleEventDetail = {
            newState: true,
            oldState: false
        };
        const event = spy.calls.first().args[0];
        expect(event.detail).toEqual(expectedDetails);
    });

    it('programmatically changing selection state does not fire "row-selection-toggle" event', async () => {
        element.selectable = true;
        element.selectionState = TableRowSelectionState.selected;
        await connect();

        const spy = jasmine.createSpy();
        element.addEventListener('group-selection-toggle', spy);
        element.selectionState = TableRowSelectionState.notSelected;
        await waitForUpdatesAsync();

        expect(spy).not.toHaveBeenCalled();

        element.removeEventListener('group-selection-toggle', spy);
    });

    it('clicking selection checkbox does not fire "group-expand-toggle" event', async () => {
        element.selectable = true;
        await connect();

        const spy = jasmine.createSpy();
        element.addEventListener('group-expand-toggle', spy);
        element.selectionCheckbox!.click();
        await waitForUpdatesAsync();

        expect(spy).not.toHaveBeenCalled();
        element.removeEventListener('group-expand-toggle', spy);
    });

    it('has aria-expanded attribute set to "true" when it is expanded', async () => {
        element.expanded = true;
        await connect();

        expect(element.getAttribute('aria-expanded')).toBe('true');
    });

    it('has aria-expanded attribute set to "false" when it is not expanded', async () => {
        element.expanded = false;
        await connect();

        expect(element.getAttribute('aria-expanded')).toBe('false');
    });

    it('getFocusableElements() includes an empty array for cells', async () => {
        await connect();

        const focusableElements = element.getFocusableElements();
        expect(focusableElements.cells).toEqual([]);
    });

    it('getFocusableElements() includes the selection checkbox when row is selectable', async () => {
        element.selectable = true;
        await connect();

        const focusableElements = element.getFocusableElements();
        expect(focusableElements.selectionCheckbox).toBe(
            element.selectionCheckbox
        );
    });

    it('if row is set to selectable then subsequently not selectable, getFocusableElements() does not include a selection checkbox', async () => {
        element.selectable = true;
        await connect();
        await waitForUpdatesAsync();
        element.selectable = false;
        await waitForUpdatesAsync();

        const focusableElements = element.getFocusableElements();
        expect(focusableElements.selectionCheckbox).toBeUndefined();
    });
});
