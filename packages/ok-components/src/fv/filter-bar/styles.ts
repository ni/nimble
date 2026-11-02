import { css } from '@ni/fast-element';
import {
    bodyDisabledFontColor,
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    controlHeight,
    fillHoverColor,
    iconColor,
    iconSize,
    sectionBackgroundColor,
    smallPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    @layer base, hover, focusVisible, disabled, top;

    @layer base {
        ${display('flex')}

        :host {
            min-width: 0;
            font: ${bodyFont};
            color: ${bodyFontColor};
        }

        .filter-bar {
            display: flex;
            align-items: center;
            min-width: 0;
            max-width: 100%;
            height: 30px;
            padding: 0 ${standardPadding};
        }

        .filter-bar-edit,
        .filter-bar-clear {
            -webkit-appearance: none;
            appearance: none;
            display: inline-flex;
            align-items: center;
            min-width: 0;
            padding: 0;
            border: none;
            border-radius: 2px;
            background: transparent;
            color: inherit;
            font: inherit;
            cursor: pointer;
        }

        .filter-bar-edit {
            flex: 0 1 auto;
            height: 30px;
            gap: calc(2 * ${smallPadding});
            text-align: start;
        }

        .filter-bar-content {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .filter-bar-label {
            margin-inline-end: 10px;
        }

        .query-expression {
            padding: 0 ${smallPadding};
            background-color: ${sectionBackgroundColor};
            border-radius: 50px;
        }

        .logical-operator {
            font-weight: 600;
            color: ${borderHoverColor};
        }

        .compound-expression-container {
            font-size: medium;
        }

        .filter-bar-icon {
            flex: 0 0 auto;
            width: ${iconSize};
            height: ${iconSize};
            ${iconColor.cssCustomProperty}: currentColor;
        }

        .filter-bar-clear {
            ${controlHeight.cssCustomProperty}: 24px;
            flex: 0 0 auto;
            justify-content: center;
            width: ${controlHeight};
            height: ${controlHeight};
            margin-inline-start: calc(2 * ${smallPadding});
        }
    }

    @layer hover {
        .filter-bar-clear:hover {
            background: ${fillHoverColor};
        }
    }

    @layer focusVisible {
        .filter-bar-edit:focus-visible,
        .filter-bar-clear:focus-visible {
            outline: ${borderWidth} solid ${borderHoverColor};
            outline-offset: -1px;
        }
    }

    @layer disabled {
        .filter-bar-edit:disabled,
        .filter-bar-clear:disabled {
            color: ${bodyDisabledFontColor};
            cursor: not-allowed;
        }

        :host([disabled]) .logical-operator {
            color: inherit;
        }
    }

    @layer top {}
`;
