import { css } from '@ni/fast-element';
import { calendarEventBorderStatic3Color, iconSize } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';
import { userSelectNone } from '../../utilities/style/user-select';

export const styles = css`
    ${display('inline-flex')}

    :host {
        align-items: center;
        ${userSelectNone}
        width: ${iconSize};
        height: ${iconSize};
    }

    .icon {
        display: contents;
    }

    .icon svg {
        display: inline-flex;
        fill: ${calendarEventBorderStatic3Color};
        width: 100%;
        height: 100%;
    }
`;
