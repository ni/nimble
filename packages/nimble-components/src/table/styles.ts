import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { regularTableTheme, tableTheme } from './table-theme';

export const styles = css`
    ${tableTheme}
    ${regularTableTheme}
    ${display('flex')}

    :host {
        width: 100%;
        height: 600px;
    }

    perspective-viewer {
        flex: 1;
    }

    :host #settings_button {
        display: none;
    }
`;
