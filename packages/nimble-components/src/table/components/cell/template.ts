import { html, ref, ViewTemplate, when } from '@microsoft/fast-element';
import type { TableCell } from '.';
import { iconThreeDotsLineTag } from '../../../icons/three-dots-line';
import { menuButtonTag } from '../../../menu-button';
import {
    ButtonAppearance,
    MenuButtonToggleEventDetail
} from '../../../menu-button/types';

// prettier-ignore
export const template = html<TableCell>`
    <template role="cell">
        ${when(x => x.cellViewTemplate, x => x.cellViewTemplate!)}
        ${when(x => x.hasActionMenu, html<TableCell>`
            <${menuButtonTag} ${ref('actionMenuButton')}
                content-hidden
                appearance="${ButtonAppearance.ghost}"
                @beforetoggle="${(x, c) => x.onActionMenuBeforeToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>)}"
                @toggle="${(x, c) => x.onActionMenuToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>)}"
                class="action-menu"
            >
                <${iconThreeDotsLineTag} slot="start"></${iconThreeDotsLineTag}>
                ${x => x.actionMenuLabel}
                <slot name="cellActionMenu" slot="menu"></slot>
            </${menuButtonTag}>
        `)}
    </template>
`;

export const createCellViewTemplate = (
    cellViewTag: string
): ViewTemplate<TableCell> => html<TableCell>`<${cellViewTag} class="cell-view"
        :cellRecord="${y => y.cellState?.cellRecord}"
        :columnConfig="${y => y.cellState?.columnConfig}"
    >
    </${cellViewTag}>`;
