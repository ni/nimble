import { css } from '@microsoft/fast-element';
import { styles as dropdownStyles } from '../patterns/dropdown/styles';
import { styles as errorStyles } from '../patterns/error/styles';
import { borderWidth } from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { focusVisible } from '../utilities/style/focus';
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
        pointer-events: none
    }

    .selected-value {
        -webkit-appearance: none;
        background: transparent;
        border: none;
        color: inherit;
        margin: auto 0;
        width: 100%;
        font: inherit;
        height: var(--ni-private-height-within-border);
    }

    .selected-value:hover,
    .selected-value:disabled,
    .selected-value:active,
    .selected-value${focusVisible} {
        outline: none;
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
