import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    applicationBackgroundColor,
    borderColor,
    borderColorHover,
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
    smallDelay
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')} :host {
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
        padding: 4px;
        box-shadow: 0px 2px 3px #00000029;
        background-color: ${applicationBackgroundColor};
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
        background-color: transparent;
    }

    :host([disabled]) .control {
        cursor: default;
    }

    :host(.open) .control,
    .control:hover {
        border-bottom: 2px solid ${borderColorHover};        
        transition: border-bottom ${smallDelay};
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
        top: calc(${controlHeight} + 3px);
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
        height: calc(${controlHeight} - 4px);
        width: calc(${controlHeight} - 4px);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .control:hover .indicator {
        background-color: rgba(${fillColorSelectedRgb}, 0.2);
    }

    .indicator slot[name="indicator"] svg {
        width: 1em;
        height: 1em;
        fill: ${contentFontColor};
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

    ::slotted([role="option"]),
    ::slotted(option) {
        flex: 0 0 auto;
    }
`;