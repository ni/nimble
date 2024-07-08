import { css } from '@microsoft/fast-element';
import {
    bodyFont,
    buttonLabelFont,
    mediumPadding,
    standardPadding
} from '../../../theme-provider/design-tokens';

export const styles = css`
    :host {
        align-self: center;
        width: 100%;
    }

    nimble-menu-button {
        width: 100%;
        ${standardPadding.cssCustomProperty}: ${mediumPadding};
        ${buttonLabelFont.cssCustomProperty}: ${bodyFont};
    }

    .value-label {
        margin-right: auto;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 100%;
        align-content: center;
    }
`;
