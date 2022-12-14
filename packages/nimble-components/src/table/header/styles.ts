import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { applicationBackgroundColor, borderWidth, tableColumnHeaderSeparatorColor, controlHeight, bodyEmphasizedFont, bodyEmphasizedFontColor } from '../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        height: ${controlHeight};
        align-items: center;
        margin-left: calc(-2 * ${borderWidth});
        background: ${applicationBackgroundColor};
    }

    :host(:hover) {
        margin-left: calc(-2 * ${borderWidth});
    }

    .separator {
        width: calc(2 * ${borderWidth});
        height: 24px;
        background: transparent;
        z-index: 1;
    }

    :host(:hover) .separator {
        background: ${tableColumnHeaderSeparatorColor};
    }

    .content {
        flex: 1;
        padding: 0px 8px;
        font: ${bodyEmphasizedFont};
        color: ${bodyEmphasizedFontColor};
        opacity: 0.6;
    }
`;
