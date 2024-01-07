import {
    DesignSystem,
    Toolbar as FoundationToolbar,
    ToolbarOptions,
    toolbarTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export const toolbarTag = 'nimble-toolbar';
declare global {
    interface HTMLElementTagNameMap {
        [toolbarTag]: Toolbar;
    }
}

/**
 * A nimble-styled Toolbar
 */
export class Toolbar extends FoundationToolbar {}

const nimbleToolbar = Toolbar.compose<ToolbarOptions>({
    baseName: toolbarTag,
    baseClass: FoundationToolbar,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().register(nimbleToolbar());
