import { css } from '@microsoft/fast-element';
import { ZIndexLevels } from '../utilities/style/types';

export const styles = css`
    :host {
        /* Avoid using the 'display' helper to customize hidden behavior */
        display: block;
        contain: layout;
        z-index: ${ZIndexLevels.zIndex1000};
    }

    :host([hidden]) {
        visibility: hidden;
    }
`;
