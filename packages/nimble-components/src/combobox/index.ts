import { attr, html, observable, ref } from '@microsoft/fast-element';
import {
    DesignSystem,
    Combobox as FoundationCombobox,
    ComboboxOptions,
    comboboxTemplate as template
} from '@microsoft/fast-foundation';
import {
    keyArrowDown,
    keyArrowUp,
    keyEnter,
    keySpace
} from '@microsoft/fast-web-utilities';
import { exclamationMark16X16 } from '@ni/nimble-tokens/dist/icons/ts';
import type { ToggleButton } from '../toggle-button';
import { styles } from './styles';

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
     * The ref to the internal dropdown button element.
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
    public errorText: string | undefined;

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
        this.addEventListener('focusout', this.focusOutHandler);
        const inputElement = this.shadowRoot?.querySelector('.selected-value');
        // Workaround for https://github.com/microsoft/fast/issues/6041. This doesn't address the case
        // where a user changes the 'aria-label' attribute programmatically, but I don't think we want
        // to try and handle that case at the moment.
        if (this.ariaLabel) {
            inputElement?.setAttribute('aria-label', this.ariaLabel);
        }
    }

    public override disconnectedCallback(): void {
        this.removeEventListener('focusout', this.focusOutHandler);
    }

    public toggleButtonClickHander(e: Event): void {
        this.open = !this.open;
        e.stopPropagation();
    }

    public toggleButtonKeyDownHandler(e: KeyboardEvent): boolean {
        switch (e.key) {
            case keyArrowUp:
            case keyArrowDown:
            case keySpace:
            case keyEnter:
                this.open = true;
                this.stopPropagation(e);
                return false;
            default:
                return true;
        }
    }

    protected override openChanged(): void {
        super.openChanged();
        if (this.dropdownButton) {
            this.dropdownButton.checked = this.open;
        }
    }

    private readonly focusOutHandler = (): void => {
        this.open = false;
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
                appearance="ghost"
                ?checked="${x => x.open}"
                ?disabled="${x => x.disabled}"
                content-hidden="true"
                @click="${(x, c) => x.toggleButtonClickHander(c.event)}"
                @keydown="${(x, c) => x.toggleButtonKeyDownHandler(c.event as KeyboardEvent)}"
                class="dropdown-button"
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
        <div class="error-text" title="${x => x.errorText}" aria-live="polite">
            ${x => x.errorText}
        </div>
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCombobox());
