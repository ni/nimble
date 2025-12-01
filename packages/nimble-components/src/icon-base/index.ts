import { attr, type ElementStyles, type ViewTemplate } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { template } from './template';
import { styles } from './styles';
import type { IconSeverity } from './types';

export interface NimbleIcon {
    name: string;
    data: string;
}

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

    /** @internal */
    public readonly icon: NimbleIcon;

    public constructor(icon: NimbleIcon) {
        super();
        this.icon = icon;
    }
}

type IconClass = typeof Icon;

/**
 * Register an icon component
 *
 * @param baseName - The base name for the icon element (e.g., 'icon-check')
 * @param iconClass - The Icon class to register
 * @param customTemplate - Optional custom template to use instead of the default
 * @param additionalStyles - Optional additional styles to compose with the base styles
 */
export const registerIcon = (
    baseName: string,
    iconClass: IconClass,
    customTemplate?: ViewTemplate,
    additionalStyles?: ElementStyles | ElementStyles[]
): void => {
    let extraStyles: ElementStyles[] = [];
    if (additionalStyles) {
        extraStyles = Array.isArray(additionalStyles)
            ? additionalStyles
            : [additionalStyles];
    }

    const composedIcon = iconClass.compose({
        baseName,
        template: customTemplate ?? template,
        styles: additionalStyles ? [styles, ...extraStyles] : styles
    });

    DesignSystem.getOrCreate().withPrefix('nimble').register(composedIcon());
};
