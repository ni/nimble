import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    contentFontColor,
    contentFontSize,
    fontFamily
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        box-sizing: border-box;
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        color: ${contentFontColor};
    }

    .listitem {
        --item-padding: 4px;
        padding-top: var(--item-padding);
        padding-bottom: var(--item-padding);
        line-height: calc(var(--ni-nimble-label-height) + 2 * var(--item-padding));
    }

    .separator nimble-arrow-expander-right-icon {
        position: relative;
        top: 4px;
    }
`;
