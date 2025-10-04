import { customElement } from '@ni/fast-element';
import {
    Toolbar as FoundationToolbar,
    toolbarTemplate as template
} from '@ni/fast-foundation';
import { styles } from './styles';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const toolbarTag = 'nimble-toolbar';

declare global {
    interface HTMLElementTagNameMap {
        [toolbarTag]: Toolbar;
    }
}

/**
 * A nimble-styled Toolbar
 */
@customElement({
    name: toolbarTag,
    template: template(elementDefinitionContextMock, {}),
    styles
})
export class Toolbar extends FoundationToolbar {}
