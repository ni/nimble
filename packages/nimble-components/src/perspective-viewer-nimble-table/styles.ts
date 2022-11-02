import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

export const styles = css`
    ${display('flex')}

    :host {
        width: 100%;
        height: auto;
    }

    .table-viewport {
        overflow-y: scroll;
        display: block;
        height: 100%;
        width: inherit;
      }
    
    .table-body {
        width: 100%;
        position: relative;
    }
`;
