import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement, isListboxOption } from '@microsoft/fast-foundation';
import { keyTab, keyEnter, keyArrowDown, keyArrowUp } from '@microsoft/fast-web-utilities';
import type { ListOption } from '../../list-option';
import type { Listbox } from '../../listbox';
import type { MentionDetail } from '../editor/types';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-mention-list-box': RichTextMentionListBox;
    }
}

/**
 * A rich text mention list box which acts as a popup for @ mention support in editor
 */
export class RichTextMentionListBox extends FoundationElement {
    @attr
    public filter?: string;

    @observable
    public slottedOptions: Element[] = [];

    /**
     * @internal
     */
    public listBox!: Listbox;

    public get options(): ListOption[] {
        return this._options;
    }

    public set options(value: ListOption[]) {
        this._options = value;
    }

    private _options: ListOption[] = [];

    /**
     * @public
     */
    public async selectFirstListOption(): Promise<void> {
        const definedElements = [this.listBox?.matches(':not(:defined)')
            ? customElements.whenDefined(this.listBox.localName)
            : Promise.resolve()];
        await Promise.all(definedElements);
        this.listBox?.selectFirstOption();
    }

    /**
     * @public
     */
    public keydownHandler(e: Event & KeyboardEvent): boolean {
        const key = e.key;
        switch (key) {
            case keyTab:
            case keyEnter: {
                if (this.listBox.firstSelectedOption) {
                    this.$emit('change', {
                        href: this.listBox.firstSelectedOption.value,
                        displayName: this.listBox.firstSelectedOption.innerText
                    } as MentionDetail);
                }
                return true;
            }
            case keyArrowDown: {
                if (!e.shiftKey) {
                    this.listBox.selectNextOption();
                }
                return true;
            }
            case keyArrowUp: {
                if (!e.shiftKey) {
                    this.listBox.selectPreviousOption();
                }
                return true;
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
        this.$emit('change', {
            href: captured.value,
            displayName: captured.innerText
        } as MentionDetail);
        return true;
    }

    private slottedOptionsChanged(_prev: Element[] | undefined, next: Element[]): void {
        this.options = next.reduce<ListOption[]>((options, item) => {
            if (isListboxOption(item)) {
                options.push(item);
            }
            return options;
        }, []);
        this.filterUsers();
    }

    private filterChanged(_prev: string | undefined, next: string): void {
        this.filter = next;
        this.filterUsers();
    }

    private filterUsers(): void {
        if (this.filter !== undefined) {
            this._options.forEach(o => {
                const checkFlag = !o.text.toLowerCase().startsWith(this.filter!.toLowerCase());
                o.disabled = checkFlag;
                o.hidden = checkFlag;
            });
        }
        void this.selectFirstListOption();
    }
}

const nimbleRichTextMentionListBox = RichTextMentionListBox.compose({
    baseName: 'rich-text-mention-list-box',
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichTextMentionListBox());
export const richTextMentionListBoxTag = DesignSystem.tagFor(RichTextMentionListBox);