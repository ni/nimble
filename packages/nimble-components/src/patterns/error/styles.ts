import { css } from '@microsoft/fast-element';
import {
    controlHeight,
    failColor,
    bodyDisabledFontColor,
    errorTextFont,
    borderWidth,
    smallPadding
} from '../../theme-provider/design-tokens';

export const styles = css`
    .error-icon {
        display: none;
    }

    :host(.invalid) .error-icon {
        display: inline-flex;
        padding-right: ${smallPadding};
    }

    :host([disabled]) .error-icon {
        --ni-nimble-icon-color: ${bodyDisabledFontColor};
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
