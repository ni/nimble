import { html, ref } from '@microsoft/fast-element';
import type { TableColumnMenuButtonCellView } from '.';
import { menuButtonTag } from '../../../menu-button';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';

// prettier-ignore
export const template = html<TableColumnMenuButtonCellView>`
    <${menuButtonTag}
        ${ref('menuButton')}
        appearance="${x => x.columnConfig?.appearance}"
        appearance-variant="${x => x.columnConfig?.appearanceVariant}"
        @beforetoggle="${(x, c) => x.onMenuButtonBeforeToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>)}"
    >
        ${x => x.cellRecord?.value}
        <slot name="menu" slot="menu"></slot>
    </${menuButtonTag}>
`;
