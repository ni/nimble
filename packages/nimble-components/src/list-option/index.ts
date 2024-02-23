import {
    DesignSystem,
    ListboxOption as FoundationListboxOption
} from '@microsoft/fast-foundation';
import { observable, attr } from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';
import type { ForceUpdateDisplayValue } from '../patterns/dropdown/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-list-option': ListOption;
    }
}

/**
 * A nimble-styled HTML listbox option
 */
export class ListOption extends FoundationListboxOption {
    /** @internal */
    public contentSlot!: HTMLSlotElement;

    /**
     * The hidden state of the element.
     *
     * @public
     * @defaultValue - false
     * @remarks
     * HTML Attribute: hidden
     */
    @attr({ mode: 'boolean' })
    public override hidden = false;

    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    public get elementTextContent(): string {
        return this.contentSlot
            .assignedNodes()
            .map(node => node.textContent?.trim())
            .join(' ');
    }

    protected override selectedChanged(): void {
        super.selectedChanged();
        if (this.parentHasForceUpdateDisplayValue(this.parentElement)) {
            this.parentElement.updateDisplayValue();
        }
    }

    protected override disabledChanged(prev: boolean, next: boolean): void {
        super.disabledChanged(prev, next);
        if (this.parentHasForceUpdateDisplayValue(this.parentElement)) {
            this.parentElement.updateDisplayValue();
        }
    }

    private hiddenChanged(): void {
        if (this.hidden) {
            this.classList.add('hidden-option');
        } else {
            this.classList.remove('hidden-option');
        }

        if (this.parentHasForceUpdateDisplayValue(this.parentElement)) {
            this.parentElement.updateDisplayValue();
        }
    }

    private parentHasForceUpdateDisplayValue(
        parent: unknown
    ): parent is ForceUpdateDisplayValue {
        if (this.parentElement === null) {
            return false;
        }

        return 'updateDisplayValue' in (parent as Element);
    }
}

const nimbleListOption = ListOption.compose({
    baseName: 'list-option',
    baseClass: FoundationListboxOption,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleListOption());
export const listOptionTag = 'nimble-list-option';
