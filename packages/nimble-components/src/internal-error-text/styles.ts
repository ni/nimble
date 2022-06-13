import { css } from '@microsoft/fast-element';
import { bodyDisabledFontColor, controlHeight, errorTextFont, failColor } from '../theme-provider/design-tokens';

export const styles = css`
    :host {
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

    :host:empty {
        display: none;
    }

    :host([disabled]) {
        color: ${bodyDisabledFontColor};
    }
`;
