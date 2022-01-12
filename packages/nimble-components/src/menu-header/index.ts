import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from './template';

export type { MenuHeader };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-menu-header': MenuHeader;
    }
}

/**
 * A nimble styled header for use in the nimble-menu
 */
class MenuHeader extends FoundationElement {}

const nimbleMenuHeader = MenuHeader.compose({
    baseName: 'menu-header',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuHeader());
