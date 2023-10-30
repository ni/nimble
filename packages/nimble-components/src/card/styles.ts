import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    borderColor,
    borderWidth,
    mediumPadding,
    sectionBackgroundColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')}

    :host {
        font: ${bodyFont};
        color: ${bodyFontColor};
        background-color: ${sectionBackgroundColor};
        border: ${borderWidth} solid ${borderColor};
        padding: ${mediumPadding};
    }
`;
