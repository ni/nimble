import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { actionRgbPartialColor, bodyFont, bodyFontColor, borderHoverColor, borderWidth, iconSize, mediumDelay, placeholderFontColor } from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { AccordionAppearance } from './types';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    /* 
        Notable issues / Reason for changes
        Using expandedIcon / collapsedIcon causes issues because fast by default has it set to be on the right. When changing the order to place it on the left,
        focusVisible is messed up because the icon should be on the right, not the left, and the focusVisible border cuts between the left icon and right text. Might have to 
        change the template for this

        When the accordion is open and has the border around the entire accordion header and content, the functionality that is shown in the figma spec for hover and active is complicated-
        we want the entire accordion item to have a green border on hover, but do we want the border to shrink when the user clicks on a random spot inside the accordion item content
        (not on the button)? We need a border around the entire accordion item but only want the border to change in size when we click on the "button" portion of that accordion item 
        (the header), which might be possible with the :has() pseudo-element but this is not fully supported by all browsers.
    */

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

    :host(${focusVisible}) {
        box-shadow: 0px 0px 0px 2px ${borderHoverColor} inset;
    }

    :host(:active) {
        box-shadow: 0px 0px 0px ${borderWidth} ${borderHoverColor} inset;
    }

    :host(:hover[expanded]) {
        box-shadow: 0px 0px 0px 2px ${borderHoverColor} inset;
    }

    :host(:active[expanded]) {
        box-shadow: 0px 0px 0px 1px ${borderHoverColor} inset;
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }

    .heading {
        display: flex;
        position: relative;
        grid-template-columns: auto 1fr auto calc((10 + 0) * 4 * 1px);
        background-color: transparent;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        box-sizing: border-box;
        width: 100%;
    }

    .button${focusVisible} {
        box-shadow: 0px 0px 0px 2px ${borderHoverColor} inset;
    }

    slot[name="heading"]::slotted(*) {
        display: flex;
        justify-content: space-between;
        flex-direction: unset;
        width: 100%;
    }
    
    .region {
        font: ${bodyFont};
        color: ${bodyFontColor};
        gap: 13px;
        padding-top: 9px;
        padding-bottom: 5px;
        padding-left: 38px;
        padding-right: 4px;

    }

    :host([expanded]) .region {
        display: flex;
        color: black;
    }

    ::slotted(*) {
        display: flex;
        flex-direction: column;
        width: fit-content;
        gap: 18px;
    }

    .button {
        display: flex;
        appearance: none;
        border: none;
        background: none;
        grid-column: 2;
        grid-row: 1;
        padding: 3px;
        outline: none;
        text-align: left;
        cursor: pointer;
        font: inherit;
        color: inherit;
        width: 100%;
        background-color: transparent;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        box-sizing: border-box;
    }

    .button:hover {
        color: var(--neutral-foreground-rest);
    }

    .button:active {
        color: var(--neutral-foreground-rest);
    }



    .icon {
        display: flex;
        position: relative;
        background: none;
        border: none;
        outline: none;
        padding: 0px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding-top: 4.5px;
        padding-left: 13px;
        padding-right: 8px;
        padding-bottom: 5.5px;
        pointer-events: none;
    }

    .heading-content {
        padding-left: 0px;
        padding-top: 4px;
        padding-bottom: 6px;
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
        fill: currentColor;
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
        fill: currentColor;
    }

    ::slotted([slot="start"]) {
        display: none;
    }

    ::slotted([slot="end"]) {
        display: none;
    }
    /* 
        I believe appearanceBehavior has to be set on the accordion item. If we set it on the accordion itself (the styles.ts of the accordion), we can't use appearanceBehaviors in the accordion item styles.ts, 
        and when using them in the accordion styles.ts, individual accordion items can't be styled (ex. gaps, borders around accordion items, etc.).
    */
`.withBehaviors(
    appearanceBehavior(
        AccordionAppearance.outline,
        css`
            .heading {
                box-shadow: 0px 0px 0px ${borderWidth} rgba(${actionRgbPartialColor}, 0.3) inset;
            }

            .heading:hover {
                box-shadow: none
            }

            :host([expanded]) .heading {
                box-shadow: none;
            }

            :host([expanded]) {
                box-shadow: 0px 0px 0px ${borderWidth} rgba(${actionRgbPartialColor}, 0.3) inset;
            }
        `
    ),
    appearanceBehavior(
        AccordionAppearance.ghost,
        css`
        `
    ),
    appearanceBehavior(
        AccordionAppearance.block,
        css`
            .button {
                background-color: rgba(${actionRgbPartialColor}, 0.1)
            }

            .button:hover {
                background-color: transparent;
                background-image: linear-gradient(
                    rgba(${actionRgbPartialColor}, 0.1),
                    rgba(${actionRgbPartialColor}, 0.1)
                );
                background-size: calc(100% - 6px) calc(100% - 6px);
            }

            .button:active {
                background-color: transparent;
                background-image: linear-gradient(
                    rgba(${actionRgbPartialColor}, 0.1),
                    rgba(${actionRgbPartialColor}, 0.1)
                );
                background-size: calc(100% - 4px) calc(100% - 4px);
            }

            :host([expanded]) .heading:hover {
                
            }

            .button${focusVisible} {
                background-color: transparent;
                background-image: linear-gradient(
                    rgba(${actionRgbPartialColor}, 0.1),
                    rgba(${actionRgbPartialColor}, 0.1)
                );
                background-size: calc(100% - 6px) calc(100% - 6px);
            }
        `
    )
);
