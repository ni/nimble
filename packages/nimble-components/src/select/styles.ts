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
        overflow: clip;
        padding: ${smallPadding};
    }

    .listbox slot {
        overflow: auto;
        padding: 0px;
    }

    .listbox slot.scrollbar {
        padding-right: ${smallPadding};
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

    .search-field.above {
        padding-top: ${mediumPadding};
    }

    .search-field.below {
        padding-bottom: ${mediumPadding};
    }

    .search-field::after {
        content: '';
        position: absolute;
        top: calc(${controlHeight} + ${mediumPadding} + (2 * ${borderWidth}));
        width: calc(100% - ${mediumPadding} - (2 * ${borderWidth}));
        height: 0px;
        border-bottom: rgba(${borderRgbPartialColor}, 0.15)
            var(--ni-private-hover-indicator-width) solid;
    }

    .search-field.above::after {
        width: 0px;
    }

    .search-field::before {
        content: '';
        position: absolute;
        bottom: calc(
            ${controlHeight} + ${mediumPadding} + (2 * ${borderWidth})
        );
        width: 0px;
        height: 0px;
        border-bottom: rgba(${borderRgbPartialColor}, 0.15)
            var(--ni-private-hover-indicator-width) solid;
    }

    .search-field.above::before {
        width: calc(100% - ${mediumPadding} - (2 * ${borderWidth}));
    }

    .filter-input {
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        height: var(--ni-nimble-control-height);
        padding-left: ${mediumPadding};
    }

    .filter-input${focusVisible} {
        outline: 0px;
    }

    .no-results-label {
        padding: 0 ${smallPadding} 0 ${smallPadding};
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
            .search-field {
                background: ${hexToRgbaCssColor(White, 0.15)};
            }

            .no-results-label {
                background: ${hexToRgbaCssColor(White, 0.15)};
            }
        `
    )
);
