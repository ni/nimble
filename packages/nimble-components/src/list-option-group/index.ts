import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    observable,
    attr,
    volatile,
    Observable
} from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';
import { ListOption } from '../list-option';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-list-option-group': ListOptionGroup;
    }
}

/**
 * A nimble-styled HTML listbox option group
 */
export class ListOptionGroup extends FoundationElement {
    /**
     * The label for the group.
     *
     * @public
     * @remarks
     * If a label is also provided via slotted content, the label attribute
     * will have precedence.
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
     * (like the Select) to visually hide groups that are filtered out, but still
     * allow users to use the native 'hidden' attribute without it being affected
     * by the filtering process.
     */
    @attr({ attribute: 'visually-hidden', mode: 'boolean' })
    public visuallyHidden = false;

    /**
     * @internal
     */
    @attr({ attribute: 'top-separator-visible', mode: 'boolean' })
    public topSeparatorVisible = false;

    /**
     * @internal
     */
    @attr({ attribute: 'bottom-separator-visible', mode: 'boolean' })
    public bottomSeparatorVisible = false;

    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    public labelSlot!: HTMLSlotElement;

    /** @internal */
    @observable
    public listOptions!: ListOption[];

    /** @internal */
    @volatile
    public get labelContent(): string {
        if (this.label) {
            return this.label;
        }

        if (!this.$fastController.isConnected) {
            return '';
        }

        const nodes = this.labelSlot.assignedNodes();
        return nodes
            .filter(node => node.textContent?.trim() !== '')
            .map(node => node.textContent?.trim())
            .join(' ');
    }

    private readonly hiddenOptions: Set<ListOption> = new Set();

    /**
     * @internal
     */
    public clickHandler(e: MouseEvent): void {
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    /**
     * @internal
     */
    public handleChange(source: unknown, propertyName: string): void {
        if (
            source instanceof ListOption
            && (propertyName === 'hidden' || propertyName === 'visuallyHidden')
        ) {
            if (source.hidden || source.visuallyHidden) {
                this.hiddenOptions.add(source);
            } else {
                this.hiddenOptions.delete(source);
            }

            this.visuallyHidden = this.hiddenOptions.size === this.listOptions.length;
        }
    }

    private listOptionsChanged(
        prev: ListOption[] | undefined,
        next: ListOption[]
    ): void {
        this.hiddenOptions.clear();
        next.filter(o => o.hidden || o.visuallyHidden).forEach(o => this.hiddenOptions.add(o));
        prev?.forEach(o => {
            const notifier = Observable.getNotifier(o);
            notifier.unsubscribe(this, 'hidden');
            notifier.unsubscribe(this, 'visuallyHidden');
        });

        let allOptionsHidden = true;
        next?.forEach(o => {
            const notifier = Observable.getNotifier(o);
            notifier.subscribe(this, 'hidden');
            notifier.subscribe(this, 'visuallyHidden');
            allOptionsHidden = allOptionsHidden && (o.hidden || o.visuallyHidden);
        });

        this.visuallyHidden = next.length === 0 || allOptionsHidden;
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
