import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    borderWidth,
    controlLabelFontColor,
    elevation2BoxShadow,
    mediumPadding,
    popupBorderColor,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        width: 100%;
        height: auto;
    }

    .container {
        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: 1fr auto;
        width: 100%;
        height: 100%;

        background-color: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        box-shadow: ${elevation2BoxShadow};
    }

    textarea {
        grid-row: 1;
        grid-column: 1 / 3;

        font: ${bodyFont};
        color: ${bodyFontColor};
        background-color: transparent;
        width: 100%;
        resize: none;
        border-width: 0px;
        outline: none;
        padding: ${mediumPadding};
    }

    textarea::placeholder {
        color: ${controlLabelFontColor};
    }

    .send-button {
        grid-row: 2;
        grid-column: 2;
        width: 80px;
        margin: ${mediumPadding}
    }
`;
