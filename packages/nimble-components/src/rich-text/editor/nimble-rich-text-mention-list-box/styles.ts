import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

export const styles = css`
    ${display('inline-flex')}

    :host {
        background: white;
        border: 1px solid black;
        max-height: 150px;
        min-width: 170px;
        overflow: auto;
    }
`;
