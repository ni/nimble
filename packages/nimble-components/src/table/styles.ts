import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    popupBorderColor,
    controlSlimHeight,
    fillHoverColor,
    fillHoverSelectedColor,
    fillSelectedColor
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('flex')}

    :host {
        height: 480px;
    }

    .table-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        width: 100%;
        font: ${bodyFont};
        color: ${bodyFontColor};
        cursor: var(--ni-private-table-cursor-override);
    }

    .table-viewport {
        overflow: auto;
        display: block;
        height: 100%;
        position: relative;
    }

    .table-scroll {
        pointer-events: none;
        position: absolute;
        top: 0px;
        width: 100%;
        height: var(--ni-private-table-scroll-height);
    }

    .table-row-container {
        width: 100%;
        position: relative;
        top: var(--ni-private-table-row-container-top);
    }

    .header-row-container {
        position: sticky;
        top: 0;
    }

    .header-row {
        display: grid;
        background: ${applicationBackgroundColor};
        position: relative;
        width: fit-content;
        min-width: 100%;
        grid-template-columns: var(--ni-private-table-row-grid-columns) auto;
        left: var(--ni-private-table-scroll-x);
    }

    .header-container {
        display: flex;
        align-items: center;
        position: relative;
    }

    .header-scrollbar-spacer {
        width: var(--ni-private-table-header-scrollbar-spacer-width);
    }

    .header {
        flex: 1;
        overflow: hidden;
    }

    .column-divider {
        border-left: 2px solid ${popupBorderColor};
        display: none;
        height: ${controlSlimHeight};
        cursor: col-resize;
        position: absolute;
    }

    .column-divider[active] {
        display: block;
        z-index: 1;
    }

    .left { 
        left: -1px;
    }

    .right { 
        left: calc(100% - 1px);
    }

    .header-container:hover .column-divider:not([not-active]).left,
    .header-container:hover .column-divider:not([not-active]).right {
        display: block;
        z-index: 1;
    }

    .column-divider.left-limit {
        cursor: e-resize;
    }

    .column-divider.right-limit {
        cursor: w-resize;
    }

    .row {
        background: ${applicationBackgroundColor};
        position: relative;
        box-sizing: border-box;
    }

    .row::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        pointer-events: none;
    }

    :host([selection-mode='single']) .row:hover::before {
        background: ${fillHoverColor};
    }

    :host([selection-mode='single']) .row[selected]::before {
        background: ${fillSelectedColor};
    }

    :host([selection-mode='single']) .row[selected]:hover::before {
        background: ${fillHoverSelectedColor};
    }
`.withBehaviors(
    themeBehavior(
        Theme.color,
        css`
            .header-row::before {
                content: '';
                width: 100%;
                height: 100%;
                position: absolute;
                background: ${fillHoverColor};
                pointer-events: none;
            }

            .row::before {
                background: ${fillHoverColor};
            }

            :host([selection-mode='single']) .row:hover::before {
                background: ${hexToRgbaCssColor(White, 0.15)};
            }

            :host([selection-mode='single']) .row[selected]::before {
                background: ${hexToRgbaCssColor(White, 0.25)};
            }

            :host([selection-mode='single']) .row[selected]:hover::before {
                background: ${hexToRgbaCssColor(White, 0.2)};
            }
        `
    )
);
