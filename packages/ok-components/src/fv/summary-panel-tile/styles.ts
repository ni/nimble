import { css } from '@ni/fast-element';
import {
    bodyFont,
    borderHoverColor,
    cardBorderColor,
    elevation2BoxShadow,
    largePadding,
    mediumPadding,
    smallPadding,
    smallDelay,
    standardPadding,
    titlePlus2FontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('inline-block')}

    :host {
        min-width: max-content;
    }

    :host(:not([legacy-style])) .summary-panel-tile {
        position: relative;
        border-radius: 8px;
        overflow: clip;
        box-shadow: none;
        transition: box-shadow ${smallDelay} ease-in-out;
        --ni-private-card-button-background-hover-color: transparent;
        --ni-private-card-button-background-active-color: transparent;
        --ni-private-card-button-border-active-color: ${borderHoverColor};
    }

    :host(:not([legacy-style])) .summary-panel-tile:hover {
        box-shadow: 0 0 0 2px ${borderHoverColor};
    }

    :host(:not([legacy-style])) .summary-panel-tile:active {
        box-shadow: none;
    }

    :host(:not([legacy-style])) .summary-panel-tile[selected] {
        box-shadow: var(${elevation2BoxShadow.cssCustomProperty});
    }

    :host(:not([legacy-style])) .summary-panel-tile[selected]:hover {
        box-shadow:
            var(${elevation2BoxShadow.cssCustomProperty}),
            0 0 0 2px ${borderHoverColor};
    }

    :host(:not([legacy-style])) .summary-panel-tile[selected]:active {
        box-shadow: var(${elevation2BoxShadow.cssCustomProperty});
    }

    :host(:not([legacy-style])) .summary-panel-tile::after {
        content: '';
        position: absolute;
        inset: 0;
        box-sizing: border-box;
        border: 2px solid transparent;
        border-radius: inherit;
        pointer-events: none;
        transition: border-color ${smallDelay} ease-in-out;
    }

    :host(:not([legacy-style])) .summary-panel-tile:active::after {
        border-color: ${borderHoverColor};
    }

    :host(:not([legacy-style])) .summary-panel-tile::part(control) {
        border: 2px solid ${cardBorderColor};
        border-radius: 8px;
        transition:
            border-color ${smallDelay} ease-in-out,
            border-width ${smallDelay} ease-in-out;
    }

    :host(:not([legacy-style])) .summary-panel-tile::part(control):hover {
        border-color: transparent;
    }

    :host(:not([legacy-style])) .summary-panel-tile::part(control):active {
        border: 2px solid transparent;
    }

    :host(:not([legacy-style])) .summary-panel-tile[selected]::part(control) {
        border: 2px solid ${borderHoverColor};
    }

    :host(:not([legacy-style])) .summary-panel-tile[selected]::part(control):hover {
        border: 2px solid transparent;
    }

    :host(:not([legacy-style])) .summary-panel-tile[selected]::part(control):active {
        border: 2px solid transparent;
    }

    .summary-panel-tile-content {
        display: flex;
        align-items: center;
        gap: ${mediumPadding};
        margin: ${largePadding} calc(${largePadding} + ${standardPadding});
        font: ${bodyFont};
    }

    .summary-panel-tile-content.under {
        flex-direction: column;
        align-items: center;
        gap: ${smallPadding};
        text-align: center;
    }

    .count {
        color: ${titlePlus2FontColor};
        font-size: 32px;
        font-weight: 400;
        line-height: 40px;
        white-space: nowrap;
    }

    .summary-panel-tile-content.beside .count {
        padding-right: ${mediumPadding};
    }

    .summary-panel-tile-content.under .count {
        padding-right: 0;
    }

    .label {
        font-weight: 600;
        text-transform: uppercase;
        white-space: nowrap;
    }
`;