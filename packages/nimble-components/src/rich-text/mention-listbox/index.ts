import { type Notifier, Observable, observable } from '@ni/fast-element';
import {
    DesignSystem,
    ListboxElement as FoundationListbox,
    ListboxOption
} from '@ni/fast-foundation';
import { keyEnter, keyEscape, keyTab } from '@ni/fast-web-utilities';
import type { MentionDetail } from '../editor/types';
import { styles } from './styles';
import { template } from './template';
import type { AnchoredRegion } from '../../anchored-region';
import { diacriticInsensitiveStringNormalizer } from '../../utilities/models/string-normalizers';
import type { ListOption } from '../../list-option';
import type { MentionListboxShowOptions } from './types';

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
    @observable
    public open?: boolean;

    /**
     * @internal
     */
    @observable
    public region?: AnchoredRegion;

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

    private regionNotifier?: Notifier;

    private readonly anchorElementIntersectionObserver: IntersectionObserver = new IntersectionObserver(
        entries => {
            if (!entries[0]?.isIntersecting) {
                this.setOpen(false);
            }
        },
        { threshold: 1.0, root: document }
    );

    /**
     * @public
     */
    public close(): void {
        this.setOpen(false);
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
        this.setOpen(true);
        this.filterOptions();
    }

    /**
     * Handle keydown actions for listbox navigation and selection.
     *
     * @param e - the keyboard event
     * @public
     */
    public override keydownHandler(event: KeyboardEvent): boolean {
        if (!this.open) {
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
                this.setOpen(false);
                return true;
            }
            case keyEscape: {
                this.setOpen(false);
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
        let newFilteredOptions: ListboxOption[];
        if (!this.filter) {
            newFilteredOptions = this._options;
        } else {
            const normalizedFilter = diacriticInsensitiveStringNormalizer(
                this.filter
            );
            newFilteredOptions = this._options.filter(o => diacriticInsensitiveStringNormalizer(o.text).includes(
                normalizedFilter
            ));
        }

        // Skip the observable assignment when both old and new are empty.
        // Different empty array references would trigger an @observable
        // notification, queuing a deferred DOM.queueUpdate for the
        // when-directive that can crash with "parentNode is null" if the
        // DOM markers are in an inconsistent state during processing.
        if (
            newFilteredOptions.length === 0
            && this.filteredOptions.length === 0
        ) {
            return;
        }

        this.filteredOptions = newFilteredOptions;

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
        if (this.open) {
            super.slottedOptionsChanged(prev, next);
            this.filterOptions();
        } else {
            // When closed, silently update the internal options list without
            // calling super. The base class triggers observable notifications
            // (options, selectedIndex, selectedOptions) that queue deferred
            // FAST binding updates via DOM.queueUpdate. These deferred tasks
            // can crash with "parentNode is null" when they try to update
            // when-directive DOM markers that were detached between the
            // enqueue and requestAnimationFrame execution.
            this._options = next.filter(
                (o): o is ListboxOption => o instanceof ListboxOption
            );
        }
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
        this.setOpen(false);
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
        if (this.region && this.anchorElement) {
            if (this.region.anchorElement !== null) {
                // When the anchored region already has an anchor, set the backing
                // field directly and call update() to reposition. This avoids
                // going through the observable setter which triggers requestReset()
                // and tears down initialLayoutComplete, corrupting FAST's
                // when-directive DOM markers during deferred binding updates.
                (this.region as unknown as { [key: string]: unknown })._anchorElement = this.anchorElement;
                this.region.update();
            } else {
                this.region.anchorElement = this.anchorElement;
            }
            this.anchorElementIntersectionObserver.observe(next);
        }
    }

    /**
     * Observes the anchor region.
     *
     * @internal
     */
    public regionChanged(): void {
        if (this.regionNotifier) {
            this.regionNotifier.unsubscribe(this);
        }
        this.regionNotifier = Observable.getNotifier(this.region);
        this.regionNotifier.subscribe(this);
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
        if (this.open && this.firstSelectedOption !== null) {
            requestAnimationFrame(() => {
                this.firstSelectedOption?.scrollIntoView({ block: 'nearest' });
            });
        }
    }

    private setOpen(value: boolean): void {
        if (!value && this.open) {
            // Clear stale filtered options by writing the backing field
            // directly. Using the @observable setter would queue a deferred
            // binding update for the when-directive, which can crash with
            // "parentNode is null" if the DOM markers are being torn down.
            (this as unknown as { [key: string]: unknown })._filteredOptions = [];
        }
        this.open = value;
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
