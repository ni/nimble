import { html, ref, when } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableCell } from '.';
import { IconThreeDotsLine } from '../../../icons/three-dots-line';
import { MenuButton } from '../../../menu-button';

// prettier-ignore
export const template = html<TableCell>`
    <template role="cell">
        <span ${ref('cellContentContainer')} class="cell-content-container"></span>

        ${when(x => x.showActionMenu, html<TableCell>`
            <${DesignSystem.tagFor(MenuButton)}
                content-hidden
                appearance="ghost"
                @opening="${x => x.onMenuOpening()}"
                @open-change="${(x, c) => x.onMenuOpenChange(c.event)}"
                part="action-menu"
            >
                <${DesignSystem.tagFor(IconThreeDotsLine)} slot="start"></${DesignSystem.tagFor(IconThreeDotsLine)}>
                Menu
                <slot name="cellActionMenu" slot="menu"></slot>
            </${DesignSystem.tagFor(MenuButton)}>
        `)}
    </template>
`;
