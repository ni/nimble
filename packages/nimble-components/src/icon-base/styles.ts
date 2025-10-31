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

    :host([severity='error']) {
        ${iconColor.cssCustomProperty}: ${failColor};
    }

    :host([severity='warning']) {
        ${iconColor.cssCustomProperty}: ${warningColor};
    }

    :host([severity='success']) {
        ${iconColor.cssCustomProperty}: ${passColor};
    }

    :host([severity='information']) {
        ${iconColor.cssCustomProperty}: ${informationColor};
    }

    .icon svg {
        display: inline-flex;
        width: 100%;
        height: 100%;
        fill: ${iconColor};
    }

    /* Multi-color icon support: layer colors are set via CSS custom properties */
    .icon svg .cls-1 {
        fill: var(--ni-nimble-icon-layer-1-color, ${iconColor});
    }

    .icon svg .cls-2 {
        fill: var(--ni-nimble-icon-layer-2-color, ${iconColor});
    }

    .icon svg .cls-3 {
        fill: var(--ni-nimble-icon-layer-3-color, ${iconColor});
    }

    .icon svg .cls-4 {
        fill: var(--ni-nimble-icon-layer-4-color, ${iconColor});
    }

    .icon svg .cls-5 {
        fill: var(--ni-nimble-icon-layer-5-color, ${iconColor});
    }

    .icon svg .cls-6 {
        fill: var(--ni-nimble-icon-layer-6-color, ${iconColor});
    }
`;
