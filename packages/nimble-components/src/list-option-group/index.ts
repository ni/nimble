import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { observable, attr, volatile } from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';
import { ListOption } from '../list-option';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-list-option-group': ListOptionGroup;
    }
}

/**
 * A nimble-styled HTML listbox option
 */
export class ListOptionGroup extends FoundationElement {
    /**
     * The label for the group.
     *
     * @public
     * @remarks
     * If a label is provided via slotted content, that will be used in place of
     * this attribute.
     */
    @attr
    public label?: string;

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
    public labelSlot!: HTMLSlotElement;

    /** @internal */
    @observable
    public slottedElements: Element[] = [];

    /** @internal */
    @volatile
    public get labelContent(): string {
        if (this.label || !this.$fastController.isConnected) {
            return this.label ?? '';
        }

        const nodes = this.labelSlot.assignedNodes();
        return nodes.length > 0
            ? nodes.map(node => node.textContent?.trim()).join(' ')
            : '';
    }

    /**
     * @internal
     */
    public clickHandler(e: MouseEvent): void {
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    protected slottedElementsChanged(): void {
        this.slottedElements.forEach(e => {
            if (e instanceof ListOption) {
                e.slot = 'options-slot';
            }
        });
    }
}

const nimbleListOptionGroup = ListOptionGroup.compose({
    baseName: 'list-option-group',
    baseClass: FoundationElement,
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleListOptionGroup());
export const listOptionGroupTag = 'nimble-list-option-group';
