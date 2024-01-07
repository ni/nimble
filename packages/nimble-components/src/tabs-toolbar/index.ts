import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

const baseName = 'tabs-toolbar';
export const tabsToolbarTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [tabsToolbarTag]: TabsToolbar;
    }
}

/**
 * A nimble-styled container for toolbar content next to tabs.
 */
export class TabsToolbar extends FoundationElement {}

const nimbleTabsToolbar = TabsToolbar.compose({
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabsToolbar());
