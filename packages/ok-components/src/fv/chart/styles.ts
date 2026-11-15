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
            --ts-chart-tooltip-background: ${tooltipBackgroundColor};
            --ts-chart-tooltip-color: ${tooltipCaptionFontColor};
            --ts-chart-tooltip-font: ${tooltipCaptionFont};
            --ts-chart-tooltip-border: ${borderWidth} solid ${popupBorderColor};
            --ts-chart-tooltip-border-radius: 0;
            --ts-chart-tooltip-padding: ${smallPadding} ${mediumPadding} calc(${smallPadding} * 1.5);
            --ts-chart-tooltip-shadow: ${elevation2BoxShadow};
            --ts-chart-tooltip-active-row-font-weight: ${tooltipCaptionFontWeight};
            --ts-chart-tooltip-active-row-background: ${fillHoverColor};
            --ts-chart-tooltip-active-row-border-radius: 0;
            --ts-chart-tooltip-active-row-shadow: none;
        }

        [part='chart'] {
            width: 100%;
            height: 100%;
            min-width: 0;
        }

        ${/* TanStack sets these details inline without custom properties. */ ''}
        .ts-chart-tooltip__title {
            font-weight: ${tooltipCaptionFontWeight} !important;
            gap: ${smallPadding} !important;
            margin-bottom: ${smallPadding} !important;
        }

        .ts-chart-tooltip__row {
            column-gap: ${mediumPadding} !important;
        }

        .ts-chart-tooltip__swatch {
            width: ${mediumPadding} !important;
            height: ${mediumPadding} !important;
            border-radius: 0 !important;
            box-shadow: none !important;
        }
    }
`;
