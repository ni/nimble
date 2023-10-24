import {
    DesignSystem,
    FoundationElement,
    Listbox,
} from '@microsoft/fast-foundation';

import { attr, observable } from '@microsoft/fast-element';
import { keyArrowDown, keyArrowUp, keyEnter, keyTab } from '@microsoft/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';
import { ListOption } from '../../../list-option';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mention-box': MentionBox;
    }
}

/**
 * A nimble styled Mention Box
 */
export class MentionBox extends FoundationElement {
    /** @internal */
    @observable
    public filteredOptions: ListOption[] = [];

    public options: ListOption[] = [];

    /**
     * @internal
     */
    public listBox!: Listbox | null;

    @attr
    public filter!: string;

    /**
     * @internal
     */
    @observable
    public readonly childItems: Element[] = [];

    public childItemsChanged(): void {
        void this.updateUserListDetail();
    }

    public async updateUserListDetail(): Promise<void> {
        const definedElements = this.childItems.map(async item => (item.matches(':not(:defined)')
            ? customElements.whenDefined(item.localName)
            : Promise.resolve()));
        await Promise.all(definedElements);
        this.options = this.childItems.filter(
            (x): x is ListOption => x instanceof ListOption
        );
        this.filterUsers();
    }

    public filterChanged(_prev: string | undefined, next: string): void {
        this.filter = next;
        this.filterUsers();
    }

    public filterUsers(): void {
        if (this.filter) {
            this.filteredOptions = this.options.filter(o => o.textContent!.toLowerCase().startsWith(this.filter.toLowerCase()));
        } else {
            this.filteredOptions = this.options;
        }
        void this.selectFirstListOption();
    }

    public async selectFirstListOption(): Promise<void> {
        const definedElements = [this.listBox?.matches(':not(:defined)')
            ? customElements.whenDefined(this.listBox?.localName)
            : Promise.resolve()];
        await Promise.all(definedElements);
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
