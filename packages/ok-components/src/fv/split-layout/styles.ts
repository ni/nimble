import { css } from '@ni/fast-element';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('block')}

    :host {
        min-width: 0;
        min-height: 0;
        height: 100%;
    }

    .layout {
        display: grid;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        overflow: auto;
    }

    .pane {
        min-width: 0;
        min-height: 0;
        height: 100%;
        overflow: auto;
    }

    slot {
        display: block;
        min-width: 0;
        min-height: 0;
        height: 100%;
    }

    ::slotted([slot]) {
        box-sizing: border-box;
        min-width: 0;
        min-height: 0;
        height: 100%;
    }
`;
