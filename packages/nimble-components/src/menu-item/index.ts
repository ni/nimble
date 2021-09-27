import {
    DesignSystem,
    MenuItem as FoundationMenuItem,
    menuItemTemplate as template,
    MenuItemOptions
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';

import { styles } from './styles';

export { FoundationMenuItem as MenuItem };

export const nimbleMenuItem = FoundationMenuItem.compose<MenuItemOptions>({
    baseName: 'menu-item',
    template,
    start: html<FoundationMenuItem>`<span part="icon"><slot name="icon"></slot><span>`,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuItem());
