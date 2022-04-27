import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    borderRgbPartialColor,
    borderHoverColor,
    borderWidth,
    bodyFontColor,
    bodyDisabledFontColor,
    controlHeight,
    errorTextFont,
    failColor,
    fillSelectedRgbPartialColor,
    iconSize,
    labelHeight,
    smallDelay,
    controlLabelFont,
    bodyFont,
    controlLabelFontColor,
    controlLabelDisabledFontColor,
    standardPadding
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { TextFieldAppearance } from './types';
import { Theme } from '../theme-provider/types';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('inline-block')}

    :host {
        font: ${bodyFont};
        outline: none;
        user-select: none;
        --webkit-user-select: none;
        color: ${bodyFontColor};
        height: calc(${labelHeight} + ${controlHeight});
    }

    :host([disabled]) {
        color: ${bodyDisabledFontColor};
    }

    .label {
        display: flex;
        color: ${controlLabelFontColor};
        font: ${controlLabelFont};
    }

    :host([disabled]) .label {
        color: ${controlLabelDisabledFontColor};
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        border-radius: 0px;
        font: inherit;
        transition: border-bottom ${smallDelay}, padding-bottom ${smallDelay};
        align-items: center;
        --ni-private-hover-bottom-border-width: 2px;
        border: 0px solid rgba(${borderRgbPartialColor}, 0.3);
        border-bottom-width: var(--ni-private-bottom-border-width);
        padding-bottom: calc(
            var(--ni-private-hover-bottom-border-width) -
                var(--ni-private-bottom-border-width)
        );
    }

    @media (prefers-reduced-motion) {
        .root {
            transition-duration: 0s;
        }
    }

    :host(.invalid) .root {
        border-bottom-color: ${failColor};
    }

    :host([readonly]) .root {
        border-color: rgba(${borderRgbPartialColor}, 0.1);
    }

    :host([disabled]) .root {
        border-color: rgba(${borderRgbPartialColor}, 0.1);
    }

    .root:hover {
        --ni-private-bottom-border-width: var(
            --ni-private-hover-bottom-border-width
        );
        border-bottom-color: ${borderHoverColor};
    }

    :host([readonly]) .root:hover {
        --ni-private-bottom-border-width: 1px;
    }

    :host([disabled]) .root:hover {
        --ni-private-bottom-border-width: 1px;
    }

    .root:focus-within {
        border-bottom-color: ${borderHoverColor};
    }

    [part='start'] {
        display: contents;
    }

    slot[name='start']::slotted(*) {
        margin-left: 8px;
        flex: none;
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
        text-overflow: ellipsis;
    }

    .control:hover,
    .control:focus,
    .control:disabled,
    .control:active {
        outline: none;
    }

    .control::selection {
        color: ${controlLabelFontColor};
        background: rgba(${fillSelectedRgbPartialColor}, 0.3);
    }

    .control::placeholder {
        color: ${controlLabelFontColor};
    }

    .control:not([readonly]):focus-within::placeholder {
        opacity: 1;
    }

    .control[disabled]::placeholder {
        color: ${bodyDisabledFontColor};
    }

    [part='end'] {
        display: contents;
    }

    .error-content {
        display: none;
    }

    :host(.invalid) .error-content {
        display: contents;
    }

    :host(.invalid) .error-content svg {
        height: ${iconSize};
        width: ${iconSize};
        padding-right: 8px;
        flex: none;
    }

    :host(.invalid) .error-content path {
        fill: ${failColor};
    }

    :host([disabled]) .error-content path {
        fill: ${bodyDisabledFontColor};
    }

    .errortext {
        display: none;
    }

    :host(.invalid) .errortext {
        display: block;
        font: ${errorTextFont};
        color: ${failColor};
        width: 100%;
        position: absolute;
        top: ${controlHeight};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    :host(.invalid) .error-text:empty {
        display: none;
    }

    :host([disabled]) .errortext {
        color: ${bodyDisabledFontColor};
    }

    [part='actions'] {
        display: contents;
    }

    slot[name='actions']::slotted(*) {
        margin-right: 8px;
        ${controlHeight.cssCustomProperty}: 24px;
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

            :host([disabled]) .root {
                border-color: rgba(${borderRgbPartialColor}, 0.1);
            }

            :host([disabled]) .root:hover {
                --ni-private-bottom-border-width: 1px;
            }
        `
        ),
        appearanceBehavior(
            TextFieldAppearance.Block,
            css`
            .root {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                --ni-private-bottom-border-width: 0px;
                padding-top: ${borderWidth};
                padding-left: ${borderWidth};
                padding-right: ${borderWidth};
            }

            .root:focus-within {
                --ni-private-bottom-border-width: 1px;
            }

            .root:focus-within:hover {
                --ni-private-bottom-border-width: var(
                    --ni-private-hover-bottom-border-width
                );
            }

            :host(.invalid) .root {
                --ni-private-bottom-border-width: 1px;
            }

            :host(.invalid) .root:hover {
                --ni-private-bottom-border-width: var(
                    --ni-private-hover-bottom-border-width
                );
            }

            :host([readonly]) .root {
                background-color: rgba(${borderRgbPartialColor}, 0.07);
                border-color: transparent;
            }

            :host([disabled]) .root {
                background-color: rgba(${borderRgbPartialColor}, 0.07);
            }

            :host([disabled]) .root:hover {
                --ni-private-bottom-border-width: 0px;
            }

            :host(.invalid[disabled]) .root {
                --ni-private-bottom-border-width: 1px;
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

            :host(.invalid) .errortext {
                top: calc(${controlHeight} - ${borderWidth});
            }
        `
        ),
        appearanceBehavior(
            TextFieldAppearance.Frameless,
            css`
            .root {
                --ni-private-bottom-border-width: 0px;
                padding-top: ${borderWidth};
                padding-left: ${borderWidth};
                padding-right: ${borderWidth};
            }

            :host([readonly]) .root {
                border-color: transparent;
            }

            .root:hover {
                --ni-private-bottom-border-width: 0px;
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
