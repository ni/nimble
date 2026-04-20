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
import { display } from '../utilities/style/display';

export const styles = css`
    ${display('inline-block')}

    :host {
        --ok-search-input-height: ${controlHeight};
        --ok-search-input-inline-padding: ${standardPadding};
        --ok-search-input-leading-inset: ${mediumPadding};
        --ok-search-input-leading-space: calc(var(--ok-search-input-leading-inset) + ${iconSize} + ${smallPadding});
        --ok-search-input-trailing-space: calc(var(--ok-search-input-inline-padding) + ${iconSize});
        --ok-search-input-border-color: rgba(${borderRgbPartialColor}, 0.3);
        --ok-search-input-border-radius: 0px;
        min-width: 120px;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .search-input-container {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        height: var(--ok-search-input-height);
        box-sizing: border-box;
        border: ${borderWidth} solid transparent;
        border-radius: var(--ok-search-input-border-radius);
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
        transition: transform ${smallDelay} ease-in-out;
        pointer-events: none;
    }

    .search-input {
        -webkit-appearance: none;
        appearance: none;
        display: block;
        flex: 1 1 auto;
        min-width: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 0 var(--ok-search-input-trailing-space) 0 var(--ok-search-input-leading-space);
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

    .search-input-icon,
    .search-input-clear {
        position: absolute;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        top: 50%;
        transform: translateY(-50%);
        color: ${placeholderFontColor};
        ${iconColor.cssCustomProperty}: ${placeholderFontColor};
    }

    .search-input-icon {
        inset-inline-start: var(--ok-search-input-leading-inset);
        pointer-events: none;
    }

    .search-input-clear {
        -webkit-appearance: none;
        appearance: none;
        inset-inline-end: 2px;
        width: calc(var(--ok-search-input-height) - 6px);
        height: calc(var(--ok-search-input-height) - 6px);
        padding: 0;
        border: none;
        border-radius: 2px;
        background: transparent;
        cursor: pointer;
    }

    .search-input-clear:hover {
        background: ${fillHoverColor};
    }

    .search-input-clear:focus-visible {
        outline: ${borderWidth} solid ${borderHoverColor};
        outline-offset: -1px;
    }

    .search-input:focus-visible {
        outline: none;
    }

    :host([appearance='outline']) .search-input-container {
        border-color: var(--ok-search-input-border-color);
    }

    :host([appearance='outline']) .search-input-container:hover,
    :host([appearance='outline']) .search-input-container:focus-within {
        border-color: ${borderHoverColor};
        box-shadow: 0 0 0 ${borderWidth} ${borderHoverColor} inset;
    }

    :host([appearance='block']) .search-input-container {
        background-color: rgba(${borderRgbPartialColor}, 0.1);
    }

    :host([appearance='block']) .search-input-container:hover::after,
    :host([appearance='block']) .search-input-container:focus-within::after,
    :host([appearance='underline']) .search-input-container::after,
    :host([appearance='frameless']) .search-input-container:hover::after,
    :host([appearance='frameless']) .search-input-container:focus-within::after {
        transform: scaleX(1);
    }

    :host([appearance='underline']) .search-input-container::after {
        border-bottom-color: var(--ok-search-input-border-color);
    }

    :host([appearance='underline']) .search-input-container:hover::after,
    :host([appearance='underline']) .search-input-container:focus-within::after,
    :host([appearance='frameless']) .search-input-container:hover::after,
    :host([appearance='frameless']) .search-input-container:focus-within::after,
    :host([appearance='block']) .search-input-container:hover::after,
    :host([appearance='block']) .search-input-container:focus-within::after {
        border-bottom-color: ${borderHoverColor};
    }
`;