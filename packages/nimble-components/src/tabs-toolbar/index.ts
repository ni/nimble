import { observable } from '@ni/fast-element';
import {
    applyMixins,
    DesignSystem,
    FoundationElement,
    StartEnd
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tabs-toolbar': TabsToolbar;
    }
}

/**
 * A nimble-styled container for toolbar content next to tabs.
 */
export class TabsToolbar extends FoundationElement {
    /** @internal */
    @observable
    public defaultSlottedElements: Element[] = [];

    /** @internal */
    @observable
    public endSlottedElements: Element[] = [];
}

const nimbleTabsToolbar = TabsToolbar.compose({
    baseName: 'tabs-toolbar',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabsToolbar());
export const tabsToolbarTag = 'nimble-tabs-toolbar';

applyMixins(TabsToolbar, StartEnd);
