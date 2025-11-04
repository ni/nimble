import { html } from '@ni/fast-element';
import type { Icon } from '.';

/**
 * Gets the layer color styles for multi-color icons
 * @internal
 */
export function getLayerColorStyles(icon: Icon): string {
    // Check if this is a multi-color icon with layerColors property
    const multiColorIcon = icon as {
        layerColors?: readonly { cssCustomProperty: string }[]
    };
    if (!multiColorIcon.layerColors) {
        return '';
    }

    return multiColorIcon.layerColors
        .slice(0, 6) // MAX_ICON_LAYERS
        .map(
            (token, index) => `--ni-nimble-icon-layer-${index + 1}-color: var(${token.cssCustomProperty})`
        )
        .join('; ');
}

// Avoiding any whitespace in the template because this is an inline element
export const template = html<Icon>`<div
    class="icon"
    aria-hidden="true"
    :innerHTML=${x => x.icon.data}
    style="${x => getLayerColorStyles(x)}"
></div>`;
