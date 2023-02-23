import { html } from '@microsoft/fast-element';
import type { TableColumnTextCellRecord, TableColumnTextColumnConfig } from '.';
import type { TableCellState } from '../../table/types';
import type { TextField } from '../../text-field';

const blurTextField = (cellContentContainer: HTMLElement): void => {
    // eslint-disable-next-line no-console
    console.log(
        'Event handler in column template. Handling cell-blur-option1 event raised on the cellContentContainer via a template binding.'
    );
    const textField = cellContentContainer.firstElementChild as TextField; // or cellContentContainer.querySelector(...)
    textField?.blur();
};

export const cellTemplate = html<
TableCellState<TableColumnTextCellRecord, TableColumnTextColumnConfig>
>`
    <template
        @cell-blur-option1="${(_, c) => blurTextField(c.event.currentTarget as HTMLElement)}"
    >
        <nimble-text-field
            value="${x => (typeof x.cellRecord.value === 'string'
        ? x.cellRecord.value
        : x.columnConfig.placeholder)}"
            current-value="${x => (typeof x.cellRecord.value === 'string'
        ? x.cellRecord.value
        : x.columnConfig.placeholder)}"
        >
        </nimble-text-field>
    </template>
`;
