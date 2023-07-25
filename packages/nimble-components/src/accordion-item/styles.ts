import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { actionRgbPartialColor, bodyFont, bodyFontColor, iconSize, placeholderFontColor } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        border-bottom: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }

    .region {
        display: none;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .heading {
        display: flex;
        background-color: rgba(${actionRgbPartialColor}, 0.1);
        position: relative;
        grid-template-columns: auto 1fr auto calc(
                (var(--base-height-multiplier) + var(--density)) * var(--design-unit) *
                    1px
            );
    }

    .button {
        appearance: none;
        border: none;
        background: none;
        grid-column: 2;
        grid-row: 1;
        outline: none;
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
        text-align: left;
        height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        cursor: pointer;
        font: inherit;
        color: inherit;
        order: 2;
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
        color: red;
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