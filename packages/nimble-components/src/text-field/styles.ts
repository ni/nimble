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

    :host(.invalid) .root,
    :host(:invalid) .root {
        border-bottom-color: ${failColor};
    }

    :host([readonly]:not([disabled])) .root {
        border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.1);
        padding: 0px;
        padding-bottom: 1px;
        background-color: transparent;
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

    :host([disabled]) .root:hover {
        --ni-private-bottom-border-width: 1px;
    }

    .root:focus-within {
        border-bottom-color: ${borderHoverColor};
    }

    [part='start'] {
        display: none;
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
        display: none;
    }

    :host(.invalid) [part='end'],
    :host(:invalid) [part='end'] {
        display: contents;
    }

    :host(.invalid) [part='end'] svg,
    :host(:invalid) [part='end'] svg {
        height: ${iconSize};
        width: ${iconSize};
        padding-right: 8px;
        flex: none;
    }

    :host(.invalid) [part='end'] path,
    :host(:invalid) [part='end'] path {
        fill: ${failColor};
    }

    :host([disabled]) [part='end'] path {
        fill: ${bodyDisabledFontColor};
    }

    .errortext {
        display: none;
    }

    :host(.invalid) .errortext,
    :host(:invalid) .errortext {
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

    :host(.invalid[readonly]:not([disabled])) .errortext,
    :host(:invalid[readonly]:not([disabled])) .errortext {
        top: calc(${controlHeight} - ${borderWidth});
    }

    :host(.invalid) .error-text:empty,
    :host(:invalid) .error-text:empty {
        display: none;
    }

    :host([disabled]) .errortext {
        color: ${bodyDisabledFontColor};
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

            :host(.invalid) .root,
            :host(:invalid) .root {
                --ni-private-bottom-border-width: 1px;
            }

            :host(.invalid) .root:hover,
            :host(:invalid) .root:hover {
                --ni-private-bottom-border-width: var(
                    --ni-private-hover-bottom-border-width
                );
            }

            :host([disabled]) .root {
                background-color: rgba(${borderRgbPartialColor}, 0.07);
            }

            :host([disabled]) .root:hover {
                --ni-private-bottom-border-width: 0px;
            }

            :host(.invalid[disabled]) .root,
            :host(:invalid[disabled]) .root {
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

            :host(.invalid) .errortext,
            :host(:invalid) .errortext {
                top: calc(${controlHeight} - ${borderWidth});
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
