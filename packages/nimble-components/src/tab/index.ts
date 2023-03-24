import {
    DesignSystem,
    Tab as FoundationTab,
    tabTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from '../patterns/tab/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tab': Tab;
    }
}

/**
 * A nimble-styled HTML tab
 */
export class Tab extends FoundationTab {}

const nimbleTab = Tab.compose({
    baseName: 'tab',
    baseClass: FoundationTab,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTab());
export const tabTag = DesignSystem.tagFor(Tab);
