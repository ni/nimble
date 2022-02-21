import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { focusVisible } from '../utilities/style/focus';

import {
    borderHoverColor,
    fillColorSelected,
    fillSelectedHoverColor,
    fillHoverColor,
    bodyFont,
    bodyFontDisabledColor
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        font: ${bodyFont};
        cursor: pointer;
        justify-content: left;
    }

    .content {
        padding: 8px 4px;
    }

    :host(.selected) {
        box-shadow: none;
        outline: none;
        background-color: ${fillColorSelected};
    }

    :host(:hover.selected) {
        background-color: ${fillSelectedHoverColor};
    }

    :host(:hover) {
        background-color: ${fillHoverColor};
    }

    :host(:hover):host([disabled]) {
        box-shadow: none;
        background-color: transparent;
    }

    :host(:${focusVisible}) {
        box-shadow: 0px 0px 0px 1px ${borderHoverColor} inset;
        outline: 1px solid ${borderHoverColor};
        outline-offset: -4px;
    }

    :host(:active) {
        box-shadow: none;
        outline: none;
        background-color: ${fillColorSelected};
    }

    :host([disabled]) {
        color: ${bodyFontDisabledColor};
        cursor: default;
    }

    .content[disabled] {
        box-shadow: none;
        outline: none;
    }
`;
