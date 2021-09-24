import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    :host([hidden]) {
        display: none;
    }
    ${display('flex')} :host {
        flex-direction: column;
        align-items: stretch;
        min-width: fit-content;
        font-size: 0;
    }
    :host(${focusVisible}) {
        outline: none;
    }
`;
