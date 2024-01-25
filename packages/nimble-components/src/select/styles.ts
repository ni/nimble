import { css } from '@microsoft/fast-element';
import { White } from '@ni/nimble-tokens/dist/styledictionary/js/tokens';
import { styles as dropdownStyles } from '../patterns/dropdown/styles';
import { styles as errorStyles } from '../patterns/error/styles';
import {
    borderRgbPartialColor,
    borderWidth,
    controlHeight,
    mediumPadding,
    placeholderFontColor,
    smallPadding
} from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { DropdownAppearance } from './types';
import { focusVisible } from '../utilities/style/focus';
import { themeBehavior } from '../utilities/style/theme';
import { Theme } from '../theme-provider/types';
import { hexToRgbaCssColor } from '../utilities/style/colors';

export const styles = css`
    ${dropdownStyles}
    ${errorStyles}

    ${
        /* We are using flex `order` to define the visual ordering of the selected value,
         error icon, and dropdown arrow because they are not "interactive" i.e. part of the tab order */ ''
    }
    [part='selected-value'] {
        order: 1;
    }

    [part='indicator'] {
        order: 3;
    }

    .error-icon {
        order: 2;
    }

    [part='end'] {
        display: contents;
    }

    .listbox {
        overflow-x: clip;
    }

    .listbox.empty slot {
        display: none;
    }

    .listbox.above {
        flex-flow: column-reverse;
    }

    .search-field {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: ${controlHeight};
        background: transparent;
    }

    .search-icon {
        padding-left: ${smallPadding};
    }

    .search-field::after,
    .search-field::before {
        content: '';
        position: absolute;
        height: 0px;
        border-bottom: rgba(${borderRgbPartialColor}, 0.1) 2px solid;
    }

    .search-field::after {
        top: calc(${controlHeight} + ${smallPadding} - ${borderWidth});
    }

    .search-field:before {
        bottom: calc(${controlHeight} + ${smallPadding} + (2 * ${borderWidth}));
    }

    .search-field:not(.above)::after,
    .search-field.above::before {
        width: calc(100% - (2 * ${borderWidth}));
    }

    .filter-input {
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        height: var(--ni-nimble-control-height);
        padding: 0 ${smallPadding} 0 ${mediumPadding};
        width: 100%;
    }

    .filter-input::placeholder {
        color: ${placeholderFontColor};
    }

    .filter-input${focusVisible} {
        outline: 0px;
    }

    .scrollable-element {
        overflow: auto;
    }

    .no-results-label {
        padding: ${smallPadding} ${mediumPadding} 0 ${mediumPadding};
        color: ${placeholderFontColor};
        height: ${controlHeight};
        display: inline-flex;
        align-items: center;
    }
`.withBehaviors(
    appearanceBehavior(
        DropdownAppearance.block,
        css`
            :host([error-visible]) .control {
                border-bottom-width: ${borderWidth};
                padding-bottom: 0;
            }
        `
    ),
    themeBehavior(
        Theme.color,
        css`
            .search-field,
            .no-results-label {
                background: ${hexToRgbaCssColor(White, 0.15)};
            }
        `
    )
);
