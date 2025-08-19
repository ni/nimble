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
        --ni-private-hover-indicator-width: calc(${borderWidth} + 1px);
        --ni-private-focus-indicator-width: 1px;
        --ni-private-indicator-lines-gap: 2px;
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

    .container::before {
        content: '';
        position: absolute;
        bottom: calc(${borderWidth} + var(--ni-private-indicator-lines-gap));
        width: 0px;
        height: 0px;
        align-self: center;
        border-bottom: ${borderHoverColor}
            var(--ni-private-focus-indicator-width) solid;
        transition: width ${smallDelay} ease-in;
    }

    @media (prefers-reduced-motion) {
        :host::before {
            transition-duration: 0s;
        }
    }

    :host(:focus-within) .container::before {
        width: calc(100% - 8px);
    }

    .container::after {
        content: '';
        position: relative;
        bottom: calc(-1 * ${borderWidth});
        width: 0px;
        height: 0px;
        align-self: center;
        border-bottom: ${borderHoverColor}
            var(--ni-private-hover-indicator-width) solid;
        transition: width ${smallDelay} ease-in;
    }

    :host(:hover) .container::after,
    :host(:focus-within) .container::after {
        width: 100%;
    }

    @media (prefers-reduced-motion) {
        :host::after {
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
