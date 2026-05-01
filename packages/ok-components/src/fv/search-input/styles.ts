import { css } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    controlHeight,
    fillHoverColor,
    iconColor,
    iconSize,
    mediumPadding,
    placeholderFontColor,
    smallPadding,
    smallDelay,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('inline-block')}

        :host {
            --ni-private-fv-search-input-inline-padding: ${standardPadding};
            --ni-private-fv-search-input-leading-inset: ${mediumPadding};
            --ni-private-fv-search-input-leading-space: calc(var(--ni-private-fv-search-input-leading-inset) + ${iconSize} + ${smallPadding});
            --ni-private-fv-search-input-trailing-space: calc(var(--ni-private-fv-search-input-inline-padding) + ${iconSize});
            --ni-private-fv-search-input-border-color: rgba(${borderRgbPartialColor}, 0.3);
            --ni-private-fv-search-input-border-radius: 0px;
            min-width: 120px;
            height: ${controlHeight};
            font: ${bodyFont};
            color: ${bodyFontColor};
        }

        .search-input-container {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
            border: ${borderWidth} solid transparent;
            border-radius: var(--ni-private-fv-search-input-border-radius);
            color: inherit;
            background-color: transparent;
            transition:
                border-color ${smallDelay} ease-in-out,
                box-shadow ${smallDelay} ease-in-out,
                background-color ${smallDelay} ease-in-out;
        }

        .search-input-container::after {
            content: '';
            position: absolute;
            inset-inline: 0;
            inset-block-end: calc(-1 * ${borderWidth});
            border-bottom: calc(${borderWidth} + 1px) solid ${borderHoverColor};
            transform: scaleX(0);
            transform-origin: center;
            transition:
                transform ${smallDelay} ease-in-out,
                border-bottom-color ${smallDelay} ease-in-out;
            pointer-events: none;
        }

        .search-input-icon {
            position: absolute;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            top: 50%;
            inset-inline-start: var(--ni-private-fv-search-input-leading-inset);
            transform: translateY(-50%);
            color: ${placeholderFontColor};
            pointer-events: none;
            ${iconColor.cssCustomProperty}: ${placeholderFontColor};
        }

        .search-input {
            -webkit-appearance: none;
            appearance: none;
            display: block;
            flex: 1 1 auto;
            min-width: 0;
            width: 100%;
            height: 100%;
            padding: 0 var(--ni-private-fv-search-input-trailing-space) 0 var(--ni-private-fv-search-input-leading-space);
            font: inherit;
            line-height: normal;
            color: inherit;
            border: none;
            outline: none;
            border-radius: 0;
            background: transparent;
        }

        .search-input::placeholder {
            color: ${placeholderFontColor};
        }

        .search-input-clear {
            -webkit-appearance: none;
            appearance: none;
            position: absolute;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            top: 50%;
            inset-inline-end: 2px;
            height: calc(100% - 6px);
            aspect-ratio: 1;
            padding: 0;
            transform: translateY(-50%);
            color: ${placeholderFontColor};
            border: none;
            border-radius: 2px;
            background: transparent;
            cursor: pointer;
            ${iconColor.cssCustomProperty}: ${placeholderFontColor};
        }

        :host([appearance='outline']) .search-input-container {
            border-color: var(--ni-private-fv-search-input-border-color);
        }

        :host([appearance='block']) .search-input-container {
            background-color: rgba(${borderRgbPartialColor}, 0.1);
        }

        :host([appearance='underline']) .search-input-container::after {
            transform: scaleX(1);
            border-bottom-color: var(--ni-private-fv-search-input-border-color);
        }
    }

    @layer hover {
        .search-input-clear:hover {
            background: ${fillHoverColor};
        }

        :host([appearance='outline']) .search-input-container:hover {
            border-color: ${borderHoverColor};
            box-shadow: 0 0 0 ${borderWidth} ${borderHoverColor} inset;
        }

        :host([appearance='block']) .search-input-container:hover::after {
            transform: scaleX(1);
            border-bottom-color: ${borderHoverColor};
        }

        :host([appearance='underline']) .search-input-container:hover::after {
            border-bottom-color: ${borderHoverColor};
        }

        :host([appearance='frameless']) .search-input-container:hover::after {
            transform: scaleX(1);
            border-bottom-color: ${borderHoverColor};
        }
    }

    @layer focusVisible {
        .search-input:focus-visible {
            outline: none;
        }

        .search-input-clear:focus-visible {
            outline: ${borderWidth} solid ${borderHoverColor};
            outline-offset: -1px;
        }

        :host([appearance='outline']) .search-input-container:focus-within {
            border-color: ${borderHoverColor};
            box-shadow: 0 0 0 ${borderWidth} ${borderHoverColor} inset;
        }

        :host([appearance='block']) .search-input-container:focus-within::after {
            transform: scaleX(1);
            border-bottom-color: ${borderHoverColor};
        }

        :host([appearance='underline']) .search-input-container:focus-within::after {
            border-bottom-color: ${borderHoverColor};
        }

        :host([appearance='frameless']) .search-input-container:focus-within::after {
            transform: scaleX(1);
            border-bottom-color: ${borderHoverColor};
        }
    }
`;