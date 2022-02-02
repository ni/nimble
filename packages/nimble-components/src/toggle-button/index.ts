import { attr, html, ref } from '@microsoft/fast-element';
import {
    DesignSystem,
    Switch as FoundationSwitch,
    SwitchOptions
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { styles as baseButtonStyles } from '../button/styles';
import { ButtonAppearance } from '../button/types';

export type { ToggleButton };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-toggle-button': ToggleButton;
    }
}

/**
 * A nimble-styled toggle button control.
 */
class ToggleButton extends FoundationSwitch {
    /**
     * The appearance the button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance!: ButtonAppearance;

    /**
     * Specify as 'true' to hide the text content of the button. The button will
     * become square, and the text content will be used as the label of the button
     * for accessibility purposes.
     *
     * @public
     * @remarks
     * HTML Attribute: content-hidden
     */
    @attr({ attribute: 'content-hidden', mode: 'boolean' })
    public contentHidden = false;

    public readonly control!: HTMLElement;
    private readonly contentId = 'nimble-toggle-button-content';

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = ButtonAppearance.Outline;
        }

        const content = this.control.querySelector('.content')!;
        content.id = this.contentId;
        this.control.setAttribute('aria-labelledby', this.contentId);
    }

    // TODO: add Enter key handler to toggle button
}

const nimbleToggleButton = ToggleButton.compose<SwitchOptions>({
    baseName: 'toggle-button',
    baseClass: FoundationSwitch,
    template: html`
    <div
        role="button"
        part="control"
        aria-pressed="${(x: ToggleButton) => x.checked}"
        aria-disabled="${(x: ToggleButton) => x.disabled}"
        aria-readonly="${(x: ToggleButton) => x.readOnly}"
        tabindex="${(x: ToggleButton) => (x.disabled ? null : 0)}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        class="control ${(x: ToggleButton) => (x.checked ? 'checked' : '')}"
        ?disabled="${x => x.disabled}"
        ${ref('control')}
    >
        <span part="start" class="start">
            <slot name="start"></slot>
        </span>
        <span class="content" part="content">
            <slot></slot>
        </span>
    </div>`,
    styles: [baseButtonStyles, styles]
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleToggleButton());