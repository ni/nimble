import {
    DesignSystem,
    FoundationElement,
    isListboxOption,
    Listbox,
} from '@microsoft/fast-foundation';

import { attr, observable } from '@microsoft/fast-element';
import { keyArrowDown, keyArrowUp, keyEnter, keyTab } from '@microsoft/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';
import type { ListOption } from '../../../list-option';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mention-box': MentionBox;
    }
}

/**
 * A nimble styled Mention Box
 */
export class MentionBox extends FoundationElement {
    /**
     * @internal
     */
    public listBox!: Listbox | null;

    @attr
    public filter!: string;

    @observable
    public slottedOptions!: Element[];

    /**
     * @internal
     */
    @observable
    public readonly childItems: Element[] = [];

    public get options(): ListOption[] {
        return this._options;
    }

    public set options(value: ListOption[]) {
        this._options = value;
    }

    private _options: ListOption[] = [];

    public slottedOptionsChanged(_prev: Element[] | undefined, next: Element[]): void {
        this.options = next.reduce<ListOption[]>((options, item) => {
            if (isListboxOption(item)) {
                options.push(item);
            }
            return options;
        }, []);
        this.filterUsers();
    }

    public filterChanged(_prev: string | undefined, next: string): void {
        this.filter = next;
        this.filterUsers();
    }

    public filterUsers(): void {
        if (this.filter !== undefined) {
            this._options.forEach(o => {
                const checkFlag = !o.text.toLowerCase().startsWith(this.filter.toLowerCase());
                o.disabled = checkFlag;
                o.hidden = checkFlag;
            });
            const isFilteredListEmpty = this._options.every(o => !o.text.toLowerCase().startsWith(this.filter.toLowerCase()));
            if (isFilteredListEmpty) {
                this.$emit('change');
            }
        }
        this.selectFirstListOption();
    }

    public selectFirstListOption(): void {
        this.listBox?.selectFirstOption();
    }

    public clickHandler(e: MouseEvent): boolean {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const captured = (e.target as HTMLElement).closest(
            'option,[role=option]'
        ) as ListOption | null;

        if (!captured || captured.disabled) {
            return false;
        }
        this.$emit('change', {
            id: captured.value,
            name: captured.textContent
        });
        return true;
    }

    public keydownHandler(e: Event & KeyboardEvent): boolean {
        const key = e.key;
        switch (key) {
            case keyTab:
            case keyEnter: {
                if (this.listBox?.firstSelectedOption) {
                    this.$emit('change', {
                        id: this.listBox?.firstSelectedOption?.value,
                        name: this.listBox?.firstSelectedOption?.textContent
                    });
                }
                return true;
            }
            case keyArrowDown: {
                if (!e.shiftKey) {
                    this.listBox?.selectNextOption();
                }
                return true;
            }
            case keyArrowUp: {
                if (!e.shiftKey) {
                    this.listBox?.selectPreviousOption();
                }
                return true;
            }

            default: {
                return false;
            }
        }
    }
}

const nimbleMentionBox = MentionBox.compose({
    baseName: 'mention-box',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleMentionBox());
export const mentionBoxTag = DesignSystem.tagFor(MentionBox);
