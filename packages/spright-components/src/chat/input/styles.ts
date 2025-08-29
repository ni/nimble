import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    borderWidth,
    controlLabelFontColor,
    elevation2BoxShadow,
    mediumPadding,
    popupBorderColor,
    borderHoverColor,
    smallDelay
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        width: 100%;
        height: auto;
        outline: none;
    }

    .container {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
        height: 100%;

        background-color: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        box-shadow: ${elevation2BoxShadow};
    }

    .container::after {
        content: '';
        position: absolute;
        bottom: calc(-1 * ${borderWidth});
        width: 0px;
        height: 0px;
        align-self: center;
        border-bottom: ${borderHoverColor} 2px solid;
        transition: width ${smallDelay} ease-in;
    }

    @media (prefers-reduced-motion) {
        :host::before {
            transition-duration: 0s;
        }
    }

    :host(:hover) .container::after {
        width: 100%;
        transition: width ${smallDelay} ease-in;
    }

    :host(:focus-within) .container::after {
        border-bottom-width: 1px;
        width: 100%;
    }

    @media (prefers-reduced-motion) {
        .container::after {
            transition-duration: 0s;
        }
    }

    textarea {
        grid-row: 1;
        grid-column: 1 / 3;

        font: ${bodyFont};
        color: ${bodyFontColor};
        background-color: transparent;

        width: 100%;
        resize: none;
        height: auto;
        max-height: calc(6lh + 2 * ${mediumPadding});
        field-sizing: content;

        border-width: 0px;
        outline: none;
        padding: ${mediumPadding};
    }

    textarea::placeholder {
        color: ${controlLabelFontColor};
    }

    .send-button {
        align-self: flex-end;
        width: 80px;
        margin: ${mediumPadding};
    }
`;
