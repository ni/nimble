import { bodyFontColor, controlSlimHeight, smallPadding, applicationBackgroundColor, bodyFont, elevation2BoxShadow, popupBorderColor, dividerBackgroundColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import { controlHeight, mediumPadding } from '@ni/nimble-components/src/theme-provider/design-tokens';

export const datePickerBaseStyles = css`
    ${display('inline-block')}

    :host {
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .dialog {
        background: ${applicationBackgroundColor};
        border: 1px solid ${popupBorderColor};
        padding: ${smallPadding};
        margin-top: 4px;
        box-shadow: ${elevation2BoxShadow};
    }

    .header {
        display: flex;
        align-items: center;
        gap: ${mediumPadding};
    }

    .title {
        margin-left: auto;
        margin-right: auto;
    }

    nimble-button {
        height: ${controlSlimHeight};
    }

    hr {
        border-color: ${dividerBackgroundColor};
    }

    .calendar-weekdays {
        padding-top: ${mediumPadding};
        display: grid;
        grid-template-columns: repeat(7, ${controlHeight});
        gap: ${smallPadding};
        justify-items: center;
    }

    .calendar-week {
        display: grid;
        grid-template-columns: repeat(7, ${controlHeight});
        gap: ${smallPadding};
        justify-items: center;
        margin-bottom: ${smallPadding};
    }

    .months-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: ${smallPadding};
        margin-bottom: ${smallPadding};
    }

    .footer {
        display: flex;
        justify-content: flex-end;
        gap: ${mediumPadding};
        padding: ${mediumPadding};
    }
`;