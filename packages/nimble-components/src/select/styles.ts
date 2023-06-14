import { css } from '@microsoft/fast-element';
import { styles as dropdownStyles } from '../patterns/dropdown/styles';
import { styles as errorStyles } from '../patterns/error/styles';
import { applicationBackgroundColor, borderWidth, elevation2BoxShadow, popupBorderColor, smallPadding } from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { DropdownAppearance } from './types';

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

    .end {
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

    .listbox {
        border: 0px;
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
