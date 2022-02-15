import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { contentFontSize, fontFamily } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-block')}

    :host {
        box-sizing: border-box;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        line-height: 24px;
    }
    .list {
        display: flex;
        flex-wrap: wrap;
    }
`;
