import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

export const styles = css`
    ${display('contents')}

    .header-content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    slot[name='mapping'] {
        display: none;
    }
`;
