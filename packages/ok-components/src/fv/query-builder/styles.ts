import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    controlHeight,
    elevation2BoxShadow,
    errorTextFontColor,
    placeholderFontColor,
    popupBorderColor,
    smallPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, focusVisible, disabled;

    @layer base {
        ${display('inline-block')}

        :host {
            vertical-align: middle;
            max-width: 100%;
            box-sizing: border-box;
            color: ${bodyFontColor};
            font: ${bodyFont};
        }

        .query-builder {
            position: relative;
            display: inline-flex;
            min-width: 0;
            box-sizing: border-box;
        }

        .queries-menu-button {
            flex: 0 0 auto;
            width: max-content;
            min-height: ${controlHeight};
        }

        .menu-button-label {
            overflow: hidden;
            max-width: 24ch;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .query-trigger-content {
            display: inline-flex;
            align-items: center;
            gap: ${smallPadding};
        }

        .query-popover-region {
            z-index: 1000;
            padding-block-start: 8px;
        }

        .saved-query-menu {
            box-sizing: border-box;
            width: min(320px, calc(100vw - 32px));
            max-height: min(60vh, 480px);
            overflow: auto;
        }

        .saved-query-option[aria-current='true'] {
            font-weight: 700;
        }

        .dirty-indicator {
            color: ${placeholderFontColor};
            font-size: 0.75em;
            white-space: nowrap;
        }

        .query-popover {
            display: flex;
            flex-direction: column;
            width: min(600px, calc(100vw - 32px));
            max-height: min(80vh, 760px, var(--query-popover-available-height, 760px));
            box-sizing: border-box;
            overflow: auto;
            /* Offset with relative insets: transforms would clip fixed-position condition popovers. */
            position: relative;
            left: var(--query-popover-drag-x, 0px);
            top: var(--query-popover-drag-y, 0px);
            border: ${borderWidth} solid ${popupBorderColor};
            background: ${applicationBackgroundColor};
            color: ${bodyFontColor};
            box-shadow: ${elevation2BoxShadow};
        }

        .query-popover[hidden] {
            display: none;
        }

        .popover-header {
            flex: 0 0 auto;
            padding: ${standardPadding} 24px 0;
            cursor: move;
            touch-action: none;
            user-select: none;
        }

        .popover-header h2 {
            margin: 0;
            font-size: 1.25em;
            font-weight: 600;
        }

        .popover-content {
            display: flex;
            flex-direction: column;
            gap: ${standardPadding};
            min-width: 0;
            padding: 0 24px ${standardPadding};
        }

        .query-controls-header {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: flex-end;
            column-gap: ${standardPadding};
            row-gap: 8px;
            min-width: 0;
        }

        .query-name-control {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 160px;
            margin-block-start: 8px;
        }

        .query-name-input,
        .ai-prompt-input {
            width: 100%;
            min-width: 0;
        }

        .operation-error {
            color: ${errorTextFontColor};
            font-size: 0.875em;
        }

        .ai-prompt-toggle-row {
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            grid-column: 2;
        }

        .ai-prompt-content {
            grid-column: 1 / -1;
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
            box-sizing: border-box;
        }

        .ai-prompt-content[hidden] {
            display: none;
        }

        .ai-preview-notice {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: ${standardPadding};
            padding: ${standardPadding};
            border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.24);
            color: ${placeholderFontColor};
        }

        .query-conditions {
            display: block;
            min-width: 0;
        }

        .query-conditions::part(conditions-heading) {
            margin-block-end: ${smallPadding};
        }

        .builder-footer {
            position: sticky;
            bottom: 0;
            display: flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: ${standardPadding};
            min-height: 64px;
            padding: ${smallPadding} 24px;
            border-top: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.24);
            background: ${applicationBackgroundColor};
        }

        .footer-actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-wrap: wrap;
            gap: 8px;
        }

        .query-action-split-button {
            min-width: 92px;
        }

        .footer-actions {
            flex: 0 0 auto;
            flex-direction: row-reverse;
            flex-wrap: nowrap;
            margin-inline-start: auto;
            order: 1;
        }

        .builder-status,
        .visually-hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip-path: inset(50%);
            white-space: nowrap;
        }
    }

    @layer focusVisible {
        .query-popover:focus-visible {
            outline: 2px solid ${borderHoverColor};
            outline-offset: 0;
        }
    }

    @layer disabled {
        :host([disabled]) {
            opacity: 0.6;
        }
    }

    @media (max-width: 600px) {
        .query-popover {
            width: min(600px, calc(100vw - 16px));
        }

        .popover-header,
        .popover-content {
            padding-inline: ${standardPadding};
        }

        .builder-footer {
            padding-inline: ${standardPadding};
        }
    }
`;
