import { css } from '@microsoft/fast-element';
import {
    bodyFont,
    bodyFontColor,
    placeholderFont,
    placeholderFontColor
} from '../../../theme-provider/design-tokens';
import { display } from '../../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        width: fit-content;
        max-width: 100%;
        height: fit-content;
        align-self: center;
        align-items: center;
    }

    nimble-anchor {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    span {
        font: ${bodyFont};
        color: ${bodyFontColor};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :host(.placeholder) span {
        font: ${placeholderFont};
        color: ${placeholderFontColor};
    }
`;
