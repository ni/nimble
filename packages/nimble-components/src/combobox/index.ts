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
import type { ToggleButton } from '../toggle-button';
import { errorTextTemplate } from '../patterns/error/template';
import '../icons/exclamation-mark';
import '../icons/arrow-expander-down';

import { styles } from './styles';
import type { IHasErrorText } from '../patterns/error/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-combobox': Combobox;
    }
}

/**
 * A nimble-styed HTML combobox
 */
export class Combobox extends FoundationCombobox implements IHasErrorText {
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
        // Call setPositioning() after this.forcedPosition is initialized.
        this.setPositioning();
        this.updateInputAriaLabel();

        this.addEventListener('focusout', this.focusOutHandler);
        this.addEventListener('input', e => this.inputEventHandler(e));
    }

    public override disconnectedCallback(): void {
        this.removeEventListener('focusout', this.focusOutHandler);
        this.removeEventListener('input', this.inputEventHandler);
    }

    public toggleButtonClickHandler(e: Event): void {
        e.stopImmediatePropagation();
    }

    public toggleButtonChangeHandler(e: Event): void {
        this.open = this.dropdownButton!.checked;
        e.stopImmediatePropagation();
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

    public override filterOptions(): void {
        super.filterOptions();
        const enabledOptions = this.filteredOptions.filter(o => !o.disabled);
        this.filteredOptions = enabledOptions;
    }

    protected override openChanged(): void {
        super.openChanged();
        if (this.dropdownButton) {
            this.dropdownButton.checked = this.open;
        }
    }

    // Workaround for https://github.com/microsoft/fast/issues/6041.
    private ariaLabelChanged(_oldValue: string, _newValue: string): void {
        this.updateInputAriaLabel();
    }

    private updateInputAriaLabel(): void {
        const inputElement = this.shadowRoot?.querySelector('.selected-value');
        if (this.ariaLabel) {
            inputElement?.setAttribute('aria-label', this.ariaLabel);
        } else {
            inputElement?.removeAttribute('aria-label');
        }
    }

    private readonly focusOutHandler = (): void => {
        this.open = false;
    };

    private readonly inputEventHandler = (_: Event): void => {
        this.value = this.control.value;
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
            <nimble-icon-exclamation-mark
                class="error-icon fail"
            ></nimble-icon-exclamation-mark>
            <div class="separator"></div>
            <nimble-toggle-button
                ${ref('dropdownButton')}
                appearance="ghost"
                ?checked="${x => x.open}"
                ?disabled="${x => x.disabled}"
                content-hidden="true"
                @click="${(x, c) => x.toggleButtonClickHandler(c.event)}"
                @change="${(x, c) => x.toggleButtonChangeHandler(c.event)}"
                @keydown="${(x, c) => x.toggleButtonKeyDownHandler(c.event as KeyboardEvent)}"
                class="dropdown-button"
                part="button"
                aria-haspopup="true"
                aria-expanded="${x => x.open}"
            >
                <nimble-icon-arrow-expander-down
                    slot="start"
                    class="dropdown-icon"
                >
                </nimble-icon-arrow-expander-down>
            </nimble-toggle-button>
        </div>
        ${errorTextTemplate}
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCombobox());
