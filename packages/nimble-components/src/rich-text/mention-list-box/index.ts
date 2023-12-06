import { Notifier, Observable, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    keyTab,
    keyEnter,
    keyArrowDown,
    keyArrowUp,
    keyEscape
} from '@microsoft/fast-web-utilities';
import type { SuggestionProps } from '@tiptap/suggestion';
import type { ListOption } from '../../list-option';
import type { MentionDetail } from '../editor/types';
import { styles } from './styles';
import { template } from './template';
import { AnchoredRegion } from '../../anchored-region';
import type { MentionExtensionConfiguration } from '../models/mention-extension-configuration';
import type { MappingConfigs } from '../../rich-text-mention/base/types';
import { normalizeString } from '../../utilities/models/string-normalizer';
import { Listbox } from '../../listbox';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-mention-list-box': RichTextMentionListBox;
    }
}

/**
 * A rich text mention list box which acts as a popup for "@mention" support in editor
 */
export class RichTextMentionListBox extends FoundationElement {
    /**
     * @internal
     */
    @observable
    public activeCharacter?: string;

    /**
     * @internal
     */
    @observable
    public activeMappingConfigs?: MappingConfigs;

    /**
     * @internal
     */
    @observable
    public open?: boolean;

    /**
     * @internal
     */
    @observable
    public readonly childItems: ListOption[] = [];

    /**
     * @internal
     */
    @observable
    public listBox!: Listbox;

    /**
     * @internal
     */
    @observable
    public region?: AnchoredRegion;

    /**
     * @internal
     */
    public filter?: string;

    @observable
    private anchorElement?: HTMLElement;

    private mentionExtensionConfig?: MentionExtensionConfiguration[];

    private suggestionProps!: SuggestionProps;

    private listBoxNotifier?: Notifier;

    private regionNotifier?: Notifier;

    private readonly intersectionObserver: IntersectionObserver = new IntersectionObserver(
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
     * @public
     */
    public onMention(props: SuggestionProps): void {
        this.suggestionProps = props;
        this.activeCharacter = props.text.slice(0, 1);
        this.filter = props.query;
        this.anchorElement = props.decorationNode as HTMLElement;
        this.setOpen(true);
        this.filterOptions();
        void this.selectFirstOption();
    }

    /**
     * @public
     */
    public updateMentionExtensionConfig(
        mentionExtensionConfig?: MentionExtensionConfiguration[]
    ): void {
        this.mentionExtensionConfig = mentionExtensionConfig;
        this.setActiveMappingConfigs();
    }

    /**
     * @internal
     */
    public async selectFirstOption(): Promise<void> {
        const definedElements = [
            this.listBox?.matches(':not(:defined)')
                ? customElements.whenDefined(this.listBox.localName)
                : Promise.resolve()
        ];
        await Promise.all(definedElements);
        this.listBox?.selectFirstOption();
    }

    /**
     * @public
     */
    public keydownHandler(event: KeyboardEvent): boolean {
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
                    href: this.firstSelectedOption!.value,
                    displayName: this.firstSelectedOption!.text
                } as MentionDetail);
                return true;
            }
            case keyEscape: {
                this.setOpen(false);
                return false;
            }
            case keyArrowDown: {
                this.listBox.keydownHandler(event);
                return false;
            }
            case keyArrowUp: {
                this.listBox.keydownHandler(event);
                return false;
            }
            default: {
                return false;
            }
        }
    }

    /**
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean {
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
        } as MentionDetail);
        return true;
    }

    /**
     * @internal
     */
    public activeCharacterChanged(): void {
        this.setActiveMappingConfigs();
    }

    /**
     * @internal
     */
    public anchorElementChanged(prev: HTMLElement, next: HTMLElement): void {
        if (prev) {
            this.intersectionObserver.unobserve(prev);
        }
        if (this.region && this.anchorElement) {
            this.region.anchorElement = this.anchorElement;
            this.region.update();
            this.intersectionObserver.observe(next);
        }
    }

    /**
     * @internal
     */
    public listBoxChanged(): void {
        if (this.listBoxNotifier) {
            this.listBoxNotifier.unsubscribe(this);
        }
        this.listBoxNotifier = Observable.getNotifier(
            this.listBox
        );
        this.listBoxNotifier.subscribe(this);
    }

    /**
     * @internal
     */
    public regionChanged(): void {
        if (this.regionNotifier) {
            this.regionNotifier.unsubscribe(this);
        }
        this.regionNotifier = Observable.getNotifier(
            this.region
        );
        this.regionNotifier.subscribe(this);
    }

    /**
     * @internal
     */
    public handleChange(source: unknown, args: unknown): void {
        if (
            source instanceof Listbox
            && typeof args === 'string'
        ) {
            if (args === 'selectedIndex') {
                this.scrollOptionIntoView();
            }
            if (args === "options") {
                this.filterOptions();
                void this.selectFirstOption();
            }
        }
        if (source instanceof AnchoredRegion) {
            if (args === 'initialLayoutComplete') {
                this.scrollOptionIntoView();
            }
        }
    }

    private get firstSelectedOption(): ListOption | null {
        return this.listBox.selectedOptions[0] as ListOption ?? null;
    }

    private get hasSelectableOptions(): boolean {
        return this.childItems.length > 0 && !this.childItems.every(o => o.disabled);
    }

    private scrollOptionIntoView(): void {
        requestAnimationFrame(() => {
            this.firstSelectedOption?.scrollIntoView({ block: 'nearest' });
        });
    }

    private setActiveMappingConfigs(): void {
        this.activeMappingConfigs = this.activeCharacter
            ? this.mentionExtensionConfig?.find(
                config => config.character === this.activeCharacter
            )?.mappingConfigs
            : undefined;
    }

    private filterOptions(): void {
        if (!this.childItems || this.filter === undefined) {
            return;
        }
        const normalizedFilter = normalizeString(this.filter.trim());
        this.childItems.forEach(listOption => {
            const normalizedOptionText = normalizeString(listOption.text.trim());
            const includesSearchString = normalizedOptionText.includes(normalizedFilter);
            listOption.disabled = !includesSearchString;
            listOption.hidden = !includesSearchString;
        });
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
