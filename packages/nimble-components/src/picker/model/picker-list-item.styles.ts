import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    controlHeight,
    bodyFontLineHeight,
    borderHoverColor,
    sectionBackgroundColor
} from '../../theme-provider/design-tokens';
import { focusVisible } from '../../utilities/style/focus';

export const styles = css`
    ${display('inline')}

    :host {
        box-sizing: border-box;
        background: ${sectionBackgroundColor};
        border-radius: 100px;
        outline: none;
        width: fit-content;
        height: fit-content;
        margin-top: 2px;
        margin-right: 2px;
        margin-bottom: 2px;
        padding: calc((${controlHeight} - ${bodyFontLineHeight}) / 2 - 1px);
        padding-bottom: calc(
            (${controlHeight} - ${bodyFontLineHeight}) / 2 + 1px
        );
    }

    :host(${focusVisible}) {
        outline: 1px solid ${borderHoverColor};
    }
`;
