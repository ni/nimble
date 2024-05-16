import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    ${display('flex')}

    :host {
        flex-direction: column;
        align-items: stretch;
        min-width: fit-content;
        font-size: 0;
    }
    :host(${focusVisible}) {
        outline: none;
    }
`;
