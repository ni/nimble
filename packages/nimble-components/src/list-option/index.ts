import {
    DesignSystem,
    ListboxOption as FoundationListboxOption
} from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';

export const listOptionTag = 'nimble-list-option';
declare global {
    interface HTMLElementTagNameMap {
        [listOptionTag]: ListOption;
    }
}

/**
 * A nimble-styled HTML listbox option
 */
export class ListOption extends FoundationListboxOption {
    /** @internal */
    public contentSlot!: HTMLSlotElement;

    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    public get elementTextContent(): string {
        return this.contentSlot
            .assignedNodes()
            .map(node => node.textContent?.trim())
            .join(' ');
    }
}

const nimbleListOption = ListOption.compose({
    baseName: listOptionTag,
    baseClass: FoundationListboxOption,
    template,
    styles
});

DesignSystem.getOrCreate().register(nimbleListOption());
