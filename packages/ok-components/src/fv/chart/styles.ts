import { css } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    borderWidth,
    elevation2BoxShadow,
    fillHoverColor,
    mediumPadding,
    popupBorderColor,
    smallPadding,
    tooltipBackgroundColor,
    tooltipCaptionFont,
    tooltipCaptionFontColor,
    tooltipCaptionFontWeight
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('block')}

        :host {
            min-width: 0;
            font: ${bodyFont};
            color: ${bodyFontColor};
        }

        [part='chart'] {
            width: 100%;
            height: 100%;
            min-width: 0;
        }

        .tooltip {
            padding: ${smallPadding} ${mediumPadding} calc(${smallPadding} * 1.5);
            border: ${borderWidth} solid ${popupBorderColor};
            background: ${tooltipBackgroundColor};
            color: ${tooltipCaptionFontColor};
            font: ${tooltipCaptionFont};
            box-shadow: ${elevation2BoxShadow};
        }

        .tooltip-title {
            display: flex;
            align-items: center;
            gap: ${smallPadding};
            font-weight: ${tooltipCaptionFontWeight};
        }

        .tooltip-title:not(:last-child) {
            margin-bottom: ${smallPadding};
        }

        .tooltip-row {
            display: grid;
            grid-template-columns: ${mediumPadding} minmax(0, 1fr) auto;
            align-items: center;
            column-gap: ${mediumPadding};
        }

        .tooltip-row[data-active] {
            background: ${fillHoverColor};
        }

        .tooltip-value {
            text-align: right;
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
        }

        .tooltip-swatch {
            display: block;
            width: ${mediumPadding};
            height: ${mediumPadding};
        }
    }
`;
