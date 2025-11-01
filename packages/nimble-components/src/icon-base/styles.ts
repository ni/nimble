import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import {
    iconSize,
    warningColor,
    failColor,
    passColor,
    iconColor,
    informationColor
} from '../theme-provider/design-tokens';
import { userSelectNone } from '../utilities/style/user-select';

export const styles = css`
    ${display('inline-flex')}

    :host {
        align-items: center;
        ${userSelectNone}
        width: ${iconSize};
        height: ${iconSize};
    }

    .icon {
        display: contents;
    }

    /* Severity-based recoloring applies only to single-color icons (no data-multicolor attr) */
    :host(:not([data-multicolor])[severity='error']) {
        ${iconColor.cssCustomProperty}: ${failColor};
    }

    :host(:not([data-multicolor])[severity='warning']) {
        ${iconColor.cssCustomProperty}: ${warningColor};
    }

    :host(:not([data-multicolor])[severity='success']) {
        ${iconColor.cssCustomProperty}: ${passColor};
    }

    :host(:not([data-multicolor])[severity='information']) {
        ${iconColor.cssCustomProperty}: ${informationColor};
    }

    .icon svg {
        display: inline-flex;
        width: 100%;
        height: 100%;
        /* Default single-color fill (multi-color icons override via per-layer rules) */
        fill: ${iconColor};
    }

    /* Layered multi-color support: generated components set --ni-nimble-icon-layer-N-color */
    .icon svg .cls-1 {
        fill: var(--ni-nimble-icon-layer-1-color, ${iconColor});
    }
    .icon svg .cls-2 {
        fill: var(
            --ni-nimble-icon-layer-2-color,
            var(--ni-nimble-icon-layer-1-color, ${iconColor})
        );
    }
    .icon svg .cls-3 {
        fill: var(
            --ni-nimble-icon-layer-3-color,
            var(--ni-nimble-icon-layer-2-color, ${iconColor})
        );
    }
    .icon svg .cls-4 {
        fill: var(
            --ni-nimble-icon-layer-4-color,
            var(--ni-nimble-icon-layer-3-color, ${iconColor})
        );
    }
    .icon svg .cls-5 {
        fill: var(
            --ni-nimble-icon-layer-5-color,
            var(--ni-nimble-icon-layer-4-color, ${iconColor})
        );
    }
    .icon svg .cls-6 {
        fill: var(
            --ni-nimble-icon-layer-6-color,
            var(--ni-nimble-icon-layer-5-color, ${iconColor})
        );
    }
`;
