import { attr, html, observable, Observable, DOM } from '@microsoft/fast-element';
import {
    AnchoredRegion,
    DesignSystem,
    Select as FoundationSelect,
    SelectOptions
} from '@microsoft/fast-foundation';
import { arrowExpanderDown16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { template } from './template';
import { DropdownAppearance } from '../patterns/dropdown/types';
import { errorTextTemplate } from '../patterns/error/template';
import type { ErrorPattern } from '../patterns/error/types';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { ListOption } from '../list-option';
import type { TextField } from '../text-field';
import { ListOptionGroup } from '../list-option-group';

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
    public input?: TextField;

    @observable
    public region?: AnchoredRegion;

    private _filter = '';
    private filteredOptions: ListOption[] = [];

    /**
     * The list of options.
     *
     * @public
     * @remarks
     * Overrides `Listbox.options`.
     */
    public override get options(): ListOption[] {
        Observable.track(this, 'options');
        return this.filteredOptions?.length ? this.filteredOptions : this._options;
    }

    public override set options(value: ListOption[]) {
        this._options = value;
        Observable.notify(this, 'options');
    }

    /**
     * The value property.
     *
     * @public
     */
    public override get value(): string {
        Observable.track(this, 'value');
        // eslint-disable-next-line @typescript-eslint/dot-notation
        return this['_value'] as string;
    }

    public override set value(next: string) {
        const prev = `${this.value}`;
        let newValue = next;

        if (this.options?.length) {
            const selectedIndex = this.options.findIndex(el => el.value === newValue);
            const prevSelectedValue = this.options[this.selectedIndex]?.value ?? null;
            const nextSelectedValue = this.options[selectedIndex]?.value ?? null;

            if (selectedIndex === -1 || prevSelectedValue !== nextSelectedValue) {
                newValue = '';
                this.selectedIndex = selectedIndex;
            }

            newValue = this.firstSelectedOption?.value ?? newValue;
        }

        if (prev !== newValue) {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            this['_value'] = newValue;
            super.valueChanged(prev, newValue);
            Observable.notify(this, 'value');
            if (this.collapsible) {
                Observable.notify(this, 'displayValue');
            }
        }
    }

    /**
     * A static filter to include only selectable options.
     *
     * @param n - element to filter
     * @public
     */
    public static slottedOptionGroupFilter = (n: HTMLElement): boolean => {
        const allowed = n instanceof ListOptionGroup && !n.hidden;
        return allowed;
    };

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
        const options = this.findSlottedOptions(next);

        super.slottedOptionsChanged(prev, options);
        if (value) {
            this.value = value;
        }
    }

    public inputClickHandler(e: MouseEvent): void {
        e.stopPropagation(); // clicking in filter input shouldn't close dropdown
    }

    /**
     * Handle content changes on the control input.
     *
     * @param e - the input event
     * @internal
     */
    public inputHandler(e: InputEvent): boolean {
        this._filter = this.input?.value ?? '';
        this.filterOptions();

        const filteredOptionSelectedIndex = this.options
            .map(option => option.text)
            .indexOf((this.control as HTMLInputElement).value);
        if (filteredOptionSelectedIndex >= 0) {
            this.selectedIndex = filteredOptionSelectedIndex;
        }

        if (e.inputType.includes('deleteContent') || !this._filter.length) {
            return true;
        }

        this.open = true;

        e.stopPropagation();
        return true;
    }

    public override keydownHandler(e: KeyboardEvent): boolean {
        const key = e.key;

        if (e.ctrlKey || e.shiftKey) {
            return true;
        }

        switch (key) {
            case ' ': {
                if (!this.open) {
                    super.keydownHandler(e);
                }
                break;
            }

            case 'Escape':
            case 'Enter': {
                super.keydownHandler(e);
                this.focus();
                break;
            }

            default: {
                super.keydownHandler(e);
            }
        }
        return true;
    }

    /**
     * Handle keydown actions for listbox navigation.
     *
     * @param e - the keyboard event
     * @internal
     */
    public inputKeydownHandler(e: Event & KeyboardEvent): boolean {
        const key = e.key;

        if (e.ctrlKey || e.shiftKey) {
            return true;
        }

        switch (key) {
            case 'ArrowUp':
            case 'ArrowDown': {
                if (this.filteredOptions.length > 0) {
                    super.keydownHandler(e);
                }

                break;
            }

            default: {
                return true;
            }
        }

        return true;
    }

    protected override openChanged(prev: boolean | undefined, next: boolean): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        super.openChanged(prev, next);
        if (this.open) {
            DOM.queueUpdate(() => {
                window.requestAnimationFrame(() => {
                    this.input?.focus();
                });
            });
        }
        this._filter = '';
        this.input!.value = '';
        this.filterOptions();
    }

    private findSlottedOptions(slottedElements: Element[]): ListOption[] {
        return slottedElements.flatMap(el => {
            if (el instanceof ListOption) {
                return el;
            }

            return Array.from(el.children) as ListOption[];
        });
    }

    /**
     * Filter available options by text value.
     *
     * @public
     */
    private filterOptions(): void {
        const filter = this._filter.toLowerCase();

        this.filteredOptions = this._options.filter(o => o.text.toLowerCase().includes(this._filter.toLowerCase()));

        if (!this.filteredOptions.length && !filter) {
            this.filteredOptions = this._options;
        }

        this._options.forEach(o => {
            o.hidden = !this.filteredOptions.includes(o);
        });
        this.slottedOptions.filter(el => el instanceof ListOptionGroup).forEach(group => {
            const allOptionsHidden = Array.from(group.children).every(option => (option as HTMLElement).hidden);
            if (allOptionsHidden) {
                group.setAttribute('hidden', 'true');
            } else {
                group.removeAttribute('hidden');
            }
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
