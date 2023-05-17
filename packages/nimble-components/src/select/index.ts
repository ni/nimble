import { attr, html, observable } from '@microsoft/fast-element';
import {
    AnchoredRegion,
    DesignSystem,
    Select as FoundationSelect,
    SelectOptions
} from '@microsoft/fast-foundation';
import { arrowExpanderDown16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { DropdownAppearance } from '../patterns/dropdown/types';
import { errorTextTemplate } from '../patterns/error/template';
import type { ErrorPattern } from '../patterns/error/types';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { template } from './template';
import type { ListOption } from '../list-option';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-select': Select;
    }
}

/**
 * A nimble-styled HTML select
 */
export class Select extends FoundationSelect implements ErrorPattern {
    @attr
    public appearance: DropdownAppearance = DropdownAppearance.underline;

    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText: string | undefined;

    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;

    @observable
    public controlWrapper?: HTMLElement;

    @observable
    public region?: AnchoredRegion;

    private _filter = '';
    private filteredOptions: ListOption[] = [];

    public regionChanged(
        _prev: AnchoredRegion | undefined,
        _next: AnchoredRegion | undefined
    ): void {
        if (this.region && this.control) {
            this.region.anchorElement = this.control;
        }
    }

    public controlChanged(
        _prev: HTMLElement | undefined,
        _next: HTMLElement | undefined
    ): void {
        if (this.region && this.control) {
            this.region.anchorElement = this.control;
        }
    }

    // Workaround for https://github.com/microsoft/fast/issues/5123
    public override setPositioning(): void {
        if (!this.$fastController.isConnected) {
            // Don't call setPositioning() until we're connected,
            // since this.forcedPosition isn't initialized yet.
            return;
        }
        super.setPositioning();
        this.updateListboxMaxHeightCssVariable();
    }

    // Workaround for https://github.com/microsoft/fast/issues/5773
    public override slottedOptionsChanged(
        prev: Element[],
        next: Element[]
    ): void {
        const value = this.value;
        super.slottedOptionsChanged(prev, next);
        if (value) {
            this.value = value;
        }
    }

    /**
     * Handle content changes on the control input.
     *
     * @param e - the input event
     * @internal
     */
    public inputHandler(e: InputEvent): boolean {
        this._filter = (this.control as HTMLInputElement).value;
        this.filterOptions();

        this.selectedIndex = this.options
            .map(option => option.text)
            .indexOf((this.control as HTMLInputElement).value);

        if (e.inputType.includes('deleteContent') || !this._filter.length) {
            return true;
        }

        this.open = true;

        return true;
    }

    /**
     * Handle keyup actions for value input and text field manipulations.
     *
     * @param e - the keyboard event
     * @internal
     */
    public keyupHandler(e: KeyboardEvent): boolean {
        const key = e.key;

        switch (key) {
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'Backspace':
            case 'Delete':
            case 'Home':
            case 'End': {
                this._filter = (this.control as HTMLInputElement).value;
                this.selectedIndex = -1;
                this.filterOptions();
                break;
            }
            default:
        }

        return true;
    }

    /**
     * Filter available options by text value.
     *
     * @public
     */
    private filterOptions(): void {
        const filter = this._filter.toLowerCase();

        this.filteredOptions = this._options.filter(o => o.text.toLowerCase().startsWith(this._filter.toLowerCase()));

        if (!this.filteredOptions.length && !filter) {
            this.filteredOptions = this._options;
        }

        this._options.forEach(o => {
            o.hidden = !this.filteredOptions.includes(o);
        });
    }

    private maxHeightChanged(): void {
        this.updateListboxMaxHeightCssVariable();
    }

    private updateListboxMaxHeightCssVariable(): void {
        if (this.listbox) {
            this.listbox.style.setProperty(
                '--ni-private-select-max-height',
                `${this.maxHeight}px`
            );
        }
    }
}

const nimbleSelect = Select.compose<SelectOptions>({
    baseName: 'select',
    baseClass: FoundationSelect,
    template,
    styles,
    indicator: arrowExpanderDown16X16.data,
    end: html<Select>`
        <${iconExclamationMarkTag}
            severity="error"
            class="error-icon"
        ></${iconExclamationMarkTag}>
        ${errorTextTemplate}
    `
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSelect());
export const selectTag = DesignSystem.tagFor(Select);
