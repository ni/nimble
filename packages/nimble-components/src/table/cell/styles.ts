import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

export const styles = css`
    ${display('flex')}

    :host {
        padding: 0px 8px;
        align-items: center;
    }
`;
