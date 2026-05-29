import { css } from '@ni/fast-element';
import { calendarEventBorderReservationColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { styles as iconSvgStyles } from '@ni/nimble-components/dist/esm/icon-svg/styles';

export const styles = css`
    ${iconSvgStyles}

    .icon svg {
        fill: ${calendarEventBorderReservationColor};
    }
`;
