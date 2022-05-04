import { attr, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    Combobox as FoundationCombobox,
    ComboboxOptions,
    comboboxTemplate as template
} from '@microsoft/fast-foundation';
import { arrowExpanderDown16X16, exclamationMark16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-combobox': Combobox;
    }
}

/**
 * A nimble-styed HTML select
 */
export class Combobox extends FoundationCombobox {
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

    public override connectedCallback(): void {
        super.connectedCallback();
        // Call setPositioning() after this.forcedPosition is initialized.
        this.setPositioning();
    }

    public onDropdownClick(): void {
        this.open = true;
    }
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
            <nimble-button onclick="onDropdownClick()" class="dropdown-button" ?disabled="${x => x.disabled}">
                <nimble-arrow-expander-down-icon slot="start" class="dropdown-icon"/>
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
