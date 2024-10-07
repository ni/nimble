import { css } from '@microsoft/fast-element';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { display } from '../utilities/style/display';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    popupBorderColor,
    controlSlimHeight,
    mediumPadding,
    standardPadding,
    tableRowBorderColor,
    borderHoverColor,
    controlHeight,
    tableFitRowsHeight,
    borderWidth,
    iconSize
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';
import { userSelectNone } from '../utilities/style/user-select';
import { accessiblyHidden } from '../utilities/style/accessibly-hidden';
import { ZIndexLevels } from '../utilities/style/types';
import { focusVisible } from '../utilities/style/focus';

export const styles = css`
    ${display('flex')}

    :host {
        height: 480px;
        ${tableFitRowsHeight.cssCustomProperty}: calc(var(--ni-private-table-scroll-height) + ${controlHeight});
        ${
            /**
             * Set a default maximum height for the table of 40.5 rows plus the header row so
             * that clients don't accidentally create a table that tries to render too many rows at once.
             * If needed, the max-height can be overridden by the client, but setting a default ensures
             * that the max-height is considered if a larger one is needed rather than being overlooked.
             */ ''
        }
        max-height: calc(${controlHeight} + (40.5 * (2 * ${borderWidth} + ${controlHeight})));
        --ni-private-column-divider-width: 2px;
        --ni-private-column-divider-padding: 3px;
    }

    :host(${focusVisible}) {
        ${
            /* The table can briefly be focused in some keyboard nav cases (e.g. regaining focus and we
            need to scroll to the previously focused row first). Ensure that we don't get the browser-default
            focus outline in that case.
        ) */ ''
        }
        outline: none;
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
        align-items: center;
    }

    .checkbox-container {
        display: flex;
    }

    .column-headers-container {
        display: grid;
        width: 100%;
        grid-template-columns: var(--ni-private-table-row-grid-columns) auto;
    }

    .collapse-all-button-container {
        display: flex;
        min-width: ${mediumPadding};
    }

    .collapse-all-button {
        height: ${controlSlimHeight};
        margin-left: ${mediumPadding};
        visibility: hidden;
    }

    .collapse-all-button.hidden-size-reduced {
        display: none;
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
        z-index: ${ZIndexLevels.zIndex1};
    }

    .column-divider:hover,
    .column-divider.divider-active {
        border-color: ${borderHoverColor};
    }

    .column-divider.column-active.draggable,
    .header-container:hover .column-divider.draggable {
        display: block;
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

    .table-viewport${focusVisible} {
        outline: none;
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
        width: ${iconSize};
    }

    .selection-checkbox::part(container) {
        padding: 0px;
    }

    .group-row {
        position: relative;
        --ni-private-table-cell-focus-offset-multiplier: 0;
    }

    .row {
        position: relative;
        --ni-private-table-cell-focus-offset-multiplier: 0;
    }

    .collapse-all-visible .row,
    .collapse-all-visible .group-row {
        --ni-private-table-cell-focus-offset-multiplier: 1;
    }

    .accessibly-hidden {
        ${accessiblyHidden}
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
