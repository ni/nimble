import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyFont,
    bodyFontColor,
    borderColor,
    borderWidth,
    sectionBackgroundColor,
    standardPadding,
    titleFont
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

    ::slotted([slot='title']) {
        font: ${titleFont};
    }

    section {
        display: contents;
    }
`;
