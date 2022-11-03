import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

export const styles = css`
    ${display('flex')}

    :host {
        width: 600px;
        height: 600px;
        flex-direction: column;
    }
`;
