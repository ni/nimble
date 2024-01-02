import { css } from '@microsoft/fast-element';
import { ZIndexLevels } from '../utilities/style/types';

export const styles = css`
    :host {
        contain: layout;
        display: block;
        z-index: ${ZIndexLevels.higher};
    }
`;
