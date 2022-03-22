import {
    DesignSystem,
    Tab as FoundationTab,
    tabTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

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
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTab());
