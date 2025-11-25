import { css } from '@ni/fast-element';
import { iconColor } from '../theme-provider/design-tokens';

export const multiColorStyles = css`
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
