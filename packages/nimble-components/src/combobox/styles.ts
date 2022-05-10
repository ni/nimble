import { css, ElementStyles } from '@microsoft/fast-element';
import {
    ComboboxOptions,
    disabledCursor,
    FoundationElementTemplate
} from '@microsoft/fast-foundation';
import {
    fillSelectedColor,
    controlHeight,
    iconSize,
    failColor,
    bodyDisabledFontColor,
    errorTextFont,
    borderWidth,
    borderRgbPartialColor,
    smallPadding
} from '../theme-provider/design-tokens';

import { styles as selectStyles } from '../select/styles';
import { focusVisible } from '../utilities/style/focus';

export const styles: FoundationElementTemplate<ElementStyles, ComboboxOptions> = (_context, _definition) => css`
        ${selectStyles(_context, _definition)}

        :host {
            --ni-private-hover-bottom-border-width: 2px;
            --ni-private-bottom-border-width: 1px;
        }

        :host(:not([disabled]):hover) {
            --ni-private-bottom-border-width: var(
                --ni-private-hover-bottom-border-width
            );
        }

        :host([disabled]) *,
        :host([disabled]) {
            cursor: ${disabledCursor};
            user-select: none;
            color: ${bodyDisabledFontColor};
        }

        :host .control {
            bottom-border-width: var(--ni-private-bottom-border-width);
        }

        :host(.invalid) .control {
            border-bottom: var(--ni-private-bottom-border-width) solid
                ${failColor};
        }

        :host([disabled]) .control {
            border-color: rgba(${borderRgbPartialColor}, 0.1);
        }

        .selected-value {
            -webkit-appearance: none;
            background: transparent;
            border: none;
            color: inherit;
            margin: auto 0;
            width: 100%;
        }

        .selected-value:hover,
        .selected-value${focusVisible}, .selected-value:disabled,
        .selected-value:active {
            outline: none;
        }

        [part='indicator'] {
            display: none;
        }

        .end-slot-container {
            display: flex;
            align-items: baseline;
        }

        .error-content {
            width: ${iconSize};
            display: none;
        }

        :host(.invalid) .error-content {
            display: contents;
        }

        :host(.invalid) .error-content svg {
            height: ${iconSize};
            width: ${iconSize};
            padding-right: ${smallPadding};
            flex: none;
        }

        :host(.invalid) .error-content path {
            fill: ${failColor};
        }

        :host([disabled]) .error-content path,
        :host([disabled]) .dropdown-icon {
            fill: ${bodyDisabledFontColor};
        }

        .separator {
            display: inline;
            width: 2px;
            border-right: 2px solid rgba(${borderRgbPartialColor}, 0.15);
            height: calc(${controlHeight} - 12px);
            align-self: center;
        }

        :host([open]) slot[name='end'] .dropdown-button:not(.checked) {
            background: ${fillSelectedColor};
        }

        .dropdown-button {
            width: 24px;
            height: 24px;
            margin-left: ${smallPadding};
        }

        .dropdown-button::part(control) {
            padding: 0px;
            border-color: transparent;
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
            left: 0px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        :host(.invalid[readonly]:not([disabled])) .errortext {
            top: calc(${controlHeight} - ${borderWidth});
        }

        :host(.invalid) .error-text:empty {
            display: none;
        }

        :host([disabled]) .errortext {
            color: ${bodyDisabledFontColor};
        }

        :host(:empty) .listbox {
            display: none;
        }
    `;
