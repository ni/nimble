import { Notifier, Observable, observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    ListboxElement as FoundationListbox,
    ListboxOption
} from '@microsoft/fast-foundation';
import type { SuggestionProps } from '@tiptap/suggestion';
import {
    keyEnter,
    keyEscape,
    keyTab
} from '@microsoft/fast-web-utilities';
import type { MentionDetail } from '../editor/types';
import { styles } from './styles';
import { template } from './template';
import { AnchoredRegion } from '../../anchored-region';
import { diacriticInsensitiveStringNormalizer } from '../../utilities/models/string-normalizers';
import type { ListOption } from '../../list-option';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-mention-list-box': RichTextMentionListBox;
    }
}

/**
 * A rich text mention list box which acts as a popup for "@mention" support in editor
 */
export class RichTextMentionListBox extends FoundationListbox {
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
     * @internal
     */
    public filter = '';

    /**
     * The collection of currently filtered options.
     * The approach is defined based on the `Combobox.filteredOptions` implementation.
     *
     * @internal
     */
    public filteredOptions: ListboxOption[] = [];

    @observable
    private anchorElement?: HTMLElement;

    private suggestionProps!: SuggestionProps;

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
        return this.filteredOptions?.length
            ? this.filteredOptions
            : [];
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
    public onMention(props: SuggestionProps): void {
        this.suggestionProps = props;
        this.filter = props.query;
        this.anchorElement = props.decorationNode as HTMLElement;
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
                this.activateMention({
                    href: this.firstSelectedOption.value,
                    displayName: this.firstSelectedOption.text
                } as MentionDetail);
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
        if (!this.filter) {
            this.filteredOptions = this._options;
        } else {
            const normalizedFilter = diacriticInsensitiveStringNormalizer(this.filter);
            this.filteredOptions = this._options.filter(o => diacriticInsensitiveStringNormalizer(o.text).includes(normalizedFilter));
        }

        this._options.forEach(o => {
            o.hidden = !this.filteredOptions.includes(o);
        });

        if (this.filteredOptions.length) {
            this.selectedOptions = [this.filteredOptions[0]!];
            this.selectedIndex = this.options.indexOf(this.firstSelectedOption);
        } else {
            this.selectedOptions = [];
            this.selectedIndex = -1;
        }

        this.selectFirstOption();
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
        this.activateMention({
            href: capturedListOption.value,
            displayName: capturedListOption.text
        });
        return true;
    }

    /**
     * Observes the anchor element using intersection observer.
     * Once the anchor element intersects, the anchor region will be closed.
     *
     * @internal
     */
    public anchorElementChanged(prev: HTMLElement, next: HTMLElement): void {
        if (prev) {
            this.anchorElementIntersectionObserver.unobserve(prev);
        }
        if (this.region && this.anchorElement) {
            this.region.anchorElement = this.anchorElement;
            this.region.update();
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
     * Handles the events of the anchor region.
     * Repositions the listbox scroll bar when the `initialLayoutComplete` event is triggered.
     * Other events will be passed to the base class.
     *
     * @internal
     */
    public override handleChange(source: unknown, args: string): void {
        if (source instanceof AnchoredRegion) {
            if (args === 'initialLayoutComplete') {
                this.focusAndScrollOptionIntoView();
            }
        } else {
            super.handleChange(source, args);
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
        if (this.firstSelectedOption) {
            requestAnimationFrame(() => {
                this.firstSelectedOption?.scrollIntoView({ block: 'nearest' });
            });
        }
    }

    private activateMention(mentionDetail: MentionDetail): void {
        this.suggestionProps.command({
            href: mentionDetail.href,
            label: mentionDetail.displayName
        });
        this.setOpen(false);
    }

    private setOpen(value: boolean): void {
        this.open = value;
    }
}

const nimbleRichTextMentionListBox = RichTextMentionListBox.compose({
    baseName: 'rich-text-mention-list-box',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichTextMentionListBox());
export const richTextMentionListBoxTag = DesignSystem.tagFor(
    RichTextMentionListBox
);
