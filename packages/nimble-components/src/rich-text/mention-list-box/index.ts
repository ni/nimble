import { observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import {
    keyTab,
    keyEnter,
    keyArrowDown,
    keyArrowUp,
    keyEscape
} from '@microsoft/fast-web-utilities';
import type { SuggestionProps } from '@tiptap/suggestion';
import type { ListOption } from '../../list-option';
import type { Listbox } from '../../listbox';
import type { MentionDetail } from '../editor/types';
import { styles } from './styles';
import { template } from './template';
import type { AnchoredRegion } from '../../anchored-region';
import type { MentionExtensionConfiguration } from '../models/mention-extension-configuration';
import type { MappingConfigs } from '../../rich-text-mention/base/types';
import { normalizeString } from '../../utilities/models/string-normalizer';

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
    public region?: AnchoredRegion;

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
    public readonly childItems: Element[] = [];

    /**
     * @internal
     */
    @observable
    public filter?: string;

    /**
     * @internal
     */
    public listBox!: Listbox;

    @observable
    private anchorElement?: HTMLElement;

    private hasAnySelectableOption = false;

    private mentionExtensionConfig?: MentionExtensionConfiguration[];

    private suggestionProps!: SuggestionProps;

    private readonly intersectionObserver: IntersectionObserver = new IntersectionObserver(
        entries => {
            if (
                !entries[0]?.isIntersecting
            ) {
                this.setOpen(false);
            }
        },
        { threshold: 1.0, root: document }
    );

    /**
     * @public
     */
    public async selectFirstOptionIfValidOptionExists(): Promise<void> {
        const definedElements = [
            this.listBox?.matches(':not(:defined)')
                ? customElements.whenDefined(this.listBox.localName)
                : Promise.resolve()
        ];
        await Promise.all(definedElements);
        this.updateSelectableOption();
        if (this.hasAnySelectableOption) {
            this.listBox?.selectFirstOption();
            this.scrollOptionIntoView();
        }
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
                if (
                    this.listBox.firstSelectedOption
                    && this.hasAnySelectableOption
                ) {
                    this.activateMention({
                        href: this.listBox.firstSelectedOption.value,
                        displayName: this.listBox.firstSelectedOption.text
                    } as MentionDetail);
                    return true;
                }
                return false;
            }
            case keyArrowDown: {
                if (!event.shiftKey && this.hasAnySelectableOption) {
                    this.listBox.selectNextOption();
                    this.scrollOptionIntoView();
                    return true;
                }
                return false;
            }
            case keyArrowUp: {
                if (!event.shiftKey && this.hasAnySelectableOption) {
                    this.listBox.selectPreviousOption();
                    this.scrollOptionIntoView();
                    return true;
                }
                return false;
            }
            case keyEscape: {
                this.setOpen(false);
                return false;
            }
            default: {
                return false;
            }
        }
    }

    /**
     * @public
     */
    public clickHandler(e: MouseEvent): boolean {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const captured = (e.target as HTMLElement).closest(
            'option,[role=option]'
        ) as ListOption | null;

        if (!captured || captured.disabled) {
            return false;
        }
        this.activateMention({
            href: captured.value,
            displayName: captured.text
        } as MentionDetail);
        return true;
    }

    public updateMentionExtensionConfig(mentionExtensionConfig?: MentionExtensionConfiguration[]): void {
        this.mentionExtensionConfig = mentionExtensionConfig;
        this.setActiveMappingConfigs();
        this.filterOptions();
    }

    public onMention(props: SuggestionProps): void {
        this.suggestionProps = props;
        this.activeCharacter = props.text.slice(0, 1);
        this.filter = props.query;
        this.anchorElement = props.decorationNode as HTMLElement;
        this.setOpen(true);
        void this.selectFirstOptionIfValidOptionExists();
    }

    public close(): void {
        this.setOpen(false);
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
    public filterChanged(): void {
        this.filterOptions();
    }

    /**
     * @internal
     */
    public childItemsChanged(): void {
        void this.selectFirstOptionIfValidOptionExists();
    }

    /**
     * @internal
     */
    public anchorElementChanged(prev: HTMLElement, next: HTMLElement): void {2
        if (prev) {
            this.intersectionObserver.unobserve(prev);
        }
        if (this.region && this.anchorElement) {
            this.region.anchorElement = this.anchorElement;
            this.region.update();
            this.intersectionObserver.observe(next);
        }
    }

    private scrollOptionIntoView(): void {
        this.listBox?.firstSelectedOption?.scrollIntoView({ block: 'nearest' });
    }

    private setActiveMappingConfigs(): void {
        this.activeMappingConfigs = this.activeCharacter ? this.mentionExtensionConfig?.find(config => config.character === this.activeCharacter)?.mappingConfigs : undefined;
    }

    private filterOptions(): void {
        if (!this.childItems || this.filter === undefined) {
            return;
        }
        const normalizedFilter = normalizeString(this.filter);
        this.childItems.forEach(element => {
            const listOption = element as ListOption;
            const normalizedText = normalizeString(listOption.text);
            const checkFlag = !normalizedText.includes(normalizedFilter);
            listOption.disabled = checkFlag;
            listOption.hidden = checkFlag;
        });
        void this.selectFirstOptionIfValidOptionExists();
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

    private updateSelectableOption(): void {
        this.hasAnySelectableOption = !this.childItems.map(element => element as ListOption).every(
            list => list.disabled
        );
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
