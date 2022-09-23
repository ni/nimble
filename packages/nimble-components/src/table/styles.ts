import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { tableTheme } from './table-theme';

export const styles = css`
    ${tableTheme}

    ${display('flex')}

    :host {
        width: 600px;
        height: 600px;
    }
`;
