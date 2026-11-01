import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-expandable-chip': FvExpandableChip;
    }
}

/** A block-style chip button that opens an associated popover. */
export class FvExpandableChip extends FoundationElement {
    @attr({ mode: 'boolean' })
    public disabled = false;

    @attr({ mode: 'boolean' })
    public expanded = false;

    @attr({ attribute: 'accessible-label' })
    public accessibleLabel = '';

    @attr({ attribute: 'controls' })
    public controls = '';
}

const okFvExpandableChip = FvExpandableChip.compose({
    baseName: 'fv-expandable-chip',
    template,
    styles,
    shadowOptions: { delegatesFocus: true }
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvExpandableChip());
export const fvExpandableChipTag = 'ok-fv-expandable-chip';
