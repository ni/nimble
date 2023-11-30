import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    bodyEmphasizedFontWeight,
    bodyFont,
    bodyFontColor,
    cardBorderColor,
    subtitleFontColor,
    subtitlePlus1Font
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: column;
        gap: 24px;
        padding: 24px;
        border: 2px solid ${cardBorderColor};
        border-radius: 8px;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    section {
        display: contents;
    }

    slot[name='title'] {
        font: ${subtitlePlus1Font};
        font-weight: ${bodyEmphasizedFontWeight};
        color: ${subtitleFontColor};
    }
`;
