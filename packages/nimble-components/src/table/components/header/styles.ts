import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    controlHeight,
    iconColor,
    mediumPadding,
    tableHeaderFont,
    tableHeaderFontColor
} from '../../../theme-provider/design-tokens';
import {
    columnSpacing,
    defaultMinPixelWidth
} from '../../../table-column/base/types';

// When the column becomes more narrow than the default minimum width, the sorting and grouping
// indicators should be hidden. The container query is based on the content of the header, so
// the left/right padding should not be considered in the width.
const defaultMinHeaderContentWidth = `${defaultMinPixelWidth - 2 * columnSpacing - 1}px`;

export const styles = css`
    ${display('flex')}

    :host {
        height: ${controlHeight};
        align-items: center;
        padding: 0px ${mediumPadding};
        font: ${tableHeaderFont};
        color: ${tableHeaderFontColor};
        ${iconColor.cssCustomProperty}: ${tableHeaderFontColor};
        text-transform: uppercase;
        gap: ${mediumPadding};
        cursor: default;
        container: column-header / inline-size;
    }

    .sort-indicator,
    .grouped-indicator {
        flex: 0 0 auto;

    }

    @container column-header (max-width: ${defaultMinHeaderContentWidth}) {
        .sort-indicator,
        .grouped-indicator {
            display: none;
        }
    }
`;

// // When the column is narrower than the default minimum width, the sorting and grouping
// // indicators should be hidden. The container query is based on the content of the header,
// // so the left/right padding should not be considered in the width.
// const defaultMinHeaderContentWidth = `${defaultMinPixelWidth - 2 * columnSpacing}px`;

// export const styles = css`
//     ${display('flex')}

//     :host {
//         height: ${controlHeight};
//         align-items: center;
//         padding: 0px ${mediumPadding};
//         font: ${tableHeaderFont};
//         color: ${tableHeaderFontColor};
//         ${iconColor.cssCustomProperty}: ${tableHeaderFontColor};
//         text-transform: uppercase;
//         gap: ${mediumPadding};
//         cursor: default;
//         container: column-header / inline-size;
//     }

//     .sort-indicator,
//     .grouped-indicator {
//         flex: 0 0 auto;
//         display: none;
//     }

//     @container column-header (min-width: ${defaultMinHeaderContentWidth}) {
//         .sort-indicator,
//         .grouped-indicator {
//             display: inline-flex;
//         }
//     }
// `;
