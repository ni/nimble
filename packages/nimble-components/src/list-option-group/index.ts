import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-list-option-group': ListOptionGroup;
    }
}

/**
 * A nimble-styled HTML listbox option
 */
export class ListOptionGroup extends FoundationElement {
    @attr
    public label?: string;
}

const nimbleListOptionGroup = ListOptionGroup.compose({
    baseName: 'list-option-group',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleListOptionGroup());
export const listOptionGroupTag = DesignSystem.tagFor(ListOptionGroup);
