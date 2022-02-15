import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    borderColorRgbPartial,
    borderColorHover,
    borderWidth,
    contentFontColor,
    contentFontColorDisabled,
    contentFontSize,
    controlHeight,
    failColor,
    fillColorSelectedRgbPartial,
    fontFamily,
    iconSize,
    labelFontColor,
    labelFontColorDisabled,
    labelFontFamily,
    labelFontSize,
    labelFontWeight,
    labelHeight,
    labelTextTransform,
    smallDelay,
    standardPadding
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { TextFieldAppearance } from './types';
import { Theme } from '../theme-provider/types';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('inline-block')}

    :host {
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        outline: none;
        user-select: none;
        color: ${contentFontColor};
        height: calc(${labelHeight} + ${controlHeight});
    }

    :host([disabled]) {
        color: ${contentFontColorDisabled};
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        border-radius: 0px;
        font-family: ${fontFamily};
        transition: border-bottom ${smallDelay}, padding-bottom ${smallDelay};
        align-items: flex-end;
        --ni-private-hover-bottom-border-width: 2px;
        border: 0px solid rgba(${borderColorRgbPartial}, 0.3);
        border-bottom-width: var(--ni-private-bottom-border-width);
        padding-bottom: calc(
            var(--ni-private-hover-bottom-border-width) -
                var(--ni-private-bottom-border-width)
        );
    }

    :host .root:hover {
        --ni-private-bottom-border-width: var(
            --ni-private-hover-bottom-border-width
        );
    }

    :host([disabled]) .root:hover {
        --ni-private-bottom-border-width: 1px;
    }

    .root:focus-within,
    .root:hover {
        border-bottom-color: ${borderColorHover};
    }

    :host(.invalid) .root {
        border-bottom-color: ${failColor};
    }

    :host([disabled]) .root {
        border-color: rgba(${borderColorRgbPartial}, 0.1);
    }

    :host([readonly]) .root {
        border: none;
        padding: ${borderWidth};
    }

    @media (prefers-reduced-motion) {
        .root {
            transition-duration: 0s;
        }
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        color: inherit;
        padding-top: 0px;
        padding-bottom: 0px;
        height: calc(
            ${controlHeight} - ${borderWidth} -
                var(--ni-private-hover-bottom-border-width)
        );
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        padding-left: calc(${standardPadding} / 2);
        padding-right: calc(${standardPadding} / 2);
        border: none;
    }

    .control:hover,
    .control:focus,
    .control:disabled,
    .control:active {
        outline: none;
    }

    .control::selection {
        color: ${labelFontColor};
        background: rgba(${fillColorSelectedRgbPartial}, 0.3);
    }

    .control::placeholder {
        color: ${labelFontColor};
    }

    .control:not([readonly]):focus-within::placeholder {
        opacity: 1;
    }

    .control[readonly] {
        cursor: default;
    }

    .control[disabled]::placeholder {
        color: ${contentFontColorDisabled};
    }

    .label {
        display: flex;
        color: ${labelFontColor};
        font-family: ${labelFontFamily};
        font-size: ${labelFontSize};
        font-weight: ${labelFontWeight};
        line-height: ${labelHeight};
        text-transform: ${labelTextTransform};
    }

    :host([disabled]) .label {
        color: ${labelFontColorDisabled};
    }

    :host [part='end'] {
        display: none;
    }

    :host(.invalid) [part='end'] {
        align-self: center;
        display: inline-flex;
        padding-left: 8px;
        padding-right: 8px;
    }

    :host(.invalid) [part='end'] svg {
        height: ${iconSize};
        width: ${iconSize};
    }

    :host(.invalid) [part='end'] path {
        fill: ${failColor};
    }

    :host([disabled]) [part='end'] path {
        fill: ${contentFontColorDisabled};
    }
`.withBehaviors(
        appearanceBehavior(
            TextFieldAppearance.Underline,
            css`
            .root {
                --ni-private-bottom-border-width: 1px;
                padding-top: ${borderWidth};
                padding-left: ${borderWidth};
                padding-right: ${borderWidth};
            }
        `
        ),
        appearanceBehavior(
            TextFieldAppearance.Block,
            css`
            .root {
                background-color: rgba(${borderColorRgbPartial}, 0.05);
                --ni-private-bottom-border-width: 0px;
                padding-top: ${borderWidth};
                padding-left: ${borderWidth};
                padding-right: ${borderWidth};
            }

            .root:focus-within,
            :host(.invalid) .root,
            :host([disabled]) .root {
                --ni-private-bottom-border-width: 1px;
            }

            :host([disabled]) .root,
            :host([readonly]) .root {
                background-color: transparent;
            }
        `
        ),
        appearanceBehavior(
            TextFieldAppearance.Outline,
            css`
            .root {
                --ni-private-bottom-border-width: 1px;
                border-width: ${borderWidth};
                border-bottom-width: var(--ni-private-bottom-border-width);
            }
        `
        ),
        themeBehavior(
            css`
            ${'' /* Light theme */}
            .control::-ms-reveal {
                filter: invert(0%);
            }
        `,
            css`
            ${'' /* Dark theme */}
            .control::-ms-reveal {
                filter: invert(100%);
            }
        `,
            // Color theme
            Theme.Dark
        )
    );
