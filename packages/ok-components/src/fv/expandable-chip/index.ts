import { attr, observable } from '@ni/fast-element';
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

    @observable
    public controlsElement?: Element;

    /** @internal */
    @observable
    public buttonElement?: HTMLButtonElement;

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.syncControlsRelationship();
    }

    /** @internal */
    public controlsChanged(): void {
        this.syncControlsRelationship();
    }

    /** @internal */
    public controlsElementChanged(): void {
        this.syncControlsRelationship();
    }

    /** @internal */
    public buttonElementChanged(): void {
        this.syncControlsRelationship();
    }

    private syncControlsRelationship(): void {
        const button = this.buttonElement as (HTMLButtonElement & { ariaControlsElements?: Element[] }) | undefined;
        if (button) {
            const root = this.getRootNode() as Document | ShadowRoot;
            const controlledElement = this.controlsElement
                ?? (this.controls ? root.getElementById(this.controls) : null);
            if (controlledElement) {
                button.ariaControlsElements = [controlledElement];
            }
        }
    }
}

const okFvExpandableChip = FvExpandableChip.compose({
    baseName: 'fv-expandable-chip',
    template,
    styles,
    shadowOptions: { delegatesFocus: true }
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvExpandableChip());
export const fvExpandableChipTag = 'ok-fv-expandable-chip';
