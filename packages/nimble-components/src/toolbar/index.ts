import {
    DesignSystem,
    Toolbar as FoundationToolbar,
    ToolbarOptions,
    toolbarTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export type { Toolbar };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-toolbar': Toolbar;
    }
}

/**
 * A nimble-styed Toolbar
 */
class Toolbar extends FoundationToolbar {}

const nimbleToolbar = Toolbar.compose<ToolbarOptions>({
    baseName: 'toolbar',
    baseClass: FoundationToolbar,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleToolbar());