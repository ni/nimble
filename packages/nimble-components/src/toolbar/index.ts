import {
    DesignSystem,
    Toolbar as FoundationToolbar,
    type ToolbarOptions,
    toolbarTemplate as template
} from '@ni/fast-foundation';
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
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleToolbar());
export const toolbarTag = 'nimble-toolbar';
