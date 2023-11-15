import { html, ref, when } from '@microsoft/fast-element';
import type { TableCell } from '.';
import { iconThreeDotsLineTag } from '../../../icons/three-dots-line';
import { menuButtonTag } from '../../../menu-button';
import {
    ButtonAppearance,
    MenuButtonToggleEventDetail
} from '../../../menu-button/types';
import {
    tableCellActionMenuLabel,
    tableRowCollapseLabel,
    tableRowExpandLabel
} from '../../../label-provider/table/label-tokens';
import { buttonTag } from '../../../button';
import { iconArrowExpanderRightTag } from '../../../icons/arrow-expander-right';
import { mediumPadding } from '../../../theme-provider/design-tokens';

// prettier-ignore
export const template = html<TableCell>`
    <template role="cell" style="
        --ni-private-table-cell-nesting-level: ${x => x.nestingLevel};
        --ni-private-table-cell-view-padding: ${x => (x.isParentRow && x.isFirstCell && !x.isTopLevelRow ? mediumPadding.getValueFor(x) : '0px')};
    ">
        ${when(x => x.isParentRow && x.isFirstCell && !x.isTopLevelRow, html<TableCell>`
            <${buttonTag}
                    appearance="${ButtonAppearance.ghost}"
                    content-hidden
                    class="expand-collapse-button"
                    tabindex="-1"
                    @click="${(x, c) => x.onRowExpandToggle(c.event)}"
                >
                    <${iconArrowExpanderRightTag} ${ref('expandIcon')} slot="start" class="expander-icon ${x => x.animationClass}"></${iconArrowExpanderRightTag}>
                    ${x => (x.expanded ? tableRowCollapseLabel.getValueFor(x) : tableRowExpandLabel.getValueFor(x))}
            </${buttonTag}>
        `)}
        ${x => x.cellViewTemplate}
        ${when(x => x.hasActionMenu, html<TableCell>`
            <${menuButtonTag} ${ref('actionMenuButton')}
                content-hidden
                appearance="${ButtonAppearance.ghost}"
                @beforetoggle="${(x, c) => x.onActionMenuBeforeToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>)}"
                @toggle="${(x, c) => x.onActionMenuToggle(c.event as CustomEvent<MenuButtonToggleEventDetail>)}"
                @click="${(_, c) => c.event.stopPropagation()}"
                class="action-menu"
                title="${x => x.actionMenuLabel ?? tableCellActionMenuLabel.getValueFor(x)}"
            >
                <${iconThreeDotsLineTag} slot="start"></${iconThreeDotsLineTag}>
                ${x => x.actionMenuLabel ?? tableCellActionMenuLabel.getValueFor(x)}
                <slot name="cellActionMenu" slot="menu"></slot>
            </${menuButtonTag}>
        `)}
    </template>
`;
