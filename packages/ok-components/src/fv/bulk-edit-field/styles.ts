import { css } from '@ni/fast-element';
import {
    controlLabelFont,
    controlLabelFontColor,
    bodyFont,
    bodyFontColor,
    informationColor,
    warningColor,
    warningFontColor,
    controlHeight,
    labelHeight,
    smallPadding,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('block')}

    :host {
        color: ${bodyFontColor};
        font: ${bodyFont};
    }

    .field {
        display: grid;
        grid-template-columns: 3px minmax(0, 1fr);
        column-gap: ${standardPadding};
    }

    .marker {
        width: 3px;
        border-radius: 2px;
    }

    :host([status='changed']) .marker,
    :host([status='will-clear']) .marker {
        background: ${warningColor};
    }

    .content,
    .control {
        min-width: 0;
    }

    .header,
    .actions {
        display: flex;
        align-items: center;
        gap: ${smallPadding};
    }

    .header {
        flex-wrap: wrap;
        margin-block-end: 0;
    }

    .label {
        font: ${controlLabelFont};
        color: ${controlLabelFontColor};
        margin-inline-end: auto;
    }

    .status {
        font-size: 0.875em;
        line-height: 1;
        padding: 0 5px;
        border: 1px solid ${informationColor};
        border-radius: 4px;
        color: ${informationColor};
    }

    :host([status='changed']) .status,
    :host([status='will-clear']) .status {
        border-color: ${warningColor};
        color: ${warningFontColor};
    }

    .control {
        display: block;
    }

    .actions {
        justify-content: flex-end;
        gap: 4px;
        ${controlHeight.cssCustomProperty}: ${labelHeight};
    }

    ::slotted(:not([slot])) {
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
    }
`;
