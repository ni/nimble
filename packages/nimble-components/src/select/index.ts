import {
    autoPlacement,
    autoUpdate,
    computePosition,
    flip,
    hide,
    offset,
    size
} from '@floating-ui/dom';
import { attr, DOM, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template
} from '@microsoft/fast-foundation';
import { arrowExpanderDown16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import {
    DropdownAppearance,
    DropdownPosition
} from '../patterns/dropdown/types';
import { errorTextTemplate } from '../patterns/error/template';
import type { ErrorPattern } from '../patterns/error/types';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-select': Select;
    }
}

interface IHasIndexWhenOpened {
    indexWhenOpened: number;
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

    /** @internal */
    public cleanup: () => void = () => {};

    public override disconnectedCallback(): void {
        this.cleanup?.();
        super.disconnectedCallback();
    }

    /**
     * This implementation comes from FAST. We took their implementation to use the floating-ui
     * package for floating the listbox above other UI elements.
     * See: https://github.com/microsoft/fast/pull/6452
     */
    public override setPositioning(): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-misused-promises
        this.cleanup = autoUpdate(this, this.listbox, async () => {
            const middlewareArray = [
                offset(4), // smallPadding
                size({
                    apply: ({ availableHeight, rects }) => {
                        Object.assign(this.listbox.style, {
                            maxHeight: `${availableHeight}px`,
                            width: `${rects.reference.width}px`
                        });
                    }
                }),
                hide()
            ];
            if (this.positionAttribute === undefined) {
                middlewareArray.push(
                    autoPlacement({
                        allowedPlacements: ['top-start', 'bottom-start']
                    })
                );
            }
            const { middlewareData, x, y } = await computePosition(
                this.control,
                this.listbox,
                {
                    placement:
                        this.positionAttribute === DropdownPosition.above
                            ? 'top-start'
                            : 'bottom-start',
                    strategy: 'fixed',
                    middleware: middlewareArray
                }
            );

            if (middlewareData.hide?.referenceHidden) {
                this.open = false;
                return;
            }

            Object.assign(this.listbox.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                transform: `translate(${x}px, ${y}px)`
            });
        });
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
     * This implementation comes from FAST. We took their implementation to use the floating-ui
     * package for floating the listbox above other UI elements.
     * See: https://github.com/microsoft/fast/pull/6452
     */
    protected override openChanged(
        _prev: boolean | undefined,
        _next: boolean
    ): void {
        if (!this.collapsible) {
            return;
        }
        if (this.open) {
            this.ariaControls = this.listboxId;
            this.ariaExpanded = 'true';

            DOM.queueUpdate(() => this.setPositioning());
            this.focusAndScrollOptionIntoView();
            // We need to update indexWhenOpened, but it is private.
            (this as unknown as IHasIndexWhenOpened).indexWhenOpened = this.selectedIndex;

            // focus is directed to the element when `open` is changed programmatically
            DOM.queueUpdate(() => this.focus());
            return;
        }

        this.cleanup?.();

        this.ariaControls = '';
        this.ariaExpanded = 'false';
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
