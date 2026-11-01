import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderRgbPartialColor,
    borderWidth,
    controlHeight,
    controlLabelFont,
    controlLabelFontColor,
    elevation2BoxShadow,
    errorTextFontColor,
    fillHoverColor,
    fillHoverSelectedColor,
    fillSelectedColor,
    menuMinWidth,
    mediumPadding,
    placeholderFontColor,
    popupBorderColor,
    smallPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { editorPanelCalloutStyles } from '../editor-panel-callout-styles';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, focusVisible, active, disabled, top;

    @layer base {
        ${display('block')}

        :host {
            display: block;
            max-width: 100%;
            color: ${bodyFontColor};
            font: ${bodyFont};
        }

        .query-editor {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: ${smallPadding};
            min-width: 0;
        }

        .conditions-heading {
            display: flex;
            align-items: flex-end;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: ${smallPadding} ${standardPadding};
            color: ${controlLabelFontColor};
            font: ${controlLabelFont};
        }

        .conditions-heading > strong {
            font: inherit;
        }

        .suggestion-detail,
        .no-fields {
            color: ${placeholderFontColor};
        }

        .editor-field {
            position: relative;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: ${smallPadding};
            width: 100%;
            min-height: 68px;
            min-width: 0;
            padding: ${standardPadding};
            border: ${borderWidth} solid rgba(${borderRgbPartialColor}, 0.45);
            border-radius: 4px;
            box-sizing: border-box;
            background: ${applicationBackgroundColor};
            cursor: text;
        }



        .editor-field[data-layout='formatted'] {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: ${smallPadding};
        }

        .formatted-row {
            position: relative;
            display: flex;
            align-items: center;
            gap: ${smallPadding};
            min-height: 24px;
        }

        .formatted-row .insertion-slot[data-before-group='true'] {
            position: absolute;
            inset-inline-start: calc(-8px - ${smallPadding});
        }

        .formatted-row .group-parenthesis[data-layout-role='group-open'] {
            position: absolute;
            inset-inline-start: 0;
        }

        .formatted-row[data-indent-level='1'] {
            padding-inline-start: calc(${standardPadding} * 2);
        }

        .formatted-row[data-indent-level='2'] {
            padding-inline-start: calc(${standardPadding} * 4);
        }

        .formatted-row[data-indent-level='3'] {
            padding-inline-start: calc(${standardPadding} * 6);
        }

        .formatted-row[data-indent-level='4'] {
            padding-inline-start: calc(${standardPadding} * 8);
        }

        .formatted-row[data-indent-level='1'] .group-parenthesis[data-layout-role='group-open'] {
            inset-inline-start: calc(${standardPadding} * 2);
        }

        .formatted-row[data-indent-level='2'] .group-parenthesis[data-layout-role='group-open'] {
            inset-inline-start: calc(${standardPadding} * 4);
        }

        .formatted-row[data-indent-level='3'] .group-parenthesis[data-layout-role='group-open'] {
            inset-inline-start: calc(${standardPadding} * 6);
        }

        .formatted-row[data-indent-level='4'] .group-parenthesis[data-layout-role='group-open'] {
            inset-inline-start: calc(${standardPadding} * 8);
        }

        .insertion-slot {
            position: relative;
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            min-width: 8px;
            min-height: 24px;
            cursor: text;
        }

        .editor-field[data-layout='formatted'] .insertion-slot[data-after-group-open='true'] .query-input {
            margin-inline-start: calc(8px + ${smallPadding});
        }

        .query-input {
            width: var(--query-input-width);
            min-width: 8px;
            max-width: min(32ch, 70vw);
            height: 24px;
            --ni-nimble-control-height: 24px;
        }

        .query-input[data-empty='true'] {
            max-width: min(60ch, 70vw);
        }

        .query-input[data-empty='true']::part(control) {
            text-align: center;
        }

        .query-input[data-placeholder='true']::part(control) {
            text-align: left;
            text-indent: 2.5ch;
        }

        .query-input[data-placeholder='true'][data-focused='true'] {
            width: 8px;
        }

        .query-input[data-placeholder='true'][data-focused='true']::part(control) {
            text-align: center;
            text-indent: 0;
        }

        .query-input[data-placeholder='true'][data-focused='true']::part(control)::placeholder {
            opacity: 0;
        }

        .query-input::part(end)::after {
            width: 0;
        }

        .query-input[data-empty='false']::part(control) {
            padding-inline-start: 3px;
        }

        .caret-target {
            display: inline-block;
            width: 8px;
            min-height: 24px;
            cursor: text;
        }

        .condition-chip {
            max-width: min(320px, 80vw);
        }

        .condition-operator {
            font-weight: 700;
        }

        .condition-chip[data-state='incomplete']:not([expanded]),
        .condition-chip[data-state='invalid']:not([expanded]) {
            --ok-fv-expandable-chip-background: color-mix(in srgb, ${errorTextFontColor} 12%, ${applicationBackgroundColor});
            --ok-fv-expandable-chip-border: ${errorTextFontColor};
            --ok-fv-expandable-chip-color: ${errorTextFontColor};
        }

        .logic-chip {
            height: 24px;
            min-height: 24px;
            border-radius: 999px;
            font-size: 0.85em;
            font-weight: 600;
        }

        .logic-chip[appearance='block']::part(control) {
            background-clip: padding-box;
        }

        .logic-chip-previews {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .logic-chip-preview::part(control) {
            border-style: dashed;
        }

        .group-parenthesis {
            padding-inline: 2px;
            color: ${placeholderFontColor};
            font-size: 1.2em;
            font-weight: 600;
        }

        .suggestions {
            position: absolute;
            z-index: 2;
            inset-block-start: calc(100% + 4px);
            inset-inline-start: 0;
            min-width: min(${menuMinWidth}, calc(100vw - 32px));
            width: min(360px, calc(100vw - 32px));
            max-height: min(320px, 50vh);
            overflow: auto;
            padding: 4px;
            border: ${borderWidth} solid ${popupBorderColor};
            border-radius: 0;
            background: ${applicationBackgroundColor};
            box-shadow: ${elevation2BoxShadow};
            box-sizing: border-box;
        }

        .suggestion {
            display: flex;
            align-items: center;
            width: 100%;
            min-height: ${controlHeight};
            padding-inline: 8px;
            box-sizing: border-box;
            color: ${bodyFontColor};
            cursor: pointer;
            font: ${bodyFont};
            white-space: nowrap;
        }

        .suggestion-label {
            margin-inline-end: auto;
        }

        .suggestion-detail {
            margin-inline-start: auto;
        }

        .suggestion-detail {
            font-size: 0.85em;
        }

        .structure-error,
        .editor-error {
            color: ${errorTextFontColor};
        }

        .editor-actions {
            display: flex;
            align-items: center;
            gap: ${standardPadding};
            margin-block-start: calc(${mediumPadding} - ${smallPadding});
        }

        .add-filter-button {
            min-height: ${controlHeight};
        }

        .editor-region {
            z-index: 3;
        }

        .editor-panel-container {
            position: relative;
            width: min(360px, var(--editor-panel-available-width, calc(100vw - 32px)));
            box-sizing: border-box;
        }

        ${editorPanelCalloutStyles}

        .editor-panel {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: ${standardPadding};
            width: 100%;
            max-height: min(70vh, 520px);
            overflow: auto;
            padding: ${standardPadding};
            border: ${borderWidth} solid ${popupBorderColor};
            border-radius: 0;
            background: ${applicationBackgroundColor};
            box-shadow: ${elevation2BoxShadow};
            box-sizing: border-box;
        }

        .editor-control {
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
        }

    }

    @layer hover {
        .suggestion:hover {
            background: ${fillHoverColor};
        }

        .suggestion[aria-selected='true'] {
            background: ${fillSelectedColor};
        }

        .suggestion[aria-selected='true']:hover {
            background: ${fillHoverSelectedColor};
        }

        .suggestion:active {
            background: ${fillSelectedColor};
        }

        .logic-chip::part(control):hover {
            background-size: 100% 100%;
        }
    }

    @layer focusVisible {
        .query-editor:focus-within .editor-field {
            border-color: ${borderHoverColor};
        }

        .logic-chip::part(control):focus-visible {
            background-size: 100% 100%;
        }
    }

    @layer active {
        .logic-chip::part(control):active {
            background-size: 100% 100%;
        }
    }

    @layer disabled {
        :host([disabled]) .editor-field {
            background: rgba(${borderRgbPartialColor}, 0.07);
            cursor: default;
        }
    }
`;
