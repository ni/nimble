import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';

export const styles = css`
    ${display('contents')}

    :host {
        color-scheme: light;
    }

    :host([theme='dark']) {
        color-scheme: dark;
    }
`;
