import { css } from '@microsoft/fast-element';
import { styles as dropdownStyles } from '../../patterns/dropdown/styles';
import { focusVisible } from '../../utilities/style/focus';
import {
    controlHeight,
    menuMinWidth
} from '../../theme-provider/design-tokens';

export const styles = css`
    ${dropdownStyles}

    :host {
        height: auto;
    }

    :host(:hover)::after,
    :host(${focusVisible})::after {
        width: auto;
    }

    .listbox {
        min-width: ${menuMinWidth};
        max-height: calc(5.5 * ${controlHeight});
    }
`;
