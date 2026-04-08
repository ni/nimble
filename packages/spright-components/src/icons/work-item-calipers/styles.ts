import { css } from '@ni/fast-element';
import { calendarEventBorderCalibrationColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { styles as iconSvgStyles } from '@ni/nimble-components/dist/esm/icon-svg/styles';

export const styles = css`
    ${iconSvgStyles}

    .icon svg {
        fill: ${calendarEventBorderCalibrationColor};
    }
`;
