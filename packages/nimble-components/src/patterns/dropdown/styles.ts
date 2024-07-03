import { css } from '@microsoft/fast-element';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { display } from '../../utilities/style/display';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    bodyDisabledFontColor,
    borderHoverColor,
    borderWidth,
    controlHeight,
    iconSize,
    menuMinWidth,
    popupBorderColor,
    smallDelay,
    smallPadding,
    borderRgbPartialColor,
    mediumPadding,
    failColor,
    elevation2BoxShadow
} from '../../theme-provider/design-tokens';
import { Theme } from '../../theme-provider/types';
import { appearanceBehavior } from '../../utilities/style/appearance';
import { hexToRgbaCssColor } from '../../utilities/style/colors';
import { focusVisible } from '../../utilities/style/focus';
import { themeBehavior } from '../../utilities/style/theme';
import { DropdownAppearance } from './types';
import { userSelectNone } from '../../utilities/style/user-select';

// prettier-ignore
export const styles = css`
    ${display('inline-flex')}

    :host {
        color: ${bodyFontColor};
        font: ${bodyFont};
        height: ${controlHeight};
        position: relative;
        justify-content: center;
        ${userSelectNone}
        min-width: ${menuMinWidth};
        outline: none;
        vertical-align: top;
        --ni-private-hover-indicator-width: calc(${borderWidth} + 1px);
        --ni-private-focus-indicator-width: 1px;
        --ni-private-indicator-lines-gap: 1px;
    }

    :host::before {
        content: '';
        position: absolute;
        bottom: calc(${borderWidth} + var(--ni-private-indicator-lines-gap));
        width: 0px;
        height: 0px;
        justify-self: center;
        border-bottom: ${borderHoverColor}
            var(--ni-private-focus-indicator-width) solid;
        transition: width ${smallDelay} ease-in;
    }

    @media (prefers-reduced-motion) {
        :host::before {
            transition-duration: 0s;
        }
    }

    :host(${focusVisible})::before {
        width: calc(100% - 8px);
    }

    :host([error-visible]):before {
        border-bottom-color: ${failColor};
    }

    :host::after {
        content: '';
        position: absolute;
        bottom: calc(-1 * ${borderWidth});
        width: 0px;
        height: 0px;
        justify-self: center;
        border-bottom: ${borderHoverColor}
            var(--ni-private-hover-indicator-width) solid;
        transition: width ${smallDelay} ease-in;
    }

    @media (prefers-reduced-motion) {
        :host::after {
            transition-duration: 0s;
        }
    }

    :host(:hover)::after,
    :host(${focusVisible})::after {
        width: 100%;
    }

    :host([error-visible]):after {
        border-bottom-color: ${failColor};
    }

    :host([disabled]:hover)::after {
        width: 0px;
    }

    [part='start'] {
        display: none;
    }

    .control {
        align-items: center;
        cursor: pointer;
        display: flex;
        min-height: 100%;
        width: 100%;
        border: 0px solid rgba(${borderRgbPartialColor}, 0.3);
        background-color: transparent;
        padding: ${borderWidth};
    }

    :host([open]:not(:hover)) .control {
        border-bottom-color: ${borderHoverColor};
    }

    :host([disabled]) .control {
        cursor: default;
        color: ${bodyDisabledFontColor};
        border-color: rgba(${borderRgbPartialColor}, 0.1);
    }

    :host([error-visible]) .control,
    :host([error-visible][open]) .control,
    :host([error-visible][disabled]) .control {
        border-bottom-color: ${failColor};
    }

    .listbox {
        display: inline-flex;
        flex-direction: column;
        overflow-y: auto;
        width: 100%;
        --ni-private-listbox-visible-option-count: 10.5;
        --ni-private-listbox-anchor-element-gap: ${smallPadding};
        --ni-private-listbox-padding: ${smallPadding};
        --ni-private-listbox-filter-height: 0px;
        --ni-private-listbox-loading-indicator-height: 0px;
        max-height: min(
            calc(
                var(--ni-private-listbox-anchor-element-gap) + 
                2 * ${borderWidth} + 
                var(--ni-private-listbox-padding) +
                ${controlHeight} * var(--ni-private-listbox-visible-option-count) +
                var(--ni-private-listbox-filter-height) +
                var(--ni-private-listbox-loading-indicator-height)
            ),
            calc(
                var(--ni-private-listbox-available-viewport-height) - 
                var(--ni-private-listbox-anchor-element-gap)
            )
        );
        box-shadow: ${elevation2BoxShadow};
        border: ${borderWidth} solid ${popupBorderColor};
        background-color: ${applicationBackgroundColor};
    }

    .listbox:has(.filter-field) {
        --ni-private-listbox-filter-height: ${controlHeight};
    }

    .listbox:has(.loading-container) {
        --ni-private-listbox-loading-indicator-height: ${controlHeight};
    }

    .listbox slot {
        display: block;
        background: transparent;
        padding: var(--ni-private-listbox-padding);
    }

    :host([open][position='above']) .listbox {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    :host([open][position='below']) .listbox {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    :host([open][position='above']) .anchored-region {
        padding-bottom: ${smallPadding};
    }

    :host([open][position='below']) .anchored-region {
        padding-top: ${smallPadding};
    }

    .selected-value {
        flex: auto;
        font-family: inherit;
        text-align: start;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding: 0px;
        padding-left: ${mediumPadding};
    }

    .selected-value[disabled]::placeholder {
        color: ${bodyDisabledFontColor};
    }

    .indicator {
        flex: none;
        margin-left: ${smallPadding};
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

    [part='end'] {
        margin-inline-start: auto;
    }

    ::slotted([role='option']),
    ::slotted(option) {
        flex: none;
    }
`.withBehaviors(
    appearanceBehavior(
        DropdownAppearance.underline,
        css`
            .control {
                border-bottom-width: ${borderWidth};
                padding-bottom: 0;
            }

            :host([disabled]) .control {
                border-color: rgba(${borderRgbPartialColor}, 0.1);
            }
        `
    ),
    appearanceBehavior(
        DropdownAppearance.outline,
        css`
            .control {
                border-width: ${borderWidth};
                padding: 0;
            }
        `
    ),
    appearanceBehavior(
        DropdownAppearance.block,
        css`
            .control {
                background-color: rgba(${borderRgbPartialColor}, 0.1);
            }

            .control:focus-within {
                border-bottom-width: ${borderWidth};
                padding-bottom: 0;
            }

            :host([disabled]) .control {
                background-color: rgba(${borderRgbPartialColor}, 0.07);
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            .listbox slot {
                background: ${hexToRgbaCssColor(White, 0.15)};
            }
        `
    )
);
