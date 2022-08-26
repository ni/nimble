import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    Black15,
    Black7,
    Black91,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    borderHoverColor,
    borderWidth,
    buttonLabelDisabledFontColor,
    buttonLabelFont,
    buttonLabelFontColor,
    controlHeight,
    controlLabelDisabledFontColor,
    controlLabelFont,
    controlLabelFontColor,
    fillHoverColor,
    smallDelay
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { focusVisible } from '../utilities/style/focus';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('inline-flex')}

    :host {
        outline: none;
        font: ${buttonLabelFont};
        color: ${buttonLabelFontColor};
        flex-direction: column;
        cursor: pointer;
        --ni-private-switch-height: 24px;
        --ni-private-switch-indicator-size: 16px;
        padding-bottom: calc(
            ${controlHeight} - var(--ni-private-switch-height)
        );
    }

    :host([disabled]) {
        cursor: default;
        color: ${buttonLabelDisabledFontColor};
    }

    .label {
        color: ${controlLabelFontColor};
        font: ${controlLabelFont};
    }

    :host([disabled]) .label {
        color: ${controlLabelDisabledFontColor};
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .switch-container {
        display: flex;
        align-items: center;
    }

    slot[name='unchecked-message']::slotted(*) {
        margin-inline-end: 8px;
    }

    .switch {
        display: flex;
        height: var(--ni-private-switch-height);
        width: calc(var(--ni-private-switch-height) * 2);
        box-sizing: border-box;
        background-color: ${fillHoverColor};
        border-radius: calc(var(--ni-private-switch-height) / 2);
        align-items: center;
        border: calc(${borderWidth} * 2) solid transparent;
    }

    :host([disabled]) .switch {
        background-color: var(--ni-private-switch-background-disabled-color);
    }

    :host(${focusVisible}) .switch {
        border-color: ${borderHoverColor};
    }

    .checked-indicator-spacer {
        flex-grow: 0;
        transition: flex-grow ${smallDelay} ease-in-out;
    }

    :host([aria-checked='true']) .checked-indicator-spacer {
        flex-grow: 1;
        transition: flex-grow ${smallDelay} ease-in-out;
    }

    .checked-indicator {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--ni-private-switch-indicator-background-color);
        box-sizing: border-box;
        width: var(--ni-private-switch-indicator-size);
        height: var(--ni-private-switch-indicator-size);
        border-radius: calc(var(--ni-private-switch-indicator-size) / 2);
        margin: calc(
            calc(
                    var(--ni-private-switch-height) -
                        var(--ni-private-switch-indicator-size)
                ) / 2
        );
        border: ${borderWidth} solid
            var(--ni-private-switch-indicator-border-color);
    }

    :host(:hover) .checked-indicator {
        border: calc(${borderWidth} * 2) solid ${borderHoverColor};
    }

    :host([disabled]) .checked-indicator {
        background-color: var(
            --ni-private-switch-indicator-background-disabled-color
        );
        border: ${borderWidth} solid
            var(--ni-private-switch-indicator-border-disabled-color);
    }

    :host(${focusVisible}) .checked-indicator {
        border: ${borderWidth} solid ${borderHoverColor};
    }

    .checked-indicator-inner {
        width: calc(var(--ni-private-switch-indicator-size) / 2);
        height: calc(var(--ni-private-switch-indicator-size) / 2);
        border-radius: calc(var(--ni-private-switch-indicator-size) / 4);
        background-color: var(--ni-private-switch-indicator-border-color);
        opacity: 0;
        transition: opacity ${smallDelay} ease-in-out;
    }

    :host([disabled]) .checked-indicator-inner {
        background-color: var(
            --ni-private-switch-indicator-border-disabled-color
        );
    }

    :host([aria-checked='true']) .checked-indicator-inner {
        opacity: 1;
        transition: opacity ${smallDelay} ease-in-out;
    }

    slot[name='checked-message']::slotted(*) {
        margin-inline-start: 8px;
    }

    @media (prefers-reduced-motion) {
        .checked-indicator-inner,
        .checked-indicator-spacer {
            transition-duration: 0s;
        }
    }
`.withBehaviors(
        themeBehavior(
            Theme.light,
            css`
            :host {
                --ni-private-switch-background-disabled-color: ${hexToRgbaCssColor(
                Black91,
                0.07
            )};
                --ni-private-switch-indicator-background-color: ${White};
                --ni-private-switch-indicator-background-disabled-color: ${hexToRgbaCssColor(
                White,
                0.1
            )};
                --ni-private-switch-indicator-border-color: ${Black91};
                --ni-private-switch-indicator-border-disabled-color: ${hexToRgbaCssColor(
                Black91,
                0.3
            )};
            }
        `
        ),
        themeBehavior(
            Theme.dark,
            css`
            :host {
                --ni-private-switch-background-disabled-color: ${hexToRgbaCssColor(
                Black15,
                0.07
            )};
                --ni-private-switch-indicator-background-color: ${hexToRgbaCssColor(
                Black91,
                0.3
            )};
                --ni-private-switch-indicator-background-disabled-color: ${hexToRgbaCssColor(
                Black91,
                0.1
            )};
                --ni-private-switch-indicator-border-color: ${Black7};
                --ni-private-switch-indicator-border-disabled-color: ${hexToRgbaCssColor(
                Black7,
                0.3
            )};
            }
        `
        ),
        themeBehavior(
            Theme.color,
            css`
            :host {
                --ni-private-switch-background-disabled-color: ${hexToRgbaCssColor(
                White,
                0.07
            )};
                --ni-private-switch-indicator-background-color: ${hexToRgbaCssColor(
                White,
                0.1
            )};
                --ni-private-switch-indicator-background-disabled-color: ${hexToRgbaCssColor(
                White,
                0.1
            )};
                --ni-private-switch-indicator-border-color: ${White};
                --ni-private-switch-indicator-border-disabled-color: ${hexToRgbaCssColor(
                White,
                0.3
            )};
            }
        `
        )
    );
