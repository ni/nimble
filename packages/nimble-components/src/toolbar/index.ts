import {
    DesignSystem,
    Toolbar as FoundationToolbar,
    ToolbarOptions,
    toolbarTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-toolbar': Toolbar;
    }
}

/**
 * A nimble-styled Toolbar
 */
export class Toolbar extends FoundationToolbar {}

const nimbleToolbar = Toolbar.compose<ToolbarOptions>({
    baseName: 'toolbar',
    baseClass: FoundationToolbar,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleToolbar());
export const toolbarTag = DesignSystem.tagFor(Toolbar);
