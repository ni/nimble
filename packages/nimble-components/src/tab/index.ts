import {
    DesignSystem,
    Tab as FoundationTab,
    tabTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export const tabTag = 'nimble-tab';
declare global {
    interface HTMLElementTagNameMap {
        [tabTag]: Tab;
    }
}

/**
 * A nimble-styled HTML tab
 */
export class Tab extends FoundationTab {}

const nimbleTab = Tab.compose({
    baseName: tabTag,
    baseClass: FoundationTab,
    template,
    styles
});

DesignSystem.getOrCreate().register(nimbleTab());
