import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import {
    FvSplitButtonAppearance,
    type FvSplitButtonAppearance as FvSplitButtonAppearanceType,
    FvSplitButtonAppearanceVariant,
    type FvSplitButtonAppearanceVariant as FvSplitButtonAppearanceVariantType
} from './types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-split-button': FvSplitButton;
    }
}

/**
 * A button with a primary action and a secondary expandable menu surface.
 */
export class FvSplitButton extends FoundationElement {
    @attr
    public label = 'Primary function';

    @attr({ mode: 'boolean' })
    public disabled = false;

    @attr({ mode: 'boolean' })
    public open = false;

    @attr()
    public appearance: FvSplitButtonAppearanceType = FvSplitButtonAppearance.outline;

    @attr({ attribute: 'appearance-variant' })
    public appearanceVariant: FvSplitButtonAppearanceVariantType = FvSplitButtonAppearanceVariant.default;

    public disabledChanged(): void {
        if (this.disabled) {
            this.setOpen(false);
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener('click', this.documentClickHandler);
        document.addEventListener('keydown', this.keydownHandler);
    }

    public override disconnectedCallback(): void {
        document.removeEventListener('click', this.documentClickHandler);
        document.removeEventListener('keydown', this.keydownHandler);
        super.disconnectedCallback();
    }

    public handlePrimaryClick(): void {
        if (this.disabled) {
            return;
        }

        this.dispatchEvent(new CustomEvent('trigger', {
            bubbles: true,
            composed: true
        }));
    }

    public handleToggleClick(): void {
        if (this.disabled) {
            return;
        }

        this.setOpen(!this.open);
    }

    public handleMenuChange(): void {
        this.setOpen(false);
    }

    private readonly documentClickHandler = (event: Event): void => {
        if (!this.open) {
            return;
        }

        if (!event.composedPath().includes(this)) {
            this.setOpen(false);
        }
    };

    private readonly keydownHandler = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            this.setOpen(false);
        }
    };

    private setOpen(nextOpen: boolean): void {
        if (this.open === nextOpen) {
            return;
        }

        this.open = nextOpen;
        this.dispatchEvent(new CustomEvent('toggle', {
            bubbles: true,
            composed: true,
            detail: { open: this.open }
        }));
    }
}

const okFvSplitButton = FvSplitButton.compose({
    baseName: 'fv-split-button',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvSplitButton());
export const fvSplitButtonTag = 'ok-fv-split-button';