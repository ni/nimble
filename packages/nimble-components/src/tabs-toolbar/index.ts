import { customElement, observable } from '@ni/fast-element';
import {
    applyMixins,
    FoundationElement,
    StartEnd
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const tabsToolbarTag = 'nimble-tabs-toolbar';

declare global {
    interface HTMLElementTagNameMap {
        [tabsToolbarTag]: TabsToolbar;
    }
}

/**
 * A nimble-styled container for toolbar content next to tabs.
 */
@customElement({
    name: tabsToolbarTag,
    template: template(elementDefinitionContextMock, {}),
    styles
})
export class TabsToolbar extends FoundationElement {
    /** @internal */
    @observable
    public defaultSlottedElements: Element[] = [];
}

applyMixins(TabsToolbar, StartEnd);
