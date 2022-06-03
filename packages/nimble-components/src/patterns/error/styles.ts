import { css } from '@microsoft/fast-element';
import {
    controlHeight,
    failColor,
    iconSize,
    bodyDisabledFontColor,
    errorTextFont,
    borderWidth,
    smallPadding
} from '../../theme-provider/design-tokens';

export const styles = css`
    .error-content {
        width: ${iconSize};
        display: none;
    }

    :host(.invalid) .error-content {
        display: contents;
    }

    :host(.invalid) .error-content svg {
        height: ${iconSize};
        width: ${iconSize};
        padding-right: ${smallPadding};
        flex: none;
    }

    :host(.invalid) .error-content path {
        fill: ${failColor};
    }

    :host([disabled]) .error-content path {
        fill: ${bodyDisabledFontColor};
    }

    .error-text {
        display: none;
    }

    :host(.invalid) .error-text {
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

    :host(.invalid[readonly]:not([disabled])) .error-text {
        top: calc(${controlHeight} - ${borderWidth});
    }

    :host(.invalid) .error-text:empty {
        display: none;
    }

    :host([disabled]) .error-text {
        color: ${bodyDisabledFontColor};
    }
`;
