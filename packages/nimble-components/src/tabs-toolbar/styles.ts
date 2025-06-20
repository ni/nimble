import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import {
    bodyFont,
    bodyFontColor,
    borderRgbPartialColor,
    borderWidth,
    controlHeight,
    mediumPadding,
    smallPadding
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        align-items: center;
        height: ${controlHeight};
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .separator {
        display: inline-block;
        height: 24px;
        border-left: calc(${borderWidth} * 2) solid
            rgba(${borderRgbPartialColor}, 0.3);
        margin: ${smallPadding} ${mediumPadding};
    }

    [part='start'] {
        display: none;
    }

    [part='end'] {
        margin-left: auto;
        display: flex;
    }
`;
