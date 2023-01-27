import { html, ref, when } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableCell } from '.';
import { IconThreeDotsLine } from '../../../icons/three-dots-line';
import { MenuButton } from '../../../menu-button';
import { ButtonAppearance } from '../../../menu-button/types';

// prettier-ignore
export const template = html<TableCell>`
    <template role="cell">
        <div ${ref('cellContentContainer')} class="cell-content-container"></div>

        ${when(x => x.hasActionMenu, html<TableCell>`
            <${DesignSystem.tagFor(MenuButton)}
                content-hidden
                appearance="${_ => ButtonAppearance.ghost}"
                @beforetoggle="${(x, c) => x.onActionMenuBeforeToggle(c.event as CustomEvent)}"
                @toggle="${(x, c) => x.onActionMenuToggle(c.event as CustomEvent)}"
                part="action-menu"
            >
                <${DesignSystem.tagFor(IconThreeDotsLine)} slot="start"></${DesignSystem.tagFor(IconThreeDotsLine)}>
                ${x => x.actionMenuLabel}
                <slot name="cellActionMenu" slot="menu"></slot>
            </${DesignSystem.tagFor(MenuButton)}>
        `)}
    </template>
`;
