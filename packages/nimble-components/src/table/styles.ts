import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    controlSlimHeight,
    smallPadding,
    standardPadding,
    tableRowBorderColor
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('flex')}

    :host {
        height: 480px;
    }

    .disable-select {
        user-select: none;
        -webkit-user-select: none;
    }

    .table-container {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        width: 100%;
        font: ${bodyFont};
        color: ${bodyFontColor};
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
        background-color: ${tableRowBorderColor};
    }

    .header-container {
        position: sticky;
        top: 0;
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

    .column-header-container {
        display: grid;
        width: 100%;
        grid-template-columns: var(--ni-private-table-row-grid-columns) auto;
    }

    .collapse-all-button {
        height: ${controlSlimHeight};
        margin-left: calc(${smallPadding} * 2);
        visibility: hidden;
    }

    .collapse-all-button.visible {
        visibility: visible;
    }

    .header-scrollbar-spacer {
        width: var(--ni-private-table-header-scrollbar-spacer-width);
    }

    .header {
        flex: 1;
    }

    .checkbox-container {
        display: flex;
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
