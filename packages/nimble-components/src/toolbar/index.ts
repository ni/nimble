import {
    DesignSystem,
    Toolbar as FoundationToolbar,
    ToolbarOptions,
    toolbarTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

const baseName = 'toolbar';
export const toolbarTag = `nimble-${baseName}`;
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
    baseName,
    baseClass: FoundationToolbar,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleToolbar());
