import { html, ref } from '@ni/fast-element';
import { keyEnter } from '@ni/fast-web-utilities';
import { tableTag, type Table } from '@ni/nimble-components/dist/esm//table';
import { ExTableColumnMultiStateButton, tableColumnMultiStateButtonTag } from '..';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '@ni/nimble-components/dist/esm/table/types';
import { TablePageObject } from '@ni/nimble-components/dist/esm/table/testing/table.pageobject';
import type { ExMultiStateButtonState } from '../types';
import type { ExTableColumnMultiStateButtonCellView } from '../cell-view';

interface SimpleTableRecord extends TableRecord {
    id?: string;
    field?: ExMultiStateButtonState | null;
}

/*
type MenuButtonColumnToggleEvent = (
    evt: CustomEvent<MenuButtonColumnToggleEventDetail>
) => void;
 */

class ElementReferences {
    public table!: Table;
    public column1!: ExTableColumnMultiStateButton;
}

fdescribe('ExTableColumnMultiStateButton', () => {
    let table: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let elementReferences: ElementReferences;
    let tablePageObject: TablePageObject<SimpleTableRecord>;
    let column: ExTableColumnMultiStateButton;

    async function setup(source: ElementReferences): Promise<Fixture<Table<SimpleTableRecord>>> {
        return await fixture<Table<SimpleTableRecord>>(
            html`<${tableTag} ${ref('table')} style="width: 700px">
                    <${tableColumnMultiStateButtonTag} ${ref('column1')} field-name="field">
                        Column 1
                    </${tableColumnMultiStateButtonTag}>
                </${tableTag}>`,
            { source }
        );
    }

    beforeEach(async () => {
        elementReferences = new ElementReferences();
        ({ connect, disconnect } = await setup(elementReferences));
        table = elementReferences.table;
        tablePageObject = new TablePageObject<SimpleTableRecord>(table);
        await connect();
        await waitForUpdatesAsync();
        column = elementReferences.column1;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(tableColumnMultiStateButtonTag)).toBeInstanceOf(
            ExTableColumnMultiStateButton
        );
    });

    it('reports column configuration valid', async () => {
        await connect();
        await waitForUpdatesAsync();

        expect(column.checkValidity()).toBeTrue();
    });

    it('renders a button', async () => {
        await table.setData([{ field: 'A' }]);
        await waitForUpdatesAsync();

        const cellView = tablePageObject.getRenderedCellView(0, 0) as ExTableColumnMultiStateButtonCellView;
        expect(cellView.button).not.toBeNull();
    });

    it('cell view tabbableChildren contains the button', async () => {
        await table.setData([{ field: 'A' }]);
        await waitForUpdatesAsync();

        const cellView = tablePageObject.getRenderedCellView(0, 0);
        expect(cellView.tabbableChildren.length).toEqual(1);
        const tabbableChild = cellView.tabbableChildren[0];
        expect(tabbableChild).toBeInstanceOf(HTMLButtonElement);
    });

    it('updating table data updates button state', async () => {
        await table.setData([{ field: 'A' }]);
        await waitForUpdatesAsync();
        await table.setData([{ field: 'B' }]);
        await waitForUpdatesAsync();

        const cellView = tablePageObject.getRenderedCellView(0, 0) as ExTableColumnMultiStateButtonCellView;
        expect(cellView.button!.classList).toContain('state-B');
    });

    describe('table selection does not change', () => {
        let button: HTMLButtonElement;

        beforeEach(async () => {
            table.idFieldName = 'id';
            table.selectionMode = 'multiple';
            await waitForUpdatesAsync();

            await table.setData([{ id: '0', field: 'A' }]);
            await waitForUpdatesAsync();
            const cellView = tablePageObject.getRenderedCellView(0, 0) as ExTableColumnMultiStateButtonCellView;
            button = cellView.button!;
        });

        it('when clicking a button', async () => {
            // Focus the button before calling click() because ordinarily a mouse click
            // would bring focus to the button, but calling click() directly does not.
            button.focus();
            button.click();
            await waitForUpdatesAsync();
            const selection = await table.getSelectedRecordIds();
            expect(selection.length).toBe(0);
        });

        it('when toggling a button by pressing Enter', async () => {
            // Focus the menu button before dispatching the event because a key event only makes sense on a focused element.
            button.focus();
            const event = new KeyboardEvent('keypress', {
                key: keyEnter
            });
            button.dispatchEvent(event);
            await waitForUpdatesAsync();
            const selection = await table.getSelectedRecordIds();
            expect(selection.length).toBe(0);
        });
    });
});
