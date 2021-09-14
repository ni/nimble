import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    borderColorHover,
    borderWidth,
    smallDelay
} from '../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')} :host {
        box-sizing: border-box;
    }

    .tablist {
        display: grid;
        grid-template-rows: auto auto;
        grid-template-columns: auto;
        width: max-content;
    }

    .activeIndicator {
        grid-row: 2;
        height: calc(${borderWidth} * 2);
        background-color: ${borderColorHover};
    }

    .activeIndicatorTransition {
        transition: transform ${smallDelay} ease-in-out;
    }
`;
