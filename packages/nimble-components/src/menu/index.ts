import {
    DesignSystem,
    Menu as FoundationMenu,
    menuTemplate as template
} from '@microsoft/fast-foundation';

import { styles } from './styles';

export { FoundationMenu as Menu };

export const nimbleMenu = FoundationMenu.compose({
    baseName: 'menu',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenu());
