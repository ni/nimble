import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderColor,
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    borderWidth
} from '../theme-provider/design-tokens';

// font should be source sans pro regular 11px

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

    .tooltip {
        box-sizing: border-box;
        flex-shrink: 0;
        border: ${borderWidth} solid ${borderColor};
        padding: 2px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
`;
