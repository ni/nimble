import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { regularTableTheme, tableTheme } from './table-theme';

export const styles = css`
    ${tableTheme}
    ${regularTableTheme}
    ${display('flex')}

    :host {
        width: 600px;
        height: 600px;
    }
`;
