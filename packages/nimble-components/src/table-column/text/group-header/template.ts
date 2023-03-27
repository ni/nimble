import { html } from '@microsoft/fast-element';
import type { TableColumnTextGroupHeaderView } from '.';
import type { TableColumnTextColumnConfig } from '..';
import { removeTitle, setTitleWhenOverflow } from '../template-helpers';

const getHeaderContent = (
    groupHeaderValue: string | null | undefined,
    columnConfig: TableColumnTextColumnConfig
): string => {
    return typeof groupHeaderValue === 'string'
        ? groupHeaderValue
        : columnConfig.placeholder;
};
export const template = html<TableColumnTextGroupHeaderView>`
    <span
        class="${x => (typeof x.groupHeaderValue === 'string' ? '' : 'placeholder')}"
        @mouseover="${(x, c) => setTitleWhenOverflow(
        c.event.target as HTMLElement,
        getHeaderContent(x.groupHeaderValue, x.columnConfig)
    )}"
        @mouseout="${(_x, c) => removeTitle(c.event.target as HTMLElement)}"
    >
        ${x => getHeaderContent(x.groupHeaderValue, x.columnConfig)}
    </span>
`;
