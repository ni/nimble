import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { ZIndexLevels } from '../utilities/style/types';

export const styles = css`
    ${display('block')}:host {
        contain: layout;
        z-index: ${ZIndexLevels.zIndex1000};
    }
`;
