import {
    AnchoredRegion,
    DesignSystem,
    Listbox,
} from '@microsoft/fast-foundation';

import { attr } from '@microsoft/fast-element';
import { keyArrowDown, keyArrowUp, keyEnter, keyEscape, keyTab, limit } from '@microsoft/fast-web-utilities';
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
export class MentionBox extends Listbox {
    /**
     * The collection of currently filtered options.
     *
     * @public
     */
    public filteredOptions: ListOption[] = [];

    @attr
    public filter = '';

    public override slottedOptionsChanged(prev: Element[] | undefined, next: Element[]): void {
        super.slottedOptionsChanged(prev, next);
        this.filterOptions();
    }

    public filterChanged(_prev: string | undefined, next: string): void {
        this.filter = next;
        this.filterOptions();
        if (this.filteredOptions.length) {
            this.selectedOptions = [this.filteredOptions[0]!];
            this.selectedIndex = this.options.indexOf(
                this.firstSelectedOption
            );
        } else {
            this.selectedIndex = -1;
            const parentElement = this.parentElement as AnchoredRegion;
            parentElement.hidden = true;
            this.filter = 'reset';
        }
    }

    public override selectedIndexChanged(prev: number | undefined, next: number): void {
        if (this.$fastController.isConnected) {
            // eslint-disable-next-line no-param-reassign
            next = limit(-1, this.options.length - 1, next);

            // we only want to call the super method when the selectedIndex is in range
            if (next !== this.selectedIndex) {
                this.selectedIndex = next;
                return;
            }

            super.selectedIndexChanged(prev, next);
        }
    }

    /**
     * Moves focus to the previous selectable option.
     *
     * @internal
     */
    public override selectPreviousOption(): void {
        if (!this.disabled && this.selectedIndex > 0) {
            this.selectedIndex -= 1;
        }
    }

    public override get options(): ListOption[] {
        return this.filteredOptions.length ? this.filteredOptions : this._options;
    }

    public override set options(value: ListOption[]) {
        this._options = value;
    }

    /**
     * Filter available options by text value.
     *
     * @public
     */
    public filterOptions(): void {
        const filter = this.filter.toLowerCase();
        const parentElement = this.parentElement as AnchoredRegion;
        parentElement.hidden = false;
        this.filteredOptions = this._options.filter(o => o.text.toLowerCase().startsWith(this.filter.toLowerCase()));
        if (!this.filteredOptions.length && !filter) {
            this.filteredOptions = this._options;
        }

        this._options.forEach(o => {
            o.hidden = !this.filteredOptions.includes(o);
        });
    }

    /**
     * Toggles the selected state of the option
     * @internal
     */
    public override selectedOptionsChanged(
        _prev: ListOption[] | undefined,
        next: ListOption[]
    ): void {
        if (this.$fastController.isConnected) {
            this._options.forEach(o => {
                o.selected = next.includes(o);
            });
        }
    }

    public override focusAndScrollOptionIntoView(): void {
        if (this.contains(document.activeElement)) {
            if (this.firstSelectedOption) {
                requestAnimationFrame(() => {
                    this.firstSelectedOption?.scrollIntoView({ block: 'nearest' });
                });
            }
        }
    }

    public override clickHandler(e: MouseEvent): boolean {
        if (this.disabled) {
            return false;
        }
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

    public override keydownHandler(e: Event & KeyboardEvent): boolean {
        const key = e.key;
        switch (key) {
            case keyTab:
            case keyEnter: {
                if (this.firstSelectedOption) {
                    this.$emit('change', {
                        id: this
                            .firstSelectedOption
                            ?.value,
                        name: this
                            .firstSelectedOption
                            ?.textContent
                    });
                }
                return true;
            }

            case keyEscape: {
                return true;
            }
            // Select the next selectable option
            case keyArrowDown: {
                if (!e.shiftKey) {
                    this.selectNextOption();
                }
                return true;
            }

            // Select the previous selectable option
            case keyArrowUp: {
                if (!e.shiftKey) {
                    this.selectPreviousOption();
                }
                return true;
            }

            default: {
                return false;
            }
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
// export interface MentionBox extends ARIAGlobalStatesAndProperties {}
// applyMixins(MentionBox, ARIAGlobalStatesAndProperties);

const nimbleMentionBox = MentionBox.compose({
    baseName: 'mention-box',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleMentionBox());
export const mentionBoxTag = DesignSystem.tagFor(MentionBox);
