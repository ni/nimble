import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import type { AnchoredRegion } from '@ni/nimble-components/dist/esm/anchored-region';
import { styles } from './styles';
import { template } from './template';
import {
    FvSplitButtonAnchorAppearance,
    type FvSplitButtonAnchorAppearance as FvSplitButtonAnchorAppearanceType,
    FvSplitButtonAnchorAppearanceVariant,
    type FvSplitButtonAnchorAppearanceVariant as FvSplitButtonAnchorAppearanceVariantType
} from './types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-split-button-anchor': FvSplitButtonAnchor;
    }
}

/**
 * A split button with an anchor-backed primary action and a secondary expandable menu surface.
 */
export class FvSplitButtonAnchor extends FoundationElement {
    @attr
    public label = 'Primary function';

    @attr
    public href = '';

    @attr
    public target = '';

    @attr
    public rel = '';

    @attr
    public download = '';

    @attr({ mode: 'boolean' })
    public disabled = false;

    @attr({ mode: 'boolean' })
    public open = false;

    @attr()
    public appearance: FvSplitButtonAnchorAppearanceType = FvSplitButtonAnchorAppearance.outline;

    @attr({ attribute: 'appearance-variant' })
    public appearanceVariant: FvSplitButtonAnchorAppearanceVariantType = FvSplitButtonAnchorAppearanceVariant.default;

    /** @internal */
    @observable
    public splitButtonContainer?: HTMLDivElement;

    /** @internal */
    @observable
    public region?: AnchoredRegion;

    /** @internal */
    public disabledChanged(): void {
        if (this.disabled) {
            this.setOpen(false);
        }
    }

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener('click', this.documentClickHandler);
        document.addEventListener('keydown', this.keydownHandler);
    }

    /** @internal */
    public override disconnectedCallback(): void {
        document.removeEventListener('click', this.documentClickHandler);
        document.removeEventListener('keydown', this.keydownHandler);
        super.disconnectedCallback();
    }

    /** @internal */
    public handlePrimaryClick(): void {
        if (this.disabled) {
            return;
        }

        this.dispatchEvent(new CustomEvent('trigger', {
            bubbles: true,
            composed: true
        }));
    }

    /** @internal */
    public handleToggleClick(): void {
        if (this.disabled) {
            return;
        }

        this.setOpen(!this.open);
    }

    /** @internal */
    public handleMenuChange(): void {
        this.setOpen(false);
    }

    /** @internal */
    public regionChanged(prev: AnchoredRegion | undefined, _next: AnchoredRegion | undefined): void {
        if (prev) {
            prev.removeEventListener('change', this.menuChangeHandler);
        }
        if (this.region) {
            this.region.anchorElement = this.splitButtonContainer ?? this;
            this.region.addEventListener('change', this.menuChangeHandler, { capture: true });
        }
    }

    /** @internal */
    public splitButtonContainerChanged(): void {
        if (this.region) {
            this.region.anchorElement = this.splitButtonContainer ?? this;
        }
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

    private readonly menuChangeHandler = (): void => {
        this.handleMenuChange();
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

const okFvSplitButtonAnchor = FvSplitButtonAnchor.compose({
    baseName: 'fv-split-button-anchor',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvSplitButtonAnchor());
export const fvSplitButtonAnchorTag = 'ok-fv-split-button-anchor';