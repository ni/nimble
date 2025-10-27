import { attr, nullableNumberConverter, observable } from '@ni/fast-element';
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

declare global {
    interface HTMLElementTagNameMap {
        'nimble-chip': Chip;
    }
}

export type ChipOptions = FoundationElementDefinition &
    StartOptions &
    EndOptions;

/**
 * A Nimble chip component
 */
export class Chip extends FoundationElement {
    @attr({ mode: 'boolean' })
    public removable = false;

    @attr({ mode: 'boolean' })
    public disabled = false;

    @attr()
    public appearance: ChipAppearance = ChipAppearance.outline;

    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;

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

    /** @internal */
    public handleRemoveClick(): void {
        if (this.removable) {
            this.$emit('remove');
        }
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
