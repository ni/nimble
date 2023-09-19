import { attr } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { NimbleIcon } from '@ni/nimble-tokens/dist/icons/js';
import { template } from './template';
import { styles } from './styles';
import type { IconSeverity } from './types';

/**
 * The base class for icon components
 */
export class Icon extends FoundationElement {
    /**
     * @public
     * @remarks
     * HTML Attribute: severity
     */
    @attr
    public severity: IconSeverity;

    /**
     * @public
     * @remarks
     * HTML Attribute: alt
     */
    @attr
    public alt?: string;

    public constructor(/** @internal */ public readonly icon: NimbleIcon) {
        super();
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.setImgRoleOnSvg();
        this.forwardAltToSvgAriaLabel();
    }

    private altChanged(): void {
        this.forwardAltToSvgAriaLabel();
    }

    private forwardAltToSvgAriaLabel(): void {
        const svg = this.shadowRoot?.querySelector('svg');
        if (!svg) {
            return;
        }
        if (this.alt !== null && this.alt !== undefined) {
            svg.setAttribute('aria-label', this.alt);
        } else {
            svg.removeAttribute('aria-label');
        }
    }

    private setImgRoleOnSvg(): void {
        this.shadowRoot?.querySelector('svg')?.setAttribute('role', 'img');
    }
}

type IconClass = typeof Icon;

export const registerIcon = (baseName: string, iconClass: IconClass): void => {
    const composedIcon = iconClass.compose({
        baseName,
        template,
        styles,
        baseClass: iconClass
    });

    DesignSystem.getOrCreate().withPrefix('nimble').register(composedIcon());
};
