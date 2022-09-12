import { css } from '@microsoft/fast-element';
import { styles as dropdownStyles } from '../patterns/dropdown/styles';
import { styles as errorStyles } from '../patterns/error/styles';
import { borderWidth } from '../theme-provider/design-tokens';
import { appearanceBehavior } from '../utilities/style/appearance';
import { DropdownAppearance } from './types';

export const styles = css`
    ${dropdownStyles}
    ${errorStyles}

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
`.withBehaviors(
        appearanceBehavior(
            DropdownAppearance.block,
            css`
            :host(.invalid) .control {
                border-bottom-width: ${borderWidth};
                padding-bottom: 0;
            }
        `
        )
);
