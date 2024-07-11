import { css } from '@microsoft/fast-element';
import { styles as dropdownStyles } from '../../patterns/dropdown/styles';
import { focusVisible } from '../../utilities/style/focus';
import { menuMinWidth } from '../../theme-provider/design-tokens';

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
        --ni-private-listbox-visible-option-count: 5.5;
        --ni-private-listbox-anchor-element-gap: 0px;
        min-width: ${menuMinWidth};
    }
`;
