import { css } from '@ni/fast-element';
import {
    bodyPlus1EmphasizedFont,
    bodyPlus1EmphasizedFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    dividerWidth,
    iconSize,
    mediumDelay,
    mediumPadding,
    smallDelay,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { appearanceBehavior } from '@ni/nimble-components/dist/esm/utilities/style/appearance';
import { display } from '../utilities/style/display';
import { AccordionItemAppearance } from './types';

export const styles = css`
    ${display('block')}

    .accordion-item-details > .accordion-item-summary {
        display: flex;
        box-sizing: border-box;
        height: 36px;
        align-items: center;
        margin-left: calc(-1 * ${mediumPadding});
        border: ${dividerWidth} solid transparent;
        list-style: none;
        cursor: pointer;
        user-select: none;
    }

    .accordion-item-details > .accordion-item-summary::-webkit-details-marker {
        display: none;
    }

    .accordion-item-details > .accordion-item-summary::marker {
        content: "";
    }

    .accordion-item-details > .accordion-item-summary:hover {
        border: ${dividerWidth} solid ${borderHoverColor};
        transition: ${smallDelay} ease-in;
    }

    .accordion-item-details > .accordion-item-summary:focus-visible {
        outline: 2px solid ${borderHoverColor};
        outline-offset: -2px;
    }

    .accordion-item-icon {
        transition: transform ${mediumDelay} ease-in;
        margin: ${mediumPadding};
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
        line-height: 20px;
        color: ${bodyPlus1EmphasizedFontColor};
        text-align: left;
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        overflow-wrap: normal;
    }

    .accordion-item-content {
        display: flex;
        flex-direction: column;
        gap: ${mediumPadding};
        margin-left: calc(${iconSize} + ${mediumPadding});
        margin-top: ${mediumPadding};
        padding-bottom: ${standardPadding};
    }
`.withBehaviors(
    appearanceBehavior(
        AccordionItemAppearance.outline,
        css`
            :host {
                border-bottom: ${dividerWidth} solid rgba(${borderRgbPartialColor}, 0.2);
            }
        `
    ),
    appearanceBehavior(
        AccordionItemAppearance.block,
        css`
            :host {
                margin-bottom: 2px;
            }

            .accordion-item-details > .accordion-item-summary {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                margin-left: 0;
                padding-left: 0;
                border: none;
            }

            .accordion-item-details > .accordion-item-summary:hover {
                border: none;
                outline: ${dividerWidth} solid ${borderHoverColor};
                outline-offset: -1px;
            }

            .accordion-item-content {
                margin-left: calc(${iconSize} + (2 * ${mediumPadding}));
            }
        `
    )
);
