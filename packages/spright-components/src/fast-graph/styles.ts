import { css } from '@ni/fast-element';
import {
    bodyFontColor,
    borderRgbPartialColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../utilities/style/display';

export const styles = css`
    ${display('inline-block')}

    :host {
        width: 100%;
        height: 100%;
    }

    :host([disabled]) {
        border-color: rgba(${borderRgbPartialColor}, 0.2);
    }

    .flot-container {
        width: 100%;
        height: 100%;
    }

    .flot-container > canvas {
        width: 100% !important;
        height: 100% !important;
    }

    g > text {
        fill: ${bodyFontColor}
    }
`;
