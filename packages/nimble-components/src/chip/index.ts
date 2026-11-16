import { attr, nullableNumberConverter, observable } from '@ni/fast-element';
import { keyEscape } from '@ni/fast-web-utilities';
import {
    applyMixins,
    DesignSystem,
    FoundationElement,
    StartEnd,
    type EndOptions,
    type FoundationElementDefinition,
    type StartOptions
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChipAppearance } from './types';
import { slotTextContent } from '../utilities/models/slot-text-content';
import { itemRemoveLabel } from '../label-provider/core/label-tokens';
import type { ToggleButton } from '../toggle-button';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-chip': Chip;
    }
}

export type ChipOptions = FoundationElementDefinition
    & StartOptions
    & EndOptions;

/**
 * A Nimble chip component
 */
export class Chip extends FoundationElement {
    @attr({ mode: 'boolean' })
    public removable = false;

    @attr({ mode: 'boolean' })
    public disabled = false;

    @attr({ mode: 'boolean' })
    public selectable = false;

    @attr({ mode: 'boolean' })
    public selected = false;

    @attr()
    public appearance: ChipAppearance = ChipAppearance.outline;

    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;

    /**
     * Indicates whether the remove button is currently in a mousedown state.
     * Used to prevent the chip's active styling from showing when the remove button is being clicked.
     *
     * @internal
     * @remarks
     * This attribute is automatically managed by handleRemoveMousedown and should not be set directly.
     */
    @attr({ attribute: 'remove-button-active', mode: 'boolean' })
    public removeButtonActive = false;

    /** @internal */
    public readonly content?: HTMLElement[];

    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    public get elementTextContent(): string {
        return slotTextContent(this.contentSlot);
    }

    /** @internal */
    public get removeButtonContent(): string {
        return itemRemoveLabel.getValueFor(this);
    }

    /** @internal */
    public contentSlot!: HTMLSlotElement;

    private mouseUpHandler: EventListener | null = null;

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeButtonActive = false;
        if (this.mouseUpHandler) {
            document.removeEventListener('mouseup', this.mouseUpHandler);
            this.mouseUpHandler = null;
        }
    }

    /** @internal */
    public keydownHandler(e: KeyboardEvent): boolean {
        if (this.disabled) {
            return false;
        }
        switch (e.key) {
            case keyEscape:
                if (this.removable) {
                    e.stopPropagation();
                    this.$emit('remove');
                    return false;
                }
                return true;
            default:
                return true;
        }
    }

    /** @internal */
    public toggleButtonClickHandler(event: MouseEvent): void {
        event.stopPropagation();
    }

    /** @internal */
    public toggleButtonChangeHandler(event: Event): void {
        event.stopPropagation();
        this.selected = (event.currentTarget as ToggleButton).checked;
        this.$emit('selected-change', { selected: this.selected });
    }

    /** @internal */
    public handleRemoveClick(event: MouseEvent): void {
        event.stopPropagation();
        if (this.removable) {
            this.$emit('remove');
        }
    }

    /**
     * Handles mousedown events on the remove button.
     * Sets removeButtonActive to true and registers a document-level mouseup handler to clear it.
     *
     * @internal
     * @remarks
     * The mouseup listener is added to document to ensure it fires even if the mouse moves
     * outside the chip before being released. The listener is cleaned up in disconnectedCallback
     * to prevent memory leaks.
     */
    public handleRemoveMousedown(event: MouseEvent): void {
        event.stopPropagation();
        this.removeButtonActive = true;

        // Clean up any existing listener first
        if (this.mouseUpHandler) {
            document.removeEventListener('mouseup', this.mouseUpHandler);
        }

        this.mouseUpHandler = (): void => {
            this.removeButtonActive = false;
            if (this.mouseUpHandler) {
                document.removeEventListener('mouseup', this.mouseUpHandler);
                this.mouseUpHandler = null;
            }
        };
        document.addEventListener('mouseup', this.mouseUpHandler);
    }

    /** @internal */
    public handleRemoveKeyup(event: KeyboardEvent): void {
        event.stopPropagation();
    }
}
applyMixins(Chip, StartEnd);

const nimbleChip = Chip.compose<ChipOptions>({
    baseName: 'chip',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleChip());
export const chipTag = 'nimble-chip';
