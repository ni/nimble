import { css } from '@microsoft/fast-element';
import {
    applicationBackgroundColor,
    bodyFontColor
} from '../theme-provider/design-tokens';

export const styles = css`
    :host {
        color: ${bodyFontColor};
        background-color: ${applicationBackgroundColor};
        display: block;
        height: 400px;
    }

    .graph-container {
        width: 100%;
        height: 100%;
    }
`;
