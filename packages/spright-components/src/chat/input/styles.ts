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
    smallDelay,
    failColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { styles as errorStyles } from '@ni/nimble-components/dist/esm/patterns/error/styles';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}
    ${errorStyles}

    :host {
        width: 100%;
        height: auto;
        outline: none;
        --ni-private-hover-indicator-width: calc(${borderWidth} + 1px);
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
        border-bottom: ${borderHoverColor}
            var(--ni-private-hover-indicator-width) solid;
        transition: width ${smallDelay} ease-in;
    }

    :host(:hover) .container::after {
        width: 100%;
        transition: width ${smallDelay} ease-in;
    }

    :host(:focus-within) .container {
        border-bottom-color: ${borderHoverColor};
    }

    :host([error-visible]) .container::after {
        border-bottom-color: ${failColor};
    }
        
    :host([error-visible]) .container {
        border-bottom-color: ${failColor};
    }

    :host([error-visible]:hover) .container::after {
        border-bottom-color: ${failColor};
    }

    :host([error-visible]:focus-within) .container {
        border-bottom-color: ${failColor};
    }

    @media (prefers-reduced-motion) {
        .container::after {
            transition-duration: 0s;
        }
    }

    textarea {
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

    :host([error-visible]) .error-icon {
        display: none;
    }

    :host([error-visible]) .error-icon.scrollbar-width-calculated {
        display: inline-flex;
        position: absolute;
        top: ${mediumPadding};
        right: var(--ni-private-scrollbar-width);
    }

    .action-button {
        align-self: flex-end;
        width: 80px;
        margin: ${mediumPadding};
    }
`;
