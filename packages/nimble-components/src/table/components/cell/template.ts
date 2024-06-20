import { html, ref, when } from '@microsoft/fast-element';
import type { TableCell } from '.';
import { iconThreeDotsLineTag } from '../../../icons/three-dots-line';
import { menuButtonTag } from '../../../menu-button';
import {
    ButtonAppearance,
    MenuButtonToggleEventDetail
} from '../../../menu-button/types';
import { tableCellActionMenuLabel } from '../../../label-provider/table/label-tokens';

// prettier-ignore
export const template = html<TableCell>`
    <template role="cell" style="--ni-private-table-cell-nesting-level: ${x => x.nestingLevel}"
        @focusin="${x => x.onCellFocusIn()}"
        @blur="${x => x.onCellBlur()}"
    >
        <div ${ref('cellViewContainer')} class="cell-view-container">
            ${x => x.cellViewTemplate}
        </div>
        ${when(x => x.hasActionMenu, html<TableCell>`
            <${menuButtonTag} ${ref('actionMenuButton')}
                content-hidden
                appearance="${ButtonAppearance.ghost}"
                tabindex="-1"
                @beforetoggle="${(x, c) => x.onActionMenuBeforeToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>)}"
                @toggle="${(x, c) => x.onActionMenuToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>)}"
                @click="${(_, c) => c.event.stopPropagation()}"
                @blur="${x => x.onActionMenuBlur()}"
                class="action-menu"
                title="${x => (x.actionMenuLabel ? x.actionMenuLabel : tableCellActionMenuLabel.getValueFor(x))}"
            >
                <${iconThreeDotsLineTag} slot="start"></${iconThreeDotsLineTag}>
                ${x => (x.actionMenuLabel ? x.actionMenuLabel : tableCellActionMenuLabel.getValueFor(x))}
                <slot name="cellActionMenu" slot="menu"></slot>
            </${menuButtonTag}>
        `)}
    </template>
`;
