import {
    DesignSystem,
    ListboxOption as FoundationListboxOption
} from '@microsoft/fast-foundation';
import { observable, attr } from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';
import type { ListOptionOwner } from '../patterns/dropdown/types';

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

    /**
     * @internal
     * This attribute is used to control the visual selected state of an option. This
     * is handled independently of the public 'selected' attribute, as 'selected' is
     * representative of the current value of the container control. However, while
     * a dropdown is open users can navigate through the options (requiring visual
     * updates) without changing the value of the container control.
     */
    @attr({ attribute: 'active-option', mode: 'boolean' })
    public activeOption = false;

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

    public override connectedCallback(): void {
        super.connectedCallback();
        if (this.isListOptionOwner(this.parentElement)) {
            this.parentElement.registerOption(this);
        }
    }

    private isListOptionOwner(
        parent: HTMLElement | null
    ): parent is ListOptionOwner {
        if (!parent) {
            return false;
        }

        return typeof (parent as ListOptionOwner).registerOption === 'function';
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
