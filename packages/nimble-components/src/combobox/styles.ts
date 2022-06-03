import { css } from '@microsoft/fast-element';
import {
    controlHeight,
    failColor,
    bodyDisabledFontColor,
    borderRgbPartialColor,
    smallPadding
} from '../theme-provider/design-tokens';

import { styles as dropdownStyles } from '../patterns/dropdown/styles';
import { styles as errorStyles } from '../patterns/error/styles';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    ${dropdownStyles}
    ${errorStyles}

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
        user-select: none;
        color: ${bodyDisabledFontColor};
    }

    :host .control {
        bottom-border-width: var(--ni-private-bottom-border-width);
    }

    :host(.invalid) .control {
        border-bottom: var(--ni-private-bottom-border-width) solid ${failColor};
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

    .dropdown-button {
        --ni-nimble-control-height: 24px;
        margin-left: ${smallPadding};
    }

    :host(:empty) .listbox {
        display: none;
    }
`;
