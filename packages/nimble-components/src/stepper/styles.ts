import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';

export const styles = css`
    ${display('inline-flex')}

    :host {
        border: none;
        gap: 0px;
    }
`;
