import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

export const tabsToolbarTag = 'nimble-tabs-toolbar';
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
    baseName: tabsToolbarTag,
    template,
    styles
});

DesignSystem.getOrCreate().register(nimbleTabsToolbar());
