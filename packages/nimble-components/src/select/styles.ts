import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    bodyDisabledFontColor,
    borderHoverColor,
    borderWidth,
    controlHeight,
    iconSize,
    popupBorderColor,
    popupBoxShadowColor,
    smallDelay,
    smallPadding,
    borderRgbPartialColor
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { SelectAppearance } from './types';

export const styles = css`
    ${display('inline-flex')}

    :host {
        box-sizing: border-box;
        color: ${bodyFontColor};
        font: ${bodyFont};
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
        --ni-private-listbox-padding: 4px;
        max-height: calc(
            var(--ni-private-select-max-height) - 2 *
                var(--ni-private-listbox-padding)
        );
        z-index: 1;
        padding: var(--ni-private-listbox-padding);
        box-shadow: 0px 3px 3px ${popupBoxShadowColor};
        border: 1px solid ${popupBorderColor};
        background-color: ${applicationBackgroundColor};
        background-clip: padding-box;
    }

    .listbox[hidden] {
        display: none;
    }

    .control {
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        min-height: 100%;
        width: 100%;
        border-bottom: ${borderWidth} solid ${bodyDisabledFontColor};
        background-color: transparent;
        padding-left: 8px;
        padding-bottom: 1px;
    }

    :host([disabled]) .control {
        cursor: default;
    }

    :host(.open:not(:hover)) .control {
        border-bottom: ${borderWidth} solid ${borderHoverColor};
        transition: border-bottom ${smallDelay}, padding-bottom ${smallDelay};
    }

    :host(:hover) .control {
        border-bottom: 2px solid ${borderHoverColor};
        padding-bottom: 0px;
        transition: border-bottom ${smallDelay}, padding-bottom ${smallDelay};
    }

    :host([disabled]) .control,
    :host([disabled]) .control:hover {
        border-bottom: ${borderWidth} solid ${bodyDisabledFontColor};
        padding-bottom: 1px;
        color: ${bodyDisabledFontColor};
    }

    :host([open][position='above']) .listbox {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    :host([open][position='below']) .listbox {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    :host([open][position='above']) .listbox {
        bottom: ${controlHeight};
    }

    :host([open][position='below']) .listbox {
        top: calc(${controlHeight} + ${smallPadding});
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
        padding-right: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .indicator slot[name='indicator'] svg {
        width: ${iconSize};
        height: ${iconSize};
        fill: ${bodyFontColor};
    }

    :host([disabled]) .indicator slot[name='indicator'] svg {
        fill: ${bodyDisabledFontColor};
    }

    slot[name='listbox'] {
        display: none;
        width: 100%;
    }

    :host([open]) slot[name='listbox'] {
        display: flex;
        position: absolute;
    }

    .end {
        margin-inline-start: auto;
    }

    ::slotted([role='option']),
    ::slotted(option) {
        flex: 0 0 auto;
    }
`.withBehaviors(
        appearanceBehavior(
            SelectAppearance.underline,
            css`
            .control {
                --ni-private-bottom-border-width: 1px;
                padding-top: ${borderWidth};
                padding-left: 9px;
                padding-right: ${borderWidth};
            }

            :host([disabled]) .control {
                border-color: rgba(${borderRgbPartialColor}, 0.1);
            }

            :host([disabled]) .control:hover {
                --ni-private-bottom-border-width: 1px;
            }
        `
        ),
        appearanceBehavior(
            SelectAppearance.outline,
            css`
            .control {
                --ni-private-bottom-border-width: 1px;
                border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.3);
                border-bottom-width: var(--ni-private-bottom-border-width);
            }

            :host(.invalid) .errortext {
                top: calc(${controlHeight} - ${borderWidth});
            }
        `
        ),
        appearanceBehavior(
            SelectAppearance.block,
            css`
            .control {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
                --ni-private-bottom-border-width: 1px;
                padding-top: ${borderWidth};
                padding-left: 9px;
                padding-right: ${borderWidth};
                padding-bottom: 3px;
                border-bottom: ${borderWidth}
                    rgba(${borderRgbPartialColor}, 0.07);
            }

            .control:focus-within {
                --ni-private-bottom-border-width: 1px;
            }

            .control:focus-within:hover {
                --ni-private-bottom-border-width: var(
                    --ni-private-hover-bottom-border-width
                );
            }

            :host(.invalid) .control {
                --ni-private-bottom-border-width: 1px;
            }

            :host(.invalid) .control:hover {
                --ni-private-bottom-border-width: var(
                    --ni-private-hover-bottom-border-width
                );
            }

            :host([readonly]) .control {
                background-color: rgba(${borderRgbPartialColor}, 0.07);
                border-color: transparent;
            }

            :host([disabled]) .control {
                background-color: rgba(${borderRgbPartialColor}, 0.07);
            }

            :host([disabled]) .control:hover {
                --ni-private-bottom-border-width: 0px;
            }

            :host(.invalid[disabled]) .control {
                --ni-private-bottom-border-width: 1px;
            }
        `
        )
    );
