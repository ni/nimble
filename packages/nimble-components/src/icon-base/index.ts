import { attr, type ViewTemplate } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
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
 */
export const registerIcon = (
    baseName: string,
    iconClass: IconClass,
    customTemplate?: ViewTemplate
): void => {
    const composedIcon = iconClass.compose({
        baseName,
        template: customTemplate ?? template,
        styles
    });

    DesignSystem.getOrCreate().withPrefix('nimble').register(composedIcon());
};
