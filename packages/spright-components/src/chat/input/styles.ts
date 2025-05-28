import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    controlLabelFontColor,
    elevation2BoxShadow,
    mediumPadding,
    popupBorderColor,
    smallDelay
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';
import { focusVisible } from '../../utilities/style/focus';

export const styles = css`
    ${display('flex')}

    :host {
        width: 100%;
        height: auto;
    }

    .container {
        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: 1fr auto;
        width: 100%;
        height: 100%;

        background-color: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        box-shadow: ${elevation2BoxShadow};
    }

    .container:focus-within {
        border-bottom-color: ${borderHoverColor};
    }

    .container::after {
        content: ' ';
        position: absolute;
        bottom: calc(-1 * ${borderWidth});
        width: 0px;
        height: 0px;
        border-bottom: ${borderHoverColor} var(--ni-private-hover-indicator-width) solid;
        transition: width ${smallDelay} ease-in;
    }

    @media (prefers-reduced-motion) {
        .container::after {
            transition-duration: 0s;
        }
    }

    :host(:hover) .container::after,
    :host(${focusVisible}) .container::after {
        width: 100%;
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
        grid-row: 2;
        grid-column: 2;
        width: 80px;
        margin: ${mediumPadding};
    }
`;
