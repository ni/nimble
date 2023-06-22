import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    popupBorderColor,
    controlSlimHeight,
    smallPadding,
    standardPadding,
    tableRowBorderColor
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';
import { userSelectNone } from '../utilities/style/user-select';

export const styles = css`
    ${display('flex')}

    :host {
        height: 480px;
    }

    .disable-select {
        ${userSelectNone}
    }

    .table-container {
        overflow: auto;
        display: flex;
        flex-direction: column;
        width: 100%;
        font: ${bodyFont};
        color: ${bodyFontColor};
        cursor: var(--ni-private-table-cursor-override);
    }

    .header-row-container {
        position: sticky;
        top: 0;
        width: var(--ni-private-table-total-width);
        min-width: var(--ni-private-table-header-row-min-width);
    }

    .header-row {
        display: flex;
        background: ${applicationBackgroundColor};
        position: relative;
        width: fit-content;
        min-width: 100%;
        left: var(--ni-private-table-scroll-x);
        align-items: center;
    }

    .header-row-action-container {
        display: flex;
    }

    .checkbox-container {
        display: flex;
    }

    .column-headers-container {
        display: grid;
        width: 100%;
        grid-template-columns: var(--ni-private-table-row-grid-columns) auto;
    }

    .table-row-container {
        width: fit-content;
        min-width: 100%;
        position: relative;
        top: var(--ni-private-table-row-container-top);
        background-color: ${tableRowBorderColor};
    }

    .collapse-all-button {
        height: ${controlSlimHeight};
        margin-left: calc(${smallPadding} * 2);
        visibility: hidden;
    }

    .collapse-all-button.visible {
        visibility: visible;
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

    .table-sizer {
        border-left: 2px solid ${popupBorderColor};
        height: 4px;
        width: 4px;
    }

    .table-sizer::before {
        content: '';
        border-left: 2px solid ${popupBorderColor};
        height: 4px;
        margin-left: 2px;
        display: block;
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

    .table-viewport {
        overflow-y: auto;
        display: block;
        height: 100%;
        position: relative;
        width: var(--ni-private-table-total-width);
        min-width: var(--ni-private-table-viewport-min-width);
        overflow-x: hidden;
    }

    .table-scroll {
        pointer-events: none;
        position: absolute;
        top: 0px;
        width: 100%;
        height: var(--ni-private-table-scroll-height);
    }

    .table-row-container {
        width: fit-content;
        min-width: 100%;
        position: relative;
        top: var(--ni-private-table-row-container-top);
        background-color: ${tableRowBorderColor};
    }

    .selection-checkbox {
        margin-left: ${standardPadding};
    }

    .selection-checkbox::part(label) {
        padding-left: 0px;
    }

    .group-row {
        position: relative;
    }

    .row {
        position: relative;
    }
`.withBehaviors(
    themeBehavior(
        Theme.color,
        css`
            .table-row-container::before {
                content: '';
                width: 100%;
                height: 100%;
                background-color: ${hexToRgbaCssColor(White, 0.1)};
                position: absolute;
            }
        `
    )
);
