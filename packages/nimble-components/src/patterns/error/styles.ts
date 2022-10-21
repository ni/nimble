import { css } from '@microsoft/fast-element';
import {
    controlHeight,
    failColor,
    errorTextFont,
    borderWidth,
    iconSize
} from '../../theme-provider/design-tokens';

export const styles = css`
    .error-icon {
        display: none;
    }

    :host([error-visible]) .error-icon {
        display: inline-flex;
        width: ${iconSize};
        height: ${iconSize};
        flex: none;
    }

    .error-text {
        display: none;
    }

    :host([error-visible]) .error-text {
        display: block;
        font: ${errorTextFont};
        color: ${failColor};
        width: 100%;
        position: absolute;
        top: ${controlHeight};
        left: 0px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    :host([error-visible][readonly]:not([disabled])) .error-text {
        top: calc(${controlHeight} - ${borderWidth});
    }

    :host([error-visible]) .error-text:empty {
        display: none;
    }
`;
