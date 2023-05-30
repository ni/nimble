import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
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

    public constructor(/** @internal */ public readonly icon: NimbleIcon) {
        super();
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.forwardAriaLabelToSvg();
    }

    private ariaLabelChanged(): void {
        this.forwardAriaLabelToSvg();
    }

    private forwardAriaLabelToSvg(): void {
        const svg = this.shadowRoot!.querySelector('svg');
        if (!svg) {
            return;
        }
        if (this.ariaLabel) {
            svg.setAttribute('aria-label', this.ariaLabel);
        } else {
            svg.removeAttribute('aria-label');
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Icon extends ARIAGlobalStatesAndProperties {}
applyMixins(Icon, ARIAGlobalStatesAndProperties);

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
