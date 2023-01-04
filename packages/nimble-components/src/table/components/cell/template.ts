import { html, ref } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableCell } from '.';
import { IconThreeDotsLine } from '../../../icons/three-dots-line';
import { MenuButton } from '../../../menu-button';

// prettier-ignore
export const template = html<TableCell>`
    <template role="cell">
        <span ${ref('cellContentContainer')}></span>

        <${DesignSystem.tagFor(MenuButton)}
            content-hidden
            appearance="ghost"
        >
            <${DesignSystem.tagFor(IconThreeDotsLine)} slot="start"></${DesignSystem.tagFor(IconThreeDotsLine)}>
            Menu
            <slot name="cellActionMenu" slot="menu"></slot>
        </${DesignSystem.tagFor(MenuButton)}>
    </template>
`;
