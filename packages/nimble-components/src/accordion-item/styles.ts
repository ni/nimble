import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { actionRgbPartialColor, bodyFont, bodyFontColor, borderHoverColor, borderWidth, iconSize, placeholderFontColor } from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { AccordionAppearance } from '../accordion/types';

export const styles = css`
    ${display('inline-flex')}

    :host {
        background-color: transparent;
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        line-height: 16px;
        margin: 4px;
        border: 0px solid transparent;
    }

    :host(:hover) {
        box-shadow: 0px 0px 0px 2px ${borderHoverColor} inset;
    }

    :host(:active) {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }

    :host(:hover[expanded]) {
    }

    .heading {
        display: grid;
        position: relative;
        grid-template-columns: auto 1fr auto calc((10 + 0) * 4 * 1px);
        box-shadow: 0px 0px 0px ${borderWidth} rgba(${actionRgbPartialColor}, 0.3) inset;
    }

    .heading:hover {
        box-shadow: none;
    }

    .region {
        display: none;
        font: ${bodyFont};
        color: ${bodyFontColor};
        gap: 4px;
        padding-bottom: 2px;
        padding-left: 4px;
        padding-right: 4px;

    }

    .button {
        appearance: none;
        border: none;
        background: none;
        grid-column: 2;
        grid-row: 1;
        padding-top: 7px;
        padding-bottom: 9px;
        outline: none;
        text-align: left;
        cursor: pointer;
        font: inherit;
        color: inherit;
    }

    .button:hover {
        color: var(--neutral-foreground-rest);
    }

    .button:active {
        color: var(--neutral-foreground-rest);
    }

    .button::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        cursor: pointer;
    }

    .button:focus-visible::before {
        outline: none;
        border: calc(var(--focus-stroke-width) * 1px) solid var(--focus-stroke-outer);
        border-radius: calc(var(--control-corner-radius) * 1px);
    }

    :host([expanded]) .region {
        display: block;
        color: black;
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-column: 4;
        pointer-events: none;
        position: relative;
        order: 1;
    }

    :host([appearance='outline']) {
        border-color: rgba(${actionRgbPartialColor}, 0.3);
    }

    slot[name="expanded-icon"],
    slot[name="collapsed-icon"] {
        fill: var(--accent-fill-rest);
    }

    slot[name="collapsed-icon"] {
        display: flex;
    }

    slot[name='collapsed-icon'] svg {
        width: ${iconSize};
        height: ${iconSize};
        fill: ${placeholderFontColor};
    }

    :host([expanded]) slot[name="collapsed-icon"] {
        display: none;
    }

    slot[name="expanded-icon"] {
        display: none;
    }

    :host([expanded]) slot[name="expanded-icon"] {
        display: flex;
    }

    
    :host([expanded]) slot[name="expanded-icon"] svg {
        width: ${iconSize};
        height: ${iconSize};
        fill: ${placeholderFontColor};
    }

    ::slotted([slot="start"]) {
        display: flex;
        align-items: center;
        margin-inline-end: calc(var(--design-unit) * 1px);
        justify-content: center;
        grid-column: 1;
        position: relative;
    }

    ::slotted([slot="end"]) {
        display: flex;
        align-items: center;
        margin-inline-start: calc(var(--design-unit) * 1px);
        justify-content: center;
        grid-column: 3;
        position: relative;
    }


`;
