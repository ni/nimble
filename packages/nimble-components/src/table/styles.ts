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
        --ni-private-column-divider-width: 2px;
        --ni-private-column-divider-padding: 3px;
    }

    .disable-select {
        ${userSelectNone}
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

    .glass-overlay {
        width: 100%;
        height: 100%;
        display: contents;
        pointer-events: var(--ni-private-glass-overlay-pointer-events);
    }

    .header-row-container {
        position: sticky;
        top: 0;
    }

    .header-row {
        display: flex;
        background: ${applicationBackgroundColor};
        position: relative;
        width: fit-content;
        min-width: max(
            100%,
            calc(
                var(--ni-private-table-scrollable-min-width) +
                    var(--ni-private-table-header-container-margin-right)
            )
        );
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
        width: var(--ni-private-table-header-container-margin-right);
    }

    .header {
        flex: 1;
        overflow: hidden;
    }

    .column-divider {
        border-left: var(--ni-private-column-divider-width) solid
            ${popupBorderColor};
        display: none;
        height: ${controlSlimHeight};
        cursor: col-resize;
        position: absolute;
    }

    .column-divider::before {
        content: '';
        position: absolute;
        width: calc(
            var(--ni-private-column-divider-width) +
                (2 * var(--ni-private-column-divider-padding))
        );
        height: 100%;
        left: calc(
            -1 * (var(--ni-private-column-divider-width) +
                        var(--ni-private-column-divider-padding))
        );
    }

    .column-divider.active {
        display: block;
        z-index: 1;
    }

    .header-container:hover .column-divider.left,
    .header-container:hover .column-divider.right {
        display: block;
        z-index: 1;
    }

    .column-divider.left {
        left: -1px;
    }

    .column-divider.right {
        left: calc(100% - 1px);
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
        width: fit-content;
        min-width: max(100%, var(--ni-private-table-scrollable-min-width));
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
