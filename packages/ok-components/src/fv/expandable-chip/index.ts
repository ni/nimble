import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { itemRemoveLabel } from '@ni/nimble-components/dist/esm/label-provider/core/label-tokens';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-expandable-chip': FvExpandableChip;
    }
}

/** A block-style chip button that opens an associated popover and can be removed. */
export class FvExpandableChip extends FoundationElement {
    @attr({ mode: 'boolean' })
    public disabled = false;

    @attr({ mode: 'boolean' })
    public expanded = false;

    @attr({ mode: 'boolean' })
    public removable = false;

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
    public get removeButtonContent(): string {
        return itemRemoveLabel.getValueFor(this);
    }

    /** @internal */
    public handleRemoveClick(event: Event): void {
        event.stopPropagation();
        this.$emit('remove');
    }

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
            const root = this.getRootNode();
            const controlledElement = this.controlsElement
                ?? (this.controls && (root instanceof Document || root instanceof ShadowRoot)
                    ? root.getElementById(this.controls) : null);
            if (controlledElement && 'ariaControlsElements' in button) {
                button.ariaControlsElements = [controlledElement];
            } else {
                if ('ariaControlsElements' in button) {
                    button.ariaControlsElements = [];
                }
                if (this.controls) {
                    button.setAttribute('aria-controls', this.controls);
                } else {
                    button.removeAttribute('aria-controls');
                }
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
