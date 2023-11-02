import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    borderColor,
    borderWidth,
    sectionBackgroundColor,
    standardPadding,
    titleFont,
    titleFontColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: column;
        gap: ${standardPadding};
        padding: ${standardPadding};
        border: ${borderWidth} solid ${borderColor};
        font: ${bodyFont};
        color: ${bodyFontColor};
        background-color: ${sectionBackgroundColor};
    }

    section {
        display: contents;
    }

    ::slotted([slot='title']) {
        font: ${titleFont};
        color: ${titleFontColor};
    }
`;
