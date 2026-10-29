import { Observable, observable, volatile } from '@ni/fast-element';
import {
    DesignSystem,
    ListboxElement as FoundationListbox,
    ListboxOption
} from '@ni/fast-foundation';
import { keyEnter, keyEscape, keyTab } from '@ni/fast-web-utilities';
import type { MentionDetail } from '../editor/types';
import { styles } from './styles';
import { template } from './template';
import { diacriticInsensitiveStringNormalizer } from '../../utilities/models/string-normalizers';
import type { ListOption } from '../../list-option';
import type { MentionListboxShowOptions } from './types';
import type { PopoverElement } from '../../patterns/popover/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-mention-listbox': RichTextMentionListbox;
    }
}

/**
 * A rich text mention listbox which acts as a popup for "@mention" support in editor
 */
export class RichTextMentionListbox extends FoundationListbox {
    /**
     * @internal
     */
    @volatile
    public get isOpen(): boolean {
        Observable.track(this, 'isOpen');
        return this.popoverElement?.matches(':popover-open') ?? false;
    }

    /**
     * @internal
     */
    @observable
    public popoverElement?: PopoverElement;

    /**
     * The space available in the viewport for the listbox when opened.
     *
     * @internal
     */
    @observable
    public availableViewportHeight = 0;

    /**
     * @internal
     */
    public filter = '';

    /**
     * The collection of currently filtered options.
     * The approach is defined based on the `Combobox.filteredOptions` implementation.
     *
     * @internal
     */
    @observable
    public filteredOptions: ListboxOption[] = [];

    /**
     * Reference to the internal listbox element.
     *
     * @internal
     */
    public listbox!: HTMLDivElement;

    @observable
    private anchorElement?: HTMLElement;

    private readonly anchorElementIntersectionObserver: IntersectionObserver = new IntersectionObserver(
        entries => {
            if (!entries[0]?.isIntersecting) {
                this.close();
            }
        },
        { threshold: 1.0, root: document }
    );

    /**
     * @public
     */
    public close(): void {
        this.popoverElement?.hidePopover();
    }

    /**
     * The list of options.
     *
     * @public
     * @remarks
     * Overrides `Listbox.options`.
     */
    public override get options(): ListboxOption[] {
        Observable.track(this, 'options');
        return this.filteredOptions?.length > 0 ? this.filteredOptions : [];
    }

    public override set options(value: ListboxOption[]) {
        this._options = value;
        Observable.notify(this, 'options');
    }

    /**
     * Triggers when the mention plugin is activated upon pressing the `key`
     *
     * @public
     */
    public show(options: MentionListboxShowOptions): void {
        const listboxTop = options.anchorNode.getBoundingClientRect().bottom;
        this.availableViewportHeight = Math.trunc(
            window.innerHeight - listboxTop
        );
        this.filter = options.filter;
        this.anchorElement = options.anchorNode;
        this.filterOptions();
        this.open();
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.popoverElement?.addEventListener('toggle', this.popupToggleHandler);
        if (this.anchorElement) {
            this.anchorElementIntersectionObserver.observe(this.anchorElement);
        }
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.popoverElement?.removeEventListener('toggle', this.popupToggleHandler);
        if (this.anchorElement) {
            this.anchorElementIntersectionObserver.unobserve(this.anchorElement);
        }
    }

    /**
     * Handle keydown actions for listbox navigation and selection.
     *
     * @param e - the keyboard event
     * @public
     */
    public override keydownHandler(event: KeyboardEvent): boolean {
        if (!this.isOpen) {
            return false;
        }
        switch (event.key) {
            case keyTab:
            case keyEnter: {
                if (!this.hasSelectableOptions) {
                    return false;
                }
                const mentionDetail: MentionDetail = {
                    href: this.firstSelectedOption.value,
                    displayName: this.firstSelectedOption.text
                };
                this.$emit('mention-selected', mentionDetail);
                this.close();
                return true;
            }
            case keyEscape: {
                this.close();
                return false;
            }
            default: {
                super.keydownHandler(event);
                return false;
            }
        }
    }

    /**
     * Filter available options by filter value.
     * The method is defined based on the `Combobox.filterOptions` and `Combobox.inputHandler` implementation.
     *
     * @internal
     */
    public filterOptions(): void {
        if (!this.filter) {
            this.filteredOptions = this._options;
        } else {
            const normalizedFilter = diacriticInsensitiveStringNormalizer(
                this.filter
            );
            this.filteredOptions = this._options.filter(o => diacriticInsensitiveStringNormalizer(o.text).includes(
                normalizedFilter
            ));
        }

        this._options.forEach(o => {
            o.hidden = !this.filteredOptions.includes(o);
        });

        if (this.filteredOptions.length > 0) {
            this.selectedOptions = [this.filteredOptions[0]!];
            this.selectedIndex = this.options.indexOf(this.firstSelectedOption);
        } else {
            this.selectedOptions = [];
            this.selectedIndex = -1;
        }
    }

    /**
     * Synchronize the form-associated proxy and update the value property of the element.
     *
     * @param prev - the previous collection of slotted option elements
     * @param next - the next collection of slotted option elements
     *
     * @internal
     */
    public override slottedOptionsChanged(
        prev: Element[] | undefined,
        next: Element[]
    ): void {
        super.slottedOptionsChanged(prev, next);
        this.filterOptions();
    }

    /**
     * Triggers the `suggestionProps` command to notify the tiptap editor to select the option.
     * The method is defined based on the `Listbox.clickHandler` implementation.
     *
     * @internal
     */
    public override clickHandler(e: MouseEvent): boolean {
        const capturedElement = (e.target as HTMLElement).closest(
            'option,[role=option]'
        );

        const capturedListOption = capturedElement as ListOption | null;

        if (!capturedListOption || capturedListOption.disabled) {
            return false;
        }
        const mentionDetail: MentionDetail = {
            href: capturedListOption.value,
            displayName: capturedListOption.text
        };
        this.$emit('mention-selected', mentionDetail);
        this.close();
        return true;
    }

    /**
     * Observes the anchor element using intersection observer.
     * Once the anchor element intersects, the anchor region will be closed.
     *
     * @internal
     */
    public anchorElementChanged(prev: HTMLElement | undefined, next: HTMLElement): void {
        if (prev) {
            this.anchorElementIntersectionObserver.unobserve(prev);
        }
        if (this.anchorElement) {
            this.anchorElementIntersectionObserver.observe(next);
        }
    }

    /**
     * Handles the events of the anchored region.
     * Repositions the listbox scroll bar when the `initialLayoutComplete` event is triggered.
     * Other events will be passed to the base class.
     *
     * @internal
     */
    public override handleChange(source: unknown, args: string): void {
        super.handleChange(source, args);
        if (args === 'initialLayoutComplete') {
            this.focusAndScrollOptionIntoView();
        }
    }

    /**
     * Focus the control and scroll the first selected option into view.
     *
     * @internal
     * @remarks
     * Overrides: `Listbox.focusAndScrollOptionIntoView`
     */
    protected override focusAndScrollOptionIntoView(): void {
        if (this.isOpen && this.firstSelectedOption !== null) {
            requestAnimationFrame(() => {
                this.firstSelectedOption?.scrollIntoView({ block: 'nearest' });
            });
        }
    }

    private readonly popupToggleHandler: (event: ToggleEvent) => void = (_: ToggleEvent) => {
        Observable.notify(this, 'open');
        this.$emit('toggle');
    };

    private open(): void {
        this.popoverElement?.showPopover({ source: this.anchorElement });
    }
}

const nimbleRichTextMentionListbox = RichTextMentionListbox.compose({
    baseName: 'rich-text-mention-listbox',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichTextMentionListbox());
export const richTextMentionListboxTag = 'nimble-rich-text-mention-listbox';
