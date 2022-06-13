import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '@microsoft/fast-foundation';

import {
    borderColor,
    tooltipCaptionFont, 
    tooltipCaptionFontColor,
    controlHeight,
    borderWidth,
    smallDelay,
    
} from '../theme-provider/design-tokens';

//font should be source sans pro regular 11px

export const styles = css`
    ${display('inline-flex')}

    :host {
        font: ${tooltipCaptionFont}; 
        color: ${tooltipCaptionFontColor};
        align-items: center;
        cursor: pointer;
        outline: none;
        user-select: none;
    }

    :host([disabled]) {
        cursor: default;
    }
    
    .control {
        width: calc(${controlHeight} / 2);
        height: calc(${controlHeight} / 2);
        box-sizing: border-box;
        flex-shrink: 0;
        border: ${borderWidth} solid ${borderColor};
        padding: 2px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: box-shadow ${smallDelay};
        ${
            /*
             * Firefox includes the line height in the outline height calculation (not sure if intended or accidental).
             * Set it to 0 to ensure the outline is just as high as the control.
             */ ''
        }
        line-height: 0;
    }
`;
