import { attr, observable } from '@ni/fast-element';
import {
    applyMixins,
    DesignSystem,
    FoundationElement,
    StartEnd,
    type FoundationElementDefinition,
    type StartOptions
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChipAppearance } from './types';
import { slotTextContent } from '../utilities/models/slot-text-content';
import { chipRemoveLabel } from '../label-provider/core/label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-chip': Chip;
    }
}

export type ChipOptions = FoundationElementDefinition & StartOptions;

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
        return `${chipRemoveLabel.getValueFor(this)} ${this.elementTextContent}`;
    }

    /** @internal */
    public contentSlot!: HTMLSlotElement;

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
