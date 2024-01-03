import { css } from '@microsoft/fast-element';
import { styles as dropdownStyles } from '../patterns/dropdown/styles';
import { styles as errorStyles } from '../patterns/error/styles';
import { applicationBackgroundColor, borderWidth, controlHeight, dividerBackgroundColor, elevation2BoxShadow, mediumPadding, placeholderDisabledFontColor, placeholderFontColor, popupBorderColor, smallPadding } from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { DropdownAppearance } from './types';
import { focusVisible } from '../utilities/style/focus';

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

    .dropdown {
        box-sizing: border-box;
        display: inline-flex;
        flex-direction: column;
        left: 0;
        overflow-y: auto;
        position: absolute;
        width: 100%;
        --ni-private-listbox-padding: ${smallPadding};
        max-height: calc(
            var(--ni-private-select-max-height) - 2 *
                var(--ni-private-listbox-padding)
        );
        z-index: 1;
        box-shadow: ${elevation2BoxShadow};
        border: 1px solid ${popupBorderColor};
        background-color: ${applicationBackgroundColor};
    }

    .listbox {
        border: 0px;
    }

    .listbox.inverted {
        flex-flow: column-reverse;
    }

    .search-field {
        display: flex;
        flex-direction: row;
        padding-left: ${smallPadding};
        padding-right: ${smallPadding};
        padding-top: ${mediumPadding};
        padding-bottom: ${smallPadding};
        align-items: center;
    }

    .search-field::after {
        content: '';
        position: absolute;
        top: calc(${controlHeight} + ${smallPadding});
        width: calc(100% - ${mediumPadding});
        height: 0px;
        border-bottom: ${dividerBackgroundColor}
            var(--ni-private-hover-indicator-width) solid;
    }

    .search-field.inverted::after {
        width: 0px;
    }

    .search-field::before {
        content: '';
        position: absolute;
        bottom: calc(${controlHeight} + ${smallPadding});
        width: 0px;
        height: 0px;
        border-bottom: ${dividerBackgroundColor}
            var(--ni-private-hover-indicator-width) solid;
    }

    .search-field.inverted::before {
        width: calc(100% - ${mediumPadding});
    }

    .filter-input {
        -webkit-appearance: none;
        background: transparent;
        border: none;
        color: inherit;
        margin: auto 0;
        width: 100%;
        font: inherit;
        height: var(--ni-private-height-within-border);
    }

    .filter-input.empty {
        color: ${placeholderFontColor};
    }

    .filter-input${focusVisible} {
        outline: 0px;
    }

    .no-results-label {
        padding-left: ${mediumPadding};
        padding-bottom: ${mediumPadding};
        color: ${placeholderDisabledFontColor};
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
    )
);
