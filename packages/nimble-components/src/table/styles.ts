import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    PowerGreen,
    White
} from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    fillHoverColor,
    sectionBackgroundColor,
    fillHoverSelectedColor,
    fillSelectedColor,
    standardPadding,
    controlHeight,
    borderWidth
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
        overflow: hidden;
        display: flex;
        flex-direction: column;
        width: 100%;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .table-viewport {
        overflow: auto;
        display: block;
        height: 100%;
        position: relative;
    }

    .table-scroll {
        pointer-events: none;
        position: absolute;
        top: 0px;
        width: 100%;
        height: var(--ni-private-table-scroll-height);
    }

    .table-row-container {
        width: 100%;
        position: relative;
        top: var(--ni-private-table-row-container-top);
        background: ${sectionBackgroundColor};
    }

    .header-container {
        position: sticky;
        top: 0;
    }

    .header-row {
        display: flex;
        background: ${applicationBackgroundColor};
        position: relative;
        width: fit-content;
        min-width: 100%;
        left: var(--ni-private-table-scroll-x);
    }

    .header-row::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        pointer-events: none;
    }

    .column-header-container {
        display: grid;
        width: 100%;
        grid-template-columns: var(--ni-private-table-row-grid-columns) auto;
    }

    .header-scrollbar-spacer {
        width: var(--ni-private-table-header-scrollbar-spacer-width);
    }

    .header {
        flex: 1;
    }

    .checkbox-container {
        display: flex;
    }

    .selection-checkbox {
        margin-left: ${standardPadding};
    }

    .selection-checkbox::part(label) {
        padding-left: 0px;
    }

    .group-row {
        background: ${sectionBackgroundColor};
        position: relative;
        height: calc(${controlHeight} + 2 * ${borderWidth});
        border-top: calc(2 * ${borderWidth}) solid transparent;
        box-sizing: border-box;
        background-clip: padding-box;
    }

    .group-row::before {
        content: '';
        width: 100%;
        height: ${controlHeight};
        position: absolute;
        pointer-events: none;
        bottom: 0px;
        background-clip: padding-box;
    }

    .group-row:hover::before {
        background: ${fillHoverColor};
        background-clip: padding-box;
    }

    .row {
        background: ${applicationBackgroundColor};
        position: relative;
        height: calc(${controlHeight} + 2 * ${borderWidth});
        border-top: calc(2 * ${borderWidth}) solid transparent;
        box-sizing: border-box;
        background-clip: padding-box;
    }

    .row::before {
        content: '';
        width: 100%;
        height: ${controlHeight};
        position: absolute;
        pointer-events: none;
        box-sizing: border-box;
        bottom: 0px;
        background-clip: padding-box;
    }

    :host([selection-mode='single']) .row:hover::before,
    :host([selection-mode='multiple']) .row:hover::before {
        background: ${fillHoverColor};
    }

    :host([selection-mode='single']) .row[selected]::before,
    :host([selection-mode='multiple']) .row[selected]::before {
        background: ${fillSelectedColor};
    }

    :host([selection-mode='single']) .row[selected]:hover::before,
    :host([selection-mode='multiple']) .row[selected]:hover::before {
        background: ${fillHoverSelectedColor};
    }
`.withBehaviors(
    themeBehavior(
        Theme.color,
        css`
            .table-row-container {
                background-color: ${applicationBackgroundColor};
            }

            .table-row-container::before {
                content: '';
                width: 100%;
                height: 100%;
                background-color: ${hexToRgbaCssColor(White, 0.1)};
                position: absolute;
            }

            .group-row {
                background-color: ${applicationBackgroundColor};
            }

            .group-row::before {
                background-color: ${hexToRgbaCssColor(White, 0.1)};
            }

            .group-row:hover::before {
                background-color: ${hexToRgbaCssColor(White, 0.125)};
            }

            :host([selection-mode='single']) .row:hover::before,
            :host([selection-mode='multiple']) .row:hover::before {
                background-color: ${hexToRgbaCssColor(White, 0.05)};
            }
        
            :host([selection-mode='single']) .row[selected]::before,
            :host([selection-mode='multiple']) .row[selected]::before {
                background-color: ${hexToRgbaCssColor(White, 0.2)};
            }

            :host([selection-mode='single']) .row[selected]:hover::before,
            :host([selection-mode='multiple']) .row[selected]:hover::before {
                background-color: ${hexToRgbaCssColor(White, 0.15)};
        `
    ),
    themeBehavior(
        Theme.dark,
        css`
            .group-row:hover::before {
                background-color: ${hexToRgbaCssColor(White, 0.1)};
            }

            :host([selection-mode='single']) .row[selected]::before,
            :host([selection-mode='multiple']) .row[selected]::before {
                background-color: ${hexToRgbaCssColor(PowerGreen, 0.2)};
            }

            :host([selection-mode='single']) .row[selected]:hover::before,
            :host([selection-mode='multiple']) .row[selected]:hover::before {
                background-color: ${hexToRgbaCssColor(PowerGreen, 0.15)};
            }
        `
    )
);
