import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';

import {
    borderHoverColor,
    borderWidth,
    fillSelectedColor,
    fillSelectedRgbPartialColor,
    smallDelay
} from '../theme-provider/design-tokens';
import { styles as buttonStyles } from '../patterns/button/styles';

export const styles = css`
    ${buttonStyles}

    @layer default {
        .control[aria-pressed='true'] {
            background-color: transparent;
            background-image: linear-gradient(
                ${fillSelectedColor},
                ${fillSelectedColor}
            );
            border-color: rgba(${fillSelectedRgbPartialColor}, 0.3);
            position: relative;
            transition: box-shadow ${smallDelay} ease-in-out,
                border-color ${smallDelay} ease-in-out,
                background-size ${smallDelay} ease-in-out;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
        }
    }

    @layer hover {
        .control[aria-pressed='true']:hover {
            border-color: ${borderHoverColor};
            box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
            background-image: linear-gradient(
                ${fillSelectedColor},
                ${fillSelectedColor}
            );
            background-size: calc(100% - 4px) calc(100% - 4px);
        }
    }

    @layer focusVisible {
        .control[aria-pressed='true']${focusVisible} {
            border-color: ${borderHoverColor};
            box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
            background-image: linear-gradient(
                ${fillSelectedColor},
                ${fillSelectedColor}
            );
            background-size: calc(100% - 4px) calc(100% - 4px);
        }
    }

    @layer active {
        .control[aria-pressed='true']:active {
            box-shadow: none;
            background-image: linear-gradient(
                ${fillSelectedColor},
                ${fillSelectedColor}
            );
            background-size: calc(100% - 2px) calc(100% - 2px);
        }
    }

    @layer default {
        .control[aria-pressed='true']::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            box-sizing: border-box;
            outline: 0px solid transparent;
            background-clip: content-box;
            transition: outline ${smallDelay} ease-in-out;
        }
    }

    @layer focusVisible {
        .control[aria-pressed='true']${focusVisible}::before {
            outline: ${borderWidth} solid ${borderHoverColor};
            outline-offset: -3px;
            color: transparent;
        }
    }

    @layer active {
        .control[aria-pressed='true']:active::before {
            outline: none;
        }
    }
`;
