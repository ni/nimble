import { attr, Notifier, Observable } from '@microsoft/fast-element';
import {
    Button as FoundationButton,
    buttonTemplate as template,
    DesignSystem
} from '@microsoft/fast-foundation';
import type { NimbleIcon } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import * as nimbleIconsMap from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';
import { ButtonAppearance } from './types';

const nimbleIcons = Object.values(nimbleIconsMap);

export type { Button };

class Button extends FoundationButton {
    /**
     * The appearance the button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: ButtonAppearance;

    /**
     * The icon to use in the button.
     *
     * @public
     * @remarks
     * HTML Attribute: icon
     * The icon can be set to something of type `NimbleIcon` or a string that is expected to be an HTML
     * blob representing an icon.
     */
    @attr
    public icon: string | NimbleIcon;

    private notifier: Notifier;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = ButtonAppearance.Outline;
        }

        this.notifier = Observable.getNotifier(this);
        this.notifier.subscribe(this, 'defaultSlottedContent');
        this.iconChanged();
    }

    public disconnectedCallback(): void {
        this.notifier.unsubscribe(this, 'defaultSlottedContent');
    }

    public handleChange(_source: unknown, propertyName: string): void {
        switch (propertyName) {
            case 'defaultSlottedContent':
                this.updateContentState();
                break;
            default:
                break;
        }
    }

    private iconChanged(): void {
        if (this.isConnected) {
            if (this.icon) {
                const iconValue = typeof this.icon === 'string' ? this.icon : this.icon.name;
                const nimbleIcon = nimbleIcons.find(value => iconValue === value.name);
                if (nimbleIcon) {
                    this.start.innerHTML = `${nimbleIcon.data}`;
                } else {
                    this.start.innerHTML = iconValue;
                }

                this.startContainer.classList.add('iconContent');
            } else {
                this.startContainer.classList.remove('iconContent');
            }

            this.updateContentState();
        }
    }

    private updateContentState(): void {
        if (this.icon) {
            const buttonContentElement = this.shadowRoot?.querySelector('.content');
            if (buttonContentElement) {
                if (this.defaultSlottedContent.length === 0) {
                    buttonContentElement.classList.add('iconWithNoButtonContent');
                } else {
                    buttonContentElement.classList.remove('iconWithNoButtonContent');
                }
            }
        }
    }
}

/**
 * A function that returns a nimble-button registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#buttonTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-button\>
 *
 */
const nimbleButton = Button.compose({
    baseName: 'button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleButton());
