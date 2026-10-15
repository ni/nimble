import { css } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    dividerBackgroundColor,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('block')}

    :host {
        color: ${bodyFontColor};
        font: ${bodyFont};
        container-type: inline-size;
    }

    .bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${standardPadding};
        padding: ${standardPadding};
        border-block-end: 1px solid ${dividerBackgroundColor};
    }

    .text {
        flex: 1 1 auto;
        min-width: 0;
    }

    .heading {
        display: flex;
        align-items: center;
        gap: ${standardPadding};
    }

    h2 {
        flex: 1 1 auto;
        min-width: 0;
        margin: 0;
        font: inherit;
        font-weight: 600;
    }

    .summary {
        margin-block-start: 4px;
    }

    .actions {
        display: flex;
        flex: 0 0 auto;
        gap: ${standardPadding};
    }

    @container (max-width: 420px) {
        .bar {
            flex-wrap: wrap;
        }

        .text {
            flex-basis: 100%;
        }

        .actions {
            margin-inline-start: auto;
        }
    }
`;
