import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import {
    borderColor,
    sectionBackgroundColor,
    dividerBackgroundColor,
    borderWidth
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')}

    :host {
        width: 100%;
        overflow: hidden;
    }

    /* Ghost: no border, transparent background */
    :host(:not([appearance])),
    :host([appearance='ghost']) {
        background: transparent;
        border: none;
    }

    /* Outline: container border, transparent background; dividers between items */
    :host([appearance='outline']) {
        background: transparent;
        border: ${borderWidth} solid ${borderColor};
    }
    :host([appearance='outline']) ::slotted(nimble-accordion-item) {
        border-bottom: ${borderWidth} solid ${dividerBackgroundColor};
    }
    :host([appearance='outline'])
        ::slotted(nimble-accordion-item:last-of-type) {
        border-bottom: none;
    }

    /* Block: filled container, no outer border; subtle item separators */
    :host([appearance='block']) {
        background: ${sectionBackgroundColor};
        border: none;
    }
    :host([appearance='block']) ::slotted(nimble-accordion-item) {
        border-bottom: ${borderWidth} solid ${dividerBackgroundColor};
    }
    :host([appearance='block']) ::slotted(nimble-accordion-item:last-of-type) {
        border-bottom: none;
    }

    /* Hover styling is applied within the item header, not the container. */
`;
