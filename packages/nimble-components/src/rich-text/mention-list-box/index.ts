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
    public filter = '';

    /**
     * @internal
     */
    public listBox!: Listbox;

    private hasSelectableOptions = true;

    private mentionExtensionConfig?: MentionExtensionConfiguration[];

    private suggestionProps!: SuggestionProps;

    /**
     * @public
     */
    public async selectFirstListOption(): Promise<void> {
        const definedElements = [
            this.listBox?.matches(':not(:defined)')
                ? customElements.whenDefined(this.listBox.localName)
                : Promise.resolve()
        ];
        await Promise.all(definedElements);
        if (this.hasSelectableOptions) {
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
                    && this.hasSelectableOptions
                ) {
                    this.activateMention({
                        href: this.listBox.firstSelectedOption.value,
                        displayName: this.listBox.firstSelectedOption.innerText
                    } as MentionDetail);
                    return true;
                }
                return false;
            }
            case keyArrowDown: {
                if (!event.shiftKey && this.hasSelectableOptions) {
                    this.listBox.selectNextOption();
                    this.scrollOptionIntoView();
                    return true;
                }
                return false;
            }
            case keyArrowUp: {
                if (!event.shiftKey && this.hasSelectableOptions) {
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
            displayName: captured.innerText
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
        this.setActiveCharacter(props.text.slice(0, 1));
        this.filter = props.query;
        this.setAnchorElement(props.decorationNode as HTMLElement);
        this.setOpen(true);
        void this.selectFirstListOption();
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

    private setActiveCharacter(activeCharacter: string): void {
        this.activeCharacter = activeCharacter;
    }

    private setAnchorElement(anchorElement: HTMLElement): void {
        if (this.region) {
            this.region.anchorElement = anchorElement;
            this.region.update();
        }
    }

    private scrollOptionIntoView(): void {
        this.listBox?.firstSelectedOption?.scrollIntoView({ block: 'nearest' });
    }

    private setActiveMappingConfigs(): void {
        this.activeMappingConfigs = this.activeCharacter ? this.mentionExtensionConfig?.find(config => config.character === this.activeCharacter)?.mappingConfigs : undefined;
    }

    private filterOptions(): void {
        if (!this.childItems) {
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
        this.hasSelectableOptions = !this.childItems.map(element => element as ListOption).every(
            list => list.disabled
        );
        void this.selectFirstListOption();
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
