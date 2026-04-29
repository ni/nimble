import { css } from '@ni/fast-element';
import {
    actionRgbPartialColor,
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
    iconColor,
    smallDelay,
    smallPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('inline-block')}

    :host {
        --ni-private-fv-split-button-anchor-background-image: none;
        --ni-private-fv-split-button-anchor-background-size: 100% 100%;
        --ni-private-fv-split-button-anchor-background-size-emphasis: 100% 100%;
        --ni-private-fv-split-button-anchor-border: rgba(${actionRgbPartialColor}, 0.3);
        --ni-private-fv-split-button-anchor-color: ${buttonLabelFontColor};
        position: relative;
        height: ${controlHeight};
        vertical-align: middle;
    }

    :host([appearance='ghost']) {
        --ni-private-fv-split-button-anchor-border: transparent;
    }

    :host([appearance='block']) {
        --ni-private-fv-split-button-anchor-background-image: linear-gradient(
            rgba(${borderRgbPartialColor}, 0.1),
            rgba(${borderRgbPartialColor}, 0.1)
        );
        --ni-private-fv-split-button-anchor-border: rgba(${borderRgbPartialColor}, 0.1);
        --ni-private-fv-split-button-anchor-background-size-emphasis: calc(100% - 4px) calc(100% - 4px);
    }

    :host([appearance='outline'][appearance-variant='primary']) {
        --ni-private-fv-split-button-anchor-border: rgb(${actionRgbPartialColor});
    }

    :host([appearance='outline'][appearance-variant='accent']) {
        --ni-private-fv-split-button-anchor-border: ${buttonBorderAccentOutlineColor};
        --ni-private-fv-split-button-anchor-color: ${buttonAccentOutlineFontColor};
    }

    :host([appearance='block'][appearance-variant='primary']) {
        --ni-private-fv-split-button-anchor-background-image: linear-gradient(
            ${buttonFillPrimaryColor},
            ${buttonFillPrimaryColor}
        );
        --ni-private-fv-split-button-anchor-border: ${buttonFillPrimaryColor};
        --ni-private-fv-split-button-anchor-color: ${buttonPrimaryFontColor};
    }

    :host([appearance='block'][appearance-variant='accent']) {
        --ni-private-fv-split-button-anchor-background-image: linear-gradient(
            ${buttonFillAccentColor},
            ${buttonFillAccentColor}
        );
        --ni-private-fv-split-button-anchor-border: ${buttonFillAccentColor};
        --ni-private-fv-split-button-anchor-color: ${buttonAccentBlockFontColor};
    }

    :host([disabled]) {
        --ni-private-fv-split-button-anchor-color: ${buttonLabelDisabledFontColor};
    }

    :host([disabled][appearance='outline']) {
        --ni-private-fv-split-button-anchor-border: rgba(${borderRgbPartialColor}, 0.3);
    }

    .split-button-container {
        position: relative;
        display: inline-flex;
        align-items: stretch;
        height: 100%;
    }

    .split-button-primary,
    .split-button-toggle {
        appearance: none;
        position: relative;
        z-index: 0;
        height: 100%;
        box-sizing: border-box;
        margin: 0;
        border: ${borderWidth} solid var(--ni-private-fv-split-button-anchor-border);
        background-color: transparent;
        background-image: var(--ni-private-fv-split-button-anchor-background-image);
        background-position: center;
        background-repeat: no-repeat;
        background-size: var(--ni-private-fv-split-button-anchor-background-size);
        color: var(--ni-private-fv-split-button-anchor-color);
        fill: currentcolor;
        font: ${buttonLabelFont};
        cursor: pointer;
        outline: none;
        transition:
            box-shadow ${smallDelay} ease-in-out,
            border-color ${smallDelay} ease-in-out,
            background-size ${smallDelay} ease-in-out;
    }

    .split-button-primary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 ${standardPadding};
        border-inline-end-color: transparent;
        white-space: nowrap;
        text-decoration: none;
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

    .split-button-primary:hover,
    .split-button-primary:focus-visible,
    .split-button-toggle:hover,
    .split-button-toggle:focus-visible {
        border-color: ${borderHoverColor};
        box-shadow: 0 0 0 ${borderWidth} ${borderHoverColor} inset;
        background-size: var(--ni-private-fv-split-button-anchor-background-size-emphasis);
        z-index: 1;
    }

    .split-button-primary:focus-visible::before,
    .split-button-toggle:focus-visible::before {
        outline: ${borderWidth} solid ${borderHoverColor};
    }

    .split-button-toggle {
        width: ${controlHeight};
        min-width: ${controlHeight};
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-inline-start-color: var(--ni-private-fv-split-button-anchor-border);
        margin-inline-start: calc(-1 * ${borderWidth});
    }

    .split-button-toggle > * {
        color: currentColor;
        ${iconColor.cssCustomProperty}: currentColor;
    }

    .split-button-primary-disabled {
        cursor: default;
    }

    :host([appearance='ghost']) .split-button-primary,
    :host([appearance='ghost']) .split-button-toggle {
        border-color: transparent;
        box-shadow: none;
    }

    :host([appearance='ghost']) .split-button-primary:hover,
    :host([appearance='ghost']) .split-button-primary:focus-visible,
    :host([appearance='ghost']) .split-button-toggle:hover,
    :host([appearance='ghost']) .split-button-toggle:focus-visible {
        border-color: ${borderHoverColor};
        box-shadow: 0 0 0 ${borderWidth} ${borderHoverColor} inset;
    }

    .split-button-primary:active,
    .split-button-toggle:active,
    :host([open]) .split-button-toggle {
        border-color: ${borderHoverColor};
        box-shadow: none;
        background-image: linear-gradient(${fillSelectedColor}, ${fillSelectedColor});
        background-size: calc(100% - 2px) calc(100% - 2px);
    }

    :host([appearance='block']) .split-button-primary:active,
    :host([appearance='block']) .split-button-toggle:active,
    :host([appearance='block'][open]) .split-button-toggle {
        background-size: calc(100% - 4px) calc(100% - 4px);
    }

    :host([appearance='outline'][appearance-variant='accent']) .split-button-primary:active,
    :host([appearance='outline'][appearance-variant='accent']) .split-button-toggle:active,
    :host([appearance='outline'][appearance-variant='accent'][open]) .split-button-toggle {
        color: ${buttonAccentOutlineFontColor};
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

    .split-button-menu {
        position: absolute;
        inset-block-start: calc(${controlHeight} + ${smallPadding});
        inset-inline-start: 0;
        min-width: max(100%, 112px);
        z-index: 2;
    }

    .split-button-menu[hidden] {
        display: none;
    }

    .split-button-menu ::slotted(*) {
        min-width: 100%;
        margin: 0;
    }
`;