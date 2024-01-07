import {
    DesignSystem,
    Tab as FoundationTab,
    tabTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

const baseName = 'tab';
export const tabTag = `nimble-${baseName}`;
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
    baseName,
    baseClass: FoundationTab,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTab());
