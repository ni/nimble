import { css } from '@ni/fast-element';
import {
    actionRgbPartialColor,
    applicationBackgroundColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    buttonAccentBlockFontColor,
    buttonAccentOutlineFontColor,
    buttonBorderAccentOutlineColor,
    buttonFillAccentColor,
    buttonFillPrimaryColor,
    buttonLabelDisabledFontColor,
    buttonLabelFont,
    buttonLabelFontColor,
    buttonPrimaryFontColor,
    controlHeight,
    fillSelectedColor,
    fillSelectedRgbPartialColor,
    iconColor,
    mediumPadding,
    smallDelay,
    smallPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('inline-block')}

        :host {
            --ni-private-ok-fv-split-button-background-image: none;
            --ni-private-ok-fv-split-button-border: rgba(${actionRgbPartialColor}, 0.3);
            --ni-private-ok-fv-split-button-color: ${buttonLabelFontColor};
            position: relative;
            height: ${controlHeight};
            vertical-align: middle;
        }

        :host([appearance='ghost']) {
            --ni-private-ok-fv-split-button-border: transparent;
        }

        :host([appearance='block']) {
            --ni-private-ok-fv-split-button-background-image: linear-gradient(
                rgba(${borderRgbPartialColor}, 0.1),
                rgba(${borderRgbPartialColor}, 0.1)
            );
            --ni-private-ok-fv-split-button-border: rgba(${borderRgbPartialColor}, 0.1);
        }

        :host([appearance='outline'][appearance-variant='primary']) {
            --ni-private-ok-fv-split-button-border: rgb(${actionRgbPartialColor});
        }

        :host([appearance='outline'][appearance-variant='accent']) {
            --ni-private-ok-fv-split-button-border: ${buttonBorderAccentOutlineColor};
            --ni-private-ok-fv-split-button-color: ${buttonAccentOutlineFontColor};
        }

        :host([appearance='block'][appearance-variant='primary']) {
            --ni-private-ok-fv-split-button-background-image: linear-gradient(
                ${buttonFillPrimaryColor},
                ${buttonFillPrimaryColor}
            );
            --ni-private-ok-fv-split-button-border: ${buttonFillPrimaryColor};
            --ni-private-ok-fv-split-button-color: ${buttonPrimaryFontColor};
        }

        :host([appearance='block'][appearance-variant='accent']) {
            --ni-private-ok-fv-split-button-background-image: linear-gradient(
                ${buttonFillAccentColor},
                ${buttonFillAccentColor}
            );
            --ni-private-ok-fv-split-button-border: ${buttonFillAccentColor};
            --ni-private-ok-fv-split-button-color: ${buttonAccentBlockFontColor};
        }

        .split-button-container {
            position: relative;
            display: inline-flex;
            align-items: stretch;
            height: 100%;
        }

        .split-button-container::before {
            content: '';
            position: absolute;
            inset: 0;
            border: ${borderWidth} solid var(--ni-private-ok-fv-split-button-border);
            background-image: var(--ni-private-ok-fv-split-button-background-image);
            background-repeat: no-repeat;
            pointer-events: none;
        }

        .split-button-primary,
        .split-button-toggle {
            appearance: none;
            position: relative;
            z-index: 0;
            height: 100%;
            box-sizing: border-box;
            margin: 0;
            border: ${borderWidth} solid transparent;
            background-color: transparent;
            background-position: center;
            background-repeat: no-repeat;
            background-origin: border-box;
            background-size: 100% 100%;
            color: var(--ni-private-ok-fv-split-button-color);
            fill: currentcolor;
            font: ${buttonLabelFont};
            cursor: pointer;
            outline: none;
            transition:
                box-shadow ${smallDelay} ease-in-out,
                border-color ${smallDelay} ease-in-out,
                background-size ${smallDelay} ease-in-out;
        }

        .split-button-primary::before,
        .split-button-toggle::before {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            outline: 0px solid transparent;
            outline-offset: -3px;
            transition: outline ${smallDelay} ease-in-out;
        }

        .split-button-primary {
            padding: 0 ${standardPadding};
            padding-inline-end: ${mediumPadding};
            white-space: nowrap;
        }

        .split-button-toggle {
            width: ${controlHeight};
            min-width: ${controlHeight};
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }

        .split-button-toggle::after {
            content: '';
            position: absolute;
            inset-block: ${smallPadding};
            inset-inline-start: calc(-1 * ${borderWidth});
            width: calc(2 * ${borderWidth});
            background: rgba(${borderRgbPartialColor}, 0.1);
            pointer-events: none;
        }

        .split-button-toggle > * {
            color: currentColor;
            ${iconColor.cssCustomProperty}: currentColor;
        }

        slot[name='menu']::slotted(*) {
            min-width: 100%;
            margin: ${smallPadding} 0 0;
        }
    }

    @layer hover {
        .split-button-primary:enabled:hover,
        .split-button-toggle:enabled:hover {
            border-color: ${borderHoverColor};
            box-shadow: 0 0 0 ${borderWidth} ${borderHoverColor} inset;
            z-index: 1;
        }

        .split-button-primary:enabled:hover + .split-button-toggle::after,
        .split-button-toggle:enabled:hover::after {
            visibility: hidden;
        }
    }

    @layer focusVisible {
        .split-button-primary:enabled:focus-visible,
        .split-button-toggle:enabled:focus-visible {
            border-color: ${borderHoverColor};
            box-shadow: 0 0 0 ${borderWidth} ${borderHoverColor} inset;
            z-index: 1;
        }

        .split-button-primary:focus-visible::before,
        .split-button-toggle:focus-visible::before {
            outline: ${borderWidth} solid ${borderHoverColor};
        }

        .split-button-primary:focus-visible + .split-button-toggle::after,
        .split-button-toggle:focus-visible::after {
            visibility: hidden;
        }
    }

    @layer active {
        .split-button-primary:enabled:active,
        .split-button-toggle:enabled:active,
        :host([open]) .split-button-toggle {
            border-color: ${borderHoverColor};
            box-shadow: none;
            background-image: linear-gradient(${fillSelectedColor}, ${fillSelectedColor});
            background-size: calc(100% - 2px) calc(100% - 2px);
        }

        :host([open]) .split-button-toggle {
            border-color: rgba(${fillSelectedRgbPartialColor}, 0.3);
            background-size: 100% 100%;
        }

        :host([open]) .split-button-toggle::after {
            visibility: hidden;
        }

        :host([appearance='block']) .split-button-primary:enabled:active,
        :host([appearance='block']) .split-button-toggle:enabled:active,
        :host([appearance='block'][open]) .split-button-toggle {
            background-color: ${applicationBackgroundColor};
        }

        :host([appearance='outline'][appearance-variant='accent']) .split-button-primary:active,
        :host([appearance='outline'][appearance-variant='accent']) .split-button-toggle:active,
        :host([appearance='outline'][appearance-variant='accent'][open]) .split-button-toggle {
            color: ${buttonAccentOutlineFontColor};
        }
    }

    @layer disabled {
        :host([disabled]) {
            --ni-private-ok-fv-split-button-color: ${buttonLabelDisabledFontColor};
        }

        :host([disabled][appearance='outline']) {
            --ni-private-ok-fv-split-button-border: rgba(${borderRgbPartialColor}, 0.3);
        }

        :host([disabled]) .split-button-primary,
        :host([disabled]) .split-button-toggle {
            cursor: default;
            box-shadow: none;
        }

        :host([disabled][appearance='ghost']) .split-button-primary,
        :host([disabled][appearance='ghost']) .split-button-toggle {
            border-color: transparent;
        }
    }

    @layer top {}
`;