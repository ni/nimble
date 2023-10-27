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

// TODO AB#2542845 Replace placeholder style
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
