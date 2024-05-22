import { css } from '@microsoft/fast-element';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('contents')}

    .header-content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
