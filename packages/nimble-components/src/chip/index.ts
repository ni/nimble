import { attr, observable } from '@ni/fast-element';
import { applyMixins, DesignSystem, FoundationElement, StartEnd, type FoundationElementDefinition, type StartOptions } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChipAppearance } from './types';
import { slotTextContent } from '../utilities/models/slot-text-content';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-chip': Chip;
    }
}

export type ChipOptions = FoundationElementDefinition & StartOptions;

/**
 * A Nimble demo component (not for production use)
 */
export class Chip extends FoundationElement {
    @attr({ mode: 'boolean', attribute: 'prevent-remove' })
    public preventRemove = false;

    @attr({ mode: 'boolean' })
    public disabled = false;

    @attr()
    public appearance: ChipAppearance = 'outline';

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
    public contentSlot!: HTMLSlotElement;

    public handleRemoveClick(): void {
        if (!this.preventRemove) {
            this.$emit('remove');
        }
    }

    public keyDownHandler(event: KeyboardEvent): void {
        if ((event.key === 'Delete' || event.key === 'Backspace') && !this.preventRemove) {
            this.handleRemoveClick();
            event.stopPropagation();
            event.preventDefault();
        }
    }
}
applyMixins(Chip, StartEnd);

const nimbleChip = Chip.compose<ChipOptions>({
    baseName: 'chip',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleChip());
export const chipTag = 'nimble-chip';
