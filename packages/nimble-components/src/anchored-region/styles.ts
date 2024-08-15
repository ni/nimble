import { css } from '@microsoft/fast-element';
import { ZIndexLevels } from '../utilities/style/types';
import { display } from '../utilities/style/display';

export const styles = css`
    ${display('block')}

    :host {
        contain: layout;
        z-index: ${ZIndexLevels.zIndex1000};
    }

    ${'' /* Override 'display' helper hidden behavior */}
    :host([hidden]) {
        display: block;
        visibility: hidden;
    }
`;
