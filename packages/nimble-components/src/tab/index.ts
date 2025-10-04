import { customElement } from '@ni/fast-element';
import {
    Tab as FoundationTab,
    tabTemplate as template
} from '@ni/fast-foundation';
import { styles } from './styles';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const tabTag = 'nimble-tab';

declare global {
    interface HTMLElementTagNameMap {
        [tabTag]: Tab;
    }
}

/**
 * A nimble-styled HTML tab
 */
@customElement({
    name: tabTag,
    template: template(elementDefinitionContextMock, {}),
    styles
})
export class Tab extends FoundationTab {}
