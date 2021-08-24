import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderColor,
    // borderColorHover,
    // fillColorSelectedRgb,
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
        --elevation: 14;
        box-sizing: border-box;
        color: ${contentFontColor};
        font-family: ${fontFamily};
        height: ${controlHeight};
        position: relative;
        user-select: none;
        min-width: 250px;
        outline: none;
        vertical-align: top;
    }
    .listbox {
        box-sizing: border-box;
        display: inline-flex;
        flex-direction: column;
        left: 0;
        overflow-y: auto;
        position: absolute;
        width: 100%;
        z-index: 1;
    }
    .listbox[hidden] {
        display: none;
    }
    .control {
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        font-size: ${contentFontSize};
        font-family: inherit;
        min-height: 100%;
        width: 100%;
        border-bottom: 2px solid ${borderColor};
    }
    :host([open][position="above"]) .listbox {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    :host([open][position="below"]) .listbox {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
    :host([open][position="above"]) .listbox {
        border-bottom: 0;
        bottom: ${controlHeight};
    }
    :host([open][position="below"]) .listbox {
        border-top: 0;
        top: ${controlHeight};
    }
    .selected-value {
        flex: 1 1 auto;
        font-family: inherit;
        text-align: start;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .indicator {
        flex: 0 0 auto;
        margin-inline-start: 1em;
    }
    slot[name="listbox"] {
        display: none;
        width: 100%;
    }
    :host([open]) slot[name="listbox"] {
        display: flex;
        position: absolute;
    }
    .end {
        margin-inline-start: auto;
    }
    .start,
    .end,
    .indicator,
    .select-indicator,
    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        fill: currentcolor;
        height: 1em;
        width: 1em;
    }
    ::slotted([role="option"]),
    ::slotted(option) {
        flex: 0 0 auto;
    }
`;