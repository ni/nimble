import { css } from '@ni/fast-element';
import {
    controlHeight,
    bodyDisabledFontColor,
    borderRgbPartialColor,
    smallPadding,
    borderHoverColor,
    borderWidth,
    placeholderFontColor
} from '../theme-provider/design-tokens';

import { styles as dropdownStyles } from '../patterns/dropdown/styles';
import { styles as errorStyles } from '../patterns/error/styles';
import { styles as requiredVisibleStyles } from '../patterns/required-visible/styles';
import { focusVisible } from '../utilities/style/focus';
import { appearanceBehavior } from '../utilities/style/appearance';
import { DropdownAppearance } from '../select/types';

export const styles = css`
    ${dropdownStyles}
    ${errorStyles}
    ${requiredVisibleStyles}

    :host {
        --ni-private-hover-bottom-border-width: 2px;
        --ni-private-bottom-border-width: 1px;
        --ni-private-height-within-border: calc(
            ${controlHeight} - 2 * ${borderWidth}
        );
    }

    .control {
        bottom-border-width: var(--ni-private-bottom-border-width);
    }

    .control:focus-within {
        border-bottom-color: ${borderHoverColor};
    }

    .selected-value {
        -webkit-appearance: none;
        background: transparent;
        border: none;
        color: inherit;
        margin: auto 0;
        width: 100%;
        font: inherit;
        height: var(--ni-private-height-within-border);
    }

    .selected-value:hover,
    .selected-value:disabled,
    .selected-value:active,
    .selected-value${focusVisible} {
        outline: none;
    }

    .selected-value::placeholder {
        color: ${placeholderFontColor};
    }

    :host([disabled]) .selected-value::placeholder {
        color: ${bodyDisabledFontColor};
    }

    :host([disabled][appearance-readonly]) .selected-value::placeholder {
        color: ${placeholderFontColor};
    }

    [part='indicator'] {
        display: none;
    }

    .end-slot-container {
        display: flex;
        align-items: baseline;
        padding-right: ${smallPadding};
    }

    :host([disabled][appearance-readonly]) .end-slot-container {
        display: none;
    }

    .separator {
        display: inline;
        width: 2px;
        border-right: 2px solid rgba(${borderRgbPartialColor}, 0.15);
        height: calc(${controlHeight} - 12px);
        align-self: center;
        margin-left: 4px;
    }

    .dropdown-button {
        ${controlHeight.cssCustomProperty}: 24px;
        margin-left: ${smallPadding};
    }

    :host([disabled]) .dropdown-icon {
        fill: ${bodyDisabledFontColor};
    }
`.withBehaviors(
    appearanceBehavior(
        DropdownAppearance.block,
        css`
            :host([error-visible]) .control {
                border-bottom-width: ${borderWidth};
                padding-bottom: 0;
            }
        `
    )
);
