import { attr, html, observable, ref } from '@microsoft/fast-element';
import {
    DesignSystem,
    Combobox as FoundationCombobox,
    ComboboxOptions,
    comboboxTemplate as template
} from '@microsoft/fast-foundation';
import { exclamationMark16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';
import type { ToggleButton } from '../toggle-button';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-combobox': Combobox;
    }
}

/**
 * A nimble-styed HTML combobox
 */
export class Combobox extends FoundationCombobox {
    /**
     * The ref to the internal `.control` element.
     *
     * @internal
     */
    @observable
    public readonly dropdownButton: ToggleButton | undefined;

    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText!: string;

    // Workaround for https://github.com/microsoft/fast/issues/5123
    public override setPositioning(): void {
        if (!this.$fastController.isConnected) {
            // Don't call setPositioning() until we're connected,
            // since this.forcedPosition isn't initialized yet.
            return;
        }
        super.setPositioning();
    }

    // Workaround for https://github.com/microsoft/fast/issues/5773
    public override slottedOptionsChanged(
        prev: HTMLElement[],
        next: HTMLElement[]
    ): void {
        const value = this.value;
        super.slottedOptionsChanged(prev, next);
        if (value) {
            this.value = value;
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        // Call setPositioning() after this.forcedPosition is initialized.
        this.setPositioning();
        this.addEventListener('focusout', this.focusOutHandler);
        const inputElement = this.shadowRoot?.querySelector('.selected-value');
        if (this.ariaLabel) {
            inputElement?.setAttribute('aria-label', this.ariaLabel);
        }
    }

    public override disconnectedCallback(): void {
        this.removeEventListener('focusout', this.focusOutHandler);
    }

    public onDropdownClick(e: Event): void {
        this.open = this.dropdownButton?.checked ?? false;
        e.stopPropagation();
    }

    private readonly focusOutHandler = (): void => {
        if (this.dropdownButton) {
            this.dropdownButton.checked = false;
        }
    };
}

const nimbleCombobox = Combobox.compose<ComboboxOptions>({
    baseName: 'combobox',
    baseClass: FoundationCombobox,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    end: html<Combobox>`
        <div class="end-slot-container">
            <span class="error-content">${exclamationMark16X16.data}</span>
            <div class="separator"></div>
            <nimble-toggle-button
                ${ref('dropdownButton')}
                @click="${(x, c) => x.onDropdownClick(c.event)}"
                class="dropdown-button"
                ?disabled="${x => x.disabled}"
                part="button"
                aria-haspopup="true"
                aria-expanded="${x => x.open}"
            >
                <nimble-arrow-expander-down-icon
                    slot="start"
                    class="dropdown-icon"
                />
            </nimble-toggle-button>
        </div>
        <span part="actions">
            <slot name="actions"></slot>
        </span>
        <div
            id="errortext"
            class="errortext error-content"
            title="${x => x.errorText}"
            aria-live="polite"
        >
            ${x => x.errorText}
        </div>
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCombobox());
