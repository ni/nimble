import {
    DesignSystem,
    MenuItem as FoundationMenuItem,
    menuItemTemplate as template,
    MenuItemOptions
} from '@microsoft/fast-foundation';

import { styles } from './styles';

export { FoundationMenuItem as MenuItem };

export const nimbleMenuItem = FoundationMenuItem.compose<MenuItemOptions>({
    baseName: 'menu-item',
    template,
    styles,
    checkboxIndicator: '',
    expandCollapseGlyph: '',
    radioIndicator: ''
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuItem());
