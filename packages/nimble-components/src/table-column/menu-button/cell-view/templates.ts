import { html } from '@microsoft/fast-element';
import type { TableColumnMenuButtonCellView } from '.';
import { menuButtonTag } from '../../../menu-button';

// prettier-ignore
export const template = html<TableColumnMenuButtonCellView>`
    <${menuButtonTag}
        appearance="${x => x.columnConfig?.appearance}"
        appearance-variant="${x => x.columnConfig?.appearanceVariant}"
    >
        ${x => x.cellRecord?.value}
    </${menuButtonTag}>
`;
