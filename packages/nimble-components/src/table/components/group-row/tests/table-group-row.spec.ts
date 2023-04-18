import { html } from '@microsoft/fast-element';
import { TableGroupRow } from '..';
import { createEventListener } from '../../../../utilities/tests/component';
import { fixture, Fixture } from '../../../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import {
    TableRowSelectionState,
    TableRowSelectionToggleEventDetail
} from '../../../types';

// prettier-ignore
async function setup(): Promise<Fixture<TableGroupRow>> {
    return fixture<TableGroupRow>(
        html`<nimble-table-group-row>
            </nimble-table-group-row>`
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
        // prettier-ignore
        expect(document.createElement('nimble-table-group-row')).toBeInstanceOf(TableGroupRow);
    });

    it('should have role of row', async () => {
        await connect();

        expect(element.getAttribute('role')).toBe('row');
    });

    it('clicking group row emits group-expand-toggle event', async () => {
        await connect();
        const groupExpandListener = createEventListener(
            element,
            'group-expand-toggle'
        );

        element.click();
        await groupExpandListener.promise;
        expect(groupExpandListener.spy).toHaveBeenCalledTimes(1);
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

        const listener = createEventListener(element, 'group-selection-toggle');
        element.selectionCheckbox!.click();
        await listener.promise;

        expect(listener.spy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableRowSelectionToggleEventDetail = {
            newState: true,
            oldState: false
        };
        const event = listener.spy.calls.first().args[0] as CustomEvent;
        expect(event.detail).toEqual(expectedDetails);
    });

    it('unchecking selection checkbox fires "group-selection-toggle" event', async () => {
        element.selectable = true;
        element.selectionState = TableRowSelectionState.selected;
        await connect();

        const listener = createEventListener(element, 'group-selection-toggle');
        element.selectionCheckbox!.click();
        await listener.promise;

        expect(listener.spy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableRowSelectionToggleEventDetail = {
            newState: false,
            oldState: true
        };
        const event = listener.spy.calls.first().args[0] as CustomEvent;
        expect(event.detail).toEqual(expectedDetails);
    });

    it('checking indeterminate selection checkbox fires "group-selection-toggle" event', async () => {
        element.selectable = true;
        element.selectionState = TableRowSelectionState.partiallySelected;
        await connect();

        const listener = createEventListener(element, 'group-selection-toggle');
        element.selectionCheckbox!.click();
        await listener.promise;

        expect(listener.spy).toHaveBeenCalledTimes(1);
        const expectedDetails: TableRowSelectionToggleEventDetail = {
            newState: true,
            oldState: false
        };
        const event = listener.spy.calls.first().args[0] as CustomEvent;
        expect(event.detail).toEqual(expectedDetails);
    });

    it('programmatically changing selection state does not fire "row-selection-toggle" event', async () => {
        element.selectable = true;
        element.selectionState = TableRowSelectionState.selected;
        await connect();

        const listener = createEventListener(element, 'group-selection-toggle');
        element.selectionState = TableRowSelectionState.notSelected;
        await waitForUpdatesAsync();

        expect(listener.spy).not.toHaveBeenCalled();
    });

    it('clicking selection checkbox does not fire "group-expand-toggle" event', async () => {
        element.selectable = true;
        await connect();

        const groupExpandListener = createEventListener(
            element,
            'group-expand-toggle'
        );
        element.selectionCheckbox!.click();
        await waitForUpdatesAsync();

        expect(groupExpandListener.spy).not.toHaveBeenCalled();
    });
});
