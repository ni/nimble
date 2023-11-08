import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

export const styles = css`
    ${display('inline-flex')}

    nimble-listbox {
        max-height: 150px;
        overflow: auto;
    }
`;
