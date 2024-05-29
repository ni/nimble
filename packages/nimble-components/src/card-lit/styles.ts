import { css, unsafeCSS } from 'lit';
import { display } from '../utilities/style/display';
import {
    bodyEmphasizedFontWeight,
    bodyFont,
    bodyFontColor,
    cardBorderColor,
    largePadding,
    subtitleFontColor,
    subtitlePlus1Font
} from '../theme-provider/design-tokens';

export const styles = css`
    ${unsafeCSS(display('flex'))}

    :host {
        flex-direction: column;
        gap: var(${unsafeCSS(largePadding.cssCustomProperty)});
        padding: var(${unsafeCSS(largePadding.cssCustomProperty)});
        border: 2px solid var(${unsafeCSS(cardBorderColor.cssCustomProperty)});
        border-radius: 8px;
        font: var(${unsafeCSS(bodyFont.cssCustomProperty)});
        color: var(${unsafeCSS(bodyFontColor.cssCustomProperty)});
    }
    section {
        display: contents;
    }

    slot[name='title'] {
        font: var(${unsafeCSS(subtitlePlus1Font.cssCustomProperty)});
        font-weight: var(
            ${unsafeCSS(bodyEmphasizedFontWeight.cssCustomProperty)}
        );
        color: var(${unsafeCSS(subtitleFontColor.cssCustomProperty)});
    }
`;
