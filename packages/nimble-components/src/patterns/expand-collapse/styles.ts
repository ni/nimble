import { css } from '@microsoft/fast-element';
import {
    controlSlimHeight,
    mediumDelay
} from '../../theme-provider/design-tokens';

export const styles = css`
    :host {
        --ni-private-expand-collapse-button-indent-level: 0px;
    }

    :host([expanded]) .animating,
    :host .animating {
        transition: ${mediumDelay} ease-in-out;
    }

    :host([expanded]) .expander-icon {
        transform: rotate(90deg);
    }

    .expand-collapse-button {
        height: ${controlSlimHeight};
        align-self: center;
    }

    .expander-icon {
        transform: rotate(0deg);
    }

    @media (prefers-reduced-motion) {
        :host .animating,
        :host([expanded]) .animating {
            transition-duration: 0s;
        }
    }
`;
