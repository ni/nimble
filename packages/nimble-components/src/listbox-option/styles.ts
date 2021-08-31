import { css } from '@microsoft/fast-element';
import { focusVisible } from '../utilities/style/focus';

import {
    borderColorHover,
    contentFontSize,
    fontFamily,
    contentFontColorDisabled,
    standardPadding,
    fillColorSelected,
    fillColorSelectedHover,
    fillColorHover
} from '../theme-provider/design-tokens';

export const styles = css`
    :host {
        font-family: ${fontFamily};
        font-size: ${contentFontSize};
        cursor: pointer;
        display: flex;
        justify-content: left;
    }

    .content {
        padding: 8px ${standardPadding};
    }

    :host(.selected) {
        box-shadow: none;
        outline: none;
        background-color: ${fillColorSelected};
    }

    :host(:hover.selected) {
        background-color: ${fillColorSelectedHover};
    }

    :host(:hover) {
        background-color: ${fillColorHover};
    }

    :host(:hover):host([disabled]) {
        box-shadow: none;
        background-color: transparent;
    }

    :host(:${focusVisible}) {
        box-shadow: 0px 0px 0px 1px ${borderColorHover} inset;
        outline: 1px solid ${borderColorHover};
        outline-offset: -4px;
    }

    :host(:active) {
        box-shadow: none;
        outline: none;
        background-color: ${fillColorSelected};
    }

    :host([disabled]) {
        color: ${contentFontColorDisabled};
        cursor: default;
    }

    .content[disabled] {
        box-shadow: none;
        outline: none;
    }
`;
