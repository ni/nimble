import { html, ref, when } from '@microsoft/fast-element';
import type { TableColumnMenuButtonCellView } from '.';
import { menuButtonTag } from '../../../menu-button';
import { ButtonAppearance, type MenuButtonToggleEventDetail } from '../../../menu-button/types';
import { iconArrowExpanderDownTag } from '../../../icons/arrow-expander-down';
import { cellViewMenuSlotName } from '../types';

// prettier-ignore
export const template = html<TableColumnMenuButtonCellView>`
    ${when(x => x.cellRecord?.value, html<TableColumnMenuButtonCellView>`
        <${menuButtonTag}
            ${ref('menuButton')}
            appearance="${ButtonAppearance.ghost}"
            @beforetoggle="${(x, c) => x.onMenuButtonBeforeToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>)}"
            @mouseover="${x => x.onMenuButtonMouseOver()}"
            @mouseout="${x => x.onMenuButtonMouseOut()}"
            @click="${(x, c) => x.onMenuButtonClick(c.event)}"
            title=${x => (x.hasOverflow && x.cellRecord!.value ? x.cellRecord!.value : null)}
        >
            <span ${ref('valueSpan')} class="value-label">${x => x.cellRecord?.value}</span>
            <${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>

            <slot name="${cellViewMenuSlotName}" slot="menu"></slot>
        </${menuButtonTag}>
    `)}
`;
