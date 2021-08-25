import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    // borderColor,
    // borderColorHover,
    fillColorSelectedRgb,
    contentFontColor,
    // contentFontColorDisabled,
    contentFontSize,
    controlHeight,
    fontFamily,
    // labelFontColor,
    // labelFontFamily,
    // labelFontSize,
    // labelTextTransform
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')} :host {
        align-items: center;
        font-family: ${fontFamily};
        box-sizing: border-box;
        color: ${contentFontColor};
        cursor: pointer;
        font-size: ${contentFontSize};
        height: ${controlHeight};
        outline: none;
        overflow: hidden;
        user-select: none;
        white-space: nowrap;
    }
    
    :host([disabled]:hover) {
        background-color: inherit;
    }

    .content {
        grid-column-start: 2;
        justify-self: start;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :host(.selected) {
        background-color: rgba(${fillColorSelectedRgb}, 0.2);
    }
`;