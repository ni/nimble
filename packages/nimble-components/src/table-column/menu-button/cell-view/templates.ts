import { html, ref, when } from '@microsoft/fast-element';
import type { TableColumnMenuButtonCellView } from '.';
import { menuButtonTag } from '../../../menu-button';
import type { MenuButtonToggleEventDetail } from '../../../menu-button/types';
import { iconArrowExpanderDownTag } from '../../../icons/arrow-expander-down';
import { overflow } from '../../../utilities/directive/overflow';

// prettier-ignore
export const template = html<TableColumnMenuButtonCellView>`
    ${when(x => x.cellRecord?.value, html<TableColumnMenuButtonCellView>`
        <${menuButtonTag}
            ${ref('menuButton')}
            appearance="${x => x.columnConfig?.appearance}"
            appearance-variant="${x => x.columnConfig?.appearanceVariant}"
            @beforetoggle="${(x, c) => x.onMenuButtonBeforeToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>)}"
            title=${x => (x.hasOverflow && x.cellRecord!.value ? x.cellRecord!.value : null)}
        >
            <span class="value-label" ${overflow('hasOverflow')}>${x => x.cellRecord?.value}</span>
            <${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>

            <slot name="menu" slot="menu"></slot>
        </${menuButtonTag}>
    `)}
`;
