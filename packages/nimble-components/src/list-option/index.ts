import {
    DesignSystem,
    ListboxOption as FoundationListboxOption
} from '@microsoft/fast-foundation';
import { observable, attr } from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-list-option': ListOption;
    }
}

/**
 * A nimble-styled HTML listbox option
 */
export class ListOption extends FoundationListboxOption {
    /** @internal */
    public contentSlot!: HTMLSlotElement;

    /**
     * The hidden state of the element.
     *
     * @public
     * @defaultValue - false
     * @remarks
     * HTML Attribute: hidden
     */
    @attr({ mode: 'boolean' })
    public override hidden = false;

    /**
     * @internal
     * This attribute is required to allow use-cases that offer dynamic filtering
     * (like the Select) to visually hide options that are filtered out, but still
     * allow users to use the native 'hidden' attribute without it being affected
     * by the filtering process.
     */
    @attr({ attribute: 'visually-hidden', mode: 'boolean' })
    public visuallyHidden = false;

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
    baseName: 'list-option',
    baseClass: FoundationListboxOption,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleListOption());
export const listOptionTag = 'nimble-list-option';
