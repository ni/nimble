import { css } from '@ni/fast-element';
import {
    bodyPlus1EmphasizedFont,
    bodyPlus1EmphasizedFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    controlHeight,
    dividerWidth,
    iconSize,
    largePadding,
    mediumPadding,
    mediumDelay,
    smallDelay,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { appearanceBehavior } from '@ni/nimble-components/dist/esm/utilities/style/appearance';
import { display } from '../utilities/style/display';
import { userSelectNone } from '../utilities/style/user-select';
import { FvAccordionItemAppearance } from './types';

export const styles = css`
    ${display('block')}

    :host {
        border-bottom: ${dividerWidth} solid transparent;
    }

    .accordion-item-details > .accordion-item-summary {
        display: flex;
        box-sizing: border-box;
        height: calc(${controlHeight} + (2 * ${dividerWidth}));
        align-items: center;
        margin-left: 0;
        padding-left: ${mediumPadding};
        border: ${dividerWidth} solid transparent;
        outline: ${dividerWidth} solid transparent;
        outline-offset: -1px;
        list-style: none;
        cursor: pointer;
        ${userSelectNone}
        transition:
            border-color ${smallDelay} ease-in,
            outline-color ${smallDelay} ease-in;
    }

    .accordion-item-details > .accordion-item-summary::-webkit-details-marker {
        display: none;
    }

    .accordion-item-details > .accordion-item-summary::marker {
        content: "";
    }

    .accordion-item-details > .accordion-item-summary:hover {
        border-color: ${borderHoverColor};
    }

    .accordion-item-details > .accordion-item-summary:focus-visible {
        outline: 2px solid ${borderHoverColor};
        outline-offset: -2px;
    }

    .accordion-item-icon {
        transition: transform ${mediumDelay} ease-in;
        margin: calc(${mediumPadding} - ${dividerWidth});
        min-width: ${iconSize};
    }

    .accordion-item-details[open] > .accordion-item-summary > .accordion-item-icon {
        transform: rotate(90deg);
    }

    .accordion-item-title {
        flex: 1;
        width: 100%;
        position: relative;
        font: ${bodyPlus1EmphasizedFont};
        color: ${bodyPlus1EmphasizedFontColor};
        text-align: left;
        display: block;
        /* Preserve descenders within the ellipsis clip region without shifting the text. */
        padding-bottom: 2px;
        margin-bottom: -2px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        overflow-wrap: normal;
    }

    .accordion-item-content {
        display: flex;
        flex-direction: column;
        gap: ${standardPadding};
        margin-left: ${largePadding};
        margin-top: ${mediumPadding};
        padding-bottom: ${standardPadding};
    }
`.withBehaviors(
    appearanceBehavior(
        FvAccordionItemAppearance.outline,
        css`
            :host {
                border-bottom: ${dividerWidth} solid rgba(${borderRgbPartialColor}, 0.2);
                border-bottom-color: rgba(${borderRgbPartialColor}, 0.2);
            }
        `
    ),
    appearanceBehavior(
        FvAccordionItemAppearance.block,
        css`
            .accordion-item-details > .accordion-item-summary {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
            }

            .accordion-item-details > .accordion-item-summary:hover {
                border-color: transparent;
                outline-color: ${borderHoverColor};
            }
        `
    )
);
