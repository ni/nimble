import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { actionRgbPartialColor, bodyEmphasizedFont, bodyEmphasizedFontColor, standardPadding } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        box-sizing: border-box;
        line-height: ${standardPadding};
        flex-direction: column;
        font: ${bodyEmphasizedFont};
        color: ${bodyEmphasizedFontColor};
    }
`;