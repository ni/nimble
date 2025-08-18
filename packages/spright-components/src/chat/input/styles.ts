import { css } from '@ni/fast-element';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    borderWidth,
    controlLabelFontColor,
    elevation2BoxShadow,
    mediumPadding,
    popupBorderColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        width: 100%;
        height: auto;
    }

    .attachments {
        display: flex;
        flex-wrap: wrap;
        gap: ${mediumPadding};
        margin: ${mediumPadding};
    }

    .attachments.empty {
        display: none;
    }

    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;

        background-color: ${applicationBackgroundColor};
        border: ${borderWidth} solid ${popupBorderColor};
        box-shadow: ${elevation2BoxShadow};
    }

    textarea {
        font: ${bodyFont};
        color: ${bodyFontColor};
        background-color: transparent;

        width: 100%;
        resize: none;
        height: auto;
        max-height: calc(6lh + 2 * ${mediumPadding});
        field-sizing: content;

        border-width: 0px;
        outline: none;
        padding: ${mediumPadding};
    }

    textarea::placeholder {
        color: ${controlLabelFontColor};
    }

    .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: ${mediumPadding};
    }

    .send-button,
    .stop-button {
        width: 80px;
        margin: ${mediumPadding};
    }
`;
