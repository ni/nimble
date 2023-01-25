import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    fillHoverColor
} from '../theme-provider/design-tokens';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';
import { themeBehavior } from '../utilities/style/theme';

export const styles = css`
    ${display('flex')}

    :host {
        height: 480px;
    }

    .table-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .table-viewport {
        overflow-y: auto;
        display: block;
        height: 100%;
        position: relative;
    }

    .table-scroll {
        pointer-events: none;
        position: absolute;
        top: 0px;
        width: 100%;
    }

    .table-row-container {
        width: 100%;
        position: sticky;
        overflow: hidden;
        top: 0px;
    }

    .header-container {
        position: sticky;
        top: 0;
    }

    .header-row {
        display: flex;
        flex-direction: row;
        background: ${applicationBackgroundColor};
        position: relative;
    }

    .header {
        flex: 1;
    }

    .row {
        background: ${applicationBackgroundColor};
        position: relative;
    }

    .row::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
    }

    .row:hover::before {
        background: ${fillHoverColor};
    }
`.withBehaviors(
    themeBehavior(
        Theme.color,
        css`
            .header-row::before {
                content: '';
                width: 100%;
                height: 100%;
                position: absolute;
                background: ${fillHoverColor};
            }

            .row::before {
                background: ${fillHoverColor};
            }

            .row:hover::before {
                background: ${hexToRgbaCssColor(White, 0.15)};
            }
        `
    )
);
