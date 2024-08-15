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
        align-items: center;
    }

    :host(.right-align) {
        margin-left: auto;
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
