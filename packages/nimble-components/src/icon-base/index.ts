import { attr } from '@ni/fast-element';
import {
    type CSSDesignToken,
    DesignSystem,
    FoundationElement
} from '@ni/fast-foundation';
import type { NimbleIcon } from '@ni/nimble-tokens/dist/icons/js';
import { template } from './template';
import { styles } from './styles';
import type { IconSeverity } from './types';
import { createMultiColorIconClass } from './multi-color-icon-factory';

/**
 * Configuration for multi-color icons
 */
export interface MultiColorConfig {
    /**
     * Array of design tokens for each color layer.
     * Order corresponds to cls-1, cls-2, cls-3, etc. in the SVG.
     */
    layerColors: readonly CSSDesignToken<string>[];
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

    /** @internal - Set during registration for multi-color icons */
    public readonly layerColors?: readonly CSSDesignToken<string>[];

    /** @internal */
    public readonly icon!: NimbleIcon;

    public constructor(icon?: NimbleIcon) {
        super();
        if (icon) {
            Object.defineProperty(this, 'icon', {
                value: icon,
                writable: false
            });
        }
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        if (this.layerColors) {
            this.applyLayerColors();
            // Warn if severity is used with multi-color icons
            if (this.severity !== undefined) {
                /* eslint-disable-next-line no-console */
                console.warn(
                    `${this.tagName}: severity attribute has no effect on multi-color icons`
                );
            }
        }
    }

    /**
     * Applies the configured layer colors as CSS custom properties
     * @internal
     */
    private applyLayerColors(): void {
        this.layerColors!.forEach((token, index) => {
            this.style.setProperty(
                `--ni-nimble-icon-layer-${index + 1}-color`,
                `var(${token.cssCustomProperty})`
            );
        });
    }
}

type IconClass = typeof Icon;

/**
 * Register an icon component with optional multi-color configuration
 *
 * @param baseName - The base name for the icon element (e.g., 'icon-check')
 * @param iconClass - The Icon class to register
 * @param multiColorConfig - Optional configuration for multi-color icons
 */
export const registerIcon = (
    baseName: string,
    iconClass: IconClass,
    multiColorConfig?: MultiColorConfig
): void => {
    let registrationClass = iconClass;

    if (multiColorConfig) {
        const { layerColors } = multiColorConfig;

        // Validate layer count
        if (layerColors.length > 6) {
            /* eslint-disable-next-line no-console */
            console.warn(
                `Icon ${baseName}: ${layerColors.length} layers specified but only 6 are supported. `
                    + 'Extra layers will be ignored.'
            );
        }

        // Create a custom element constructor that injects layer colors
        // We use a factory pattern to avoid the "too many classes" lint error
        registrationClass = createMultiColorIconClass(iconClass, layerColors);
    }

    const composedIcon = registrationClass.compose({
        baseName,
        template,
        styles
    });

    DesignSystem.getOrCreate().withPrefix('nimble').register(composedIcon());
};
