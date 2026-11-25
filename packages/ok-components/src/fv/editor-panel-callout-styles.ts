import {
    applicationBackgroundColor,
    borderRgbPartialColor,
    popupBorderColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

// Safari clips fixed dropdowns inside scrollable stacking contexts; keep the panel's z-index auto.
export const editorPanelCalloutStyles = `
    .editor-panel-container[data-has-arrow='true'] {
        padding-block-start: 15px;
    }

    .editor-panel-container[data-has-arrow='true'] .editor-panel {
        background-image: linear-gradient(
            to right,
            var(${popupBorderColor.cssCustomProperty}) 0,
            var(${popupBorderColor.cssCustomProperty}) calc(var(--editor-panel-arrow-offset) - 15px),
            transparent calc(var(--editor-panel-arrow-offset) - 15px),
            transparent calc(var(--editor-panel-arrow-offset) + 15px),
            var(${popupBorderColor.cssCustomProperty}) calc(var(--editor-panel-arrow-offset) + 15px),
            var(${popupBorderColor.cssCustomProperty}) 100%
        );
        background-position: top left;
        background-size: 100% 1px;
        background-repeat: no-repeat;
        background-origin: border-box;
        position: relative;
        border-top-color: transparent;
    }

    .editor-panel-arrow {
        position: absolute;
        inset-block-start: 0;
        left: var(--editor-panel-arrow-offset);
        width: 30px;
        height: 15px;
        pointer-events: none;
        transform: translateX(-50%);
        filter: drop-shadow(0 2px 5px rgba(var(${borderRgbPartialColor.cssCustomProperty}), 0.28));
    }

    .editor-panel-arrow::before,
    .editor-panel-arrow::after {
        position: absolute;
        width: 0;
        height: 0;
        content: '';
    }

    .editor-panel-arrow::before {
        inset-block-start: 0;
        inset-inline-start: 0;
        border-inline: 15px solid transparent;
        border-block-end: 15px solid var(${popupBorderColor.cssCustomProperty});
    }

    .editor-panel-arrow::after {
        inset-block-start: 1px;
        inset-inline-start: 1px;
        border-inline: 14px solid transparent;
        border-block-end: 14px solid var(${applicationBackgroundColor.cssCustomProperty});
    }
`;
