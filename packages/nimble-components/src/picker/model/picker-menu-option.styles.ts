import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';

import {
    bodyFont,
    fillHoverColor,
    fillSelectedColor,
    fillHoverSelectedColor,
    borderHoverColor
} from '../../theme-provider/design-tokens';
import { focusVisible } from '../../utilities/style/focus';

export const styles = css`
    ${display('grid')}

    :host {
        font: ${bodyFont};
        cursor: pointer;
        justify-content: left;
    }

    :host([aria-selected='true']) {
        box-shadow: none;
        outline: none;
        background-color: ${fillSelectedColor};
    }

    :host([aria-selected='true']:hover) {
        background-color: ${fillHoverSelectedColor};
    }

    :host(:hover) {
        background-color: ${fillHoverColor};
    }

    :host(:${focusVisible}) {
        box-shadow: 0px 0px 0px 1px ${borderHoverColor} inset;
        outline: 1px solid ${borderHoverColor};
        outline-offset: -4px;
    }

    :host(:active) {
        box-shadow: none;
        outline: none;
        background-color: ${fillSelectedColor};
    }
`;
