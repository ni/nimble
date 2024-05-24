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
    @attr({ attribute: 'show-top-separator', mode: 'boolean' })
    public showTopSeparator = false;

    /**
     * @internal
     */
    @attr({ attribute: 'show-bottom-separator', mode: 'boolean' })
    public showBottomSeparator = false;

    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    public labelSlot!: HTMLSlotElement;

    /** @internal */
    @observable
    public listOptions: ListOption[] = [];

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

    private hiddenOptions: ListOption[] = [];

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
                this.hiddenOptions.push(source);
            } else {
                this.hiddenOptions = this.hiddenOptions.filter(
                    x => x !== source
                );
            }

            this.visuallyHidden = this.hiddenOptions.length === this.listOptions.length;
        }
    }

    private listOptionsChanged(
        prev: ListOption[] | undefined,
        next: ListOption[]
    ): void {
        this.hiddenOptions = next.filter(x => x.hidden || x.visuallyHidden);
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
