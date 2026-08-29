import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    fillDownColor,
    fillSelectedColor,
    smallDelay
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('inline-block')}

        :host {
            width: 240px;
            height: 32px;
            outline: none;
            color: ${bodyFontColor};
            font: ${bodyFont};
            cursor: pointer;
            touch-action: none;
        }

        :host([orientation='vertical']) {
            width: 32px;
            height: 240px;
        }

        :host([readonly]) {
            cursor: default;
        }

        .positioning-region {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
        }

        .track {
            position: relative;
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background-color: rgba(${borderRgbPartialColor}, 0.3);
        }

        .track-start {
            position: absolute;
            inset-block: 0;
            left: 0;
            border-radius: inherit;
            background-color: ${fillSelectedColor};
        }

        .thumb-container {
            position: absolute;
            top: 50%;
            width: 16px;
            height: 16px;
            box-sizing: border-box;
            border: ${borderWidth} solid ${borderColor};
            border-radius: 50%;
            background-color: ${applicationBackgroundColor};
            transform: translate(50%, -50%);
            transition:
                border-color ${smallDelay} ease-in-out,
                box-shadow ${smallDelay} ease-in-out,
                background-color ${smallDelay} ease-in-out;
        }

        :host([orientation='vertical']) .positioning-region {
            align-items: initial;
        }

        :host([orientation='vertical']) .track {
            width: 4px;
            height: 100%;
        }

        :host([orientation='vertical']) .track-start {
            inset-block-start: 0;
            inset-inline: 0;
        }

        :host([orientation='vertical']) .thumb-container {
            top: auto;
            left: 50%;
            transform: translate(-50%, 50%);
        }

        ::slotted(*) {
            color: ${bodyFontColor};
            font: ${bodyFont};
        }
    }

    @layer hover {
        :host(:not([disabled]):not([readonly]):hover) .thumb-container {
            border-color: ${borderHoverColor};
            box-shadow: 0 0 0 ${borderWidth} ${borderHoverColor};
        }
    }

    @layer focusVisible {
        :host(:focus-visible) .thumb-container {
            border-color: ${borderHoverColor};
            box-shadow:
                0 0 0 ${borderWidth} ${applicationBackgroundColor},
                0 0 0 calc(${borderWidth} * 2) ${borderHoverColor};
        }
    }

    @layer active {
        :host(:not([disabled]):not([readonly]):active) .thumb-container {
            border-color: ${borderHoverColor};
            background-color: ${fillDownColor};
        }
    }

    @layer disabled {
        :host([disabled]) {
            color: ${bodyDisabledFontColor};
            cursor: default;
        }

        :host([disabled]) .track {
            background-color: rgba(${borderRgbPartialColor}, 0.1);
        }

        :host([disabled]) .track-start {
            background-color: rgba(${borderRgbPartialColor}, 0.2);
        }

        :host([disabled]) .thumb-container {
            border-color: rgba(${borderRgbPartialColor}, 0.2);
            background-color: ${applicationBackgroundColor};
            box-shadow: none;
        }

        :host([disabled]) ::slotted(*) {
            color: ${bodyDisabledFontColor};
        }
    }

    @layer top {}
`;
