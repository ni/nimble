import { css } from '@ni/fast-element';
import { elevation2BoxShadow, headerBackgroundColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('block')}

    .sticky-header {
        position: fixed;
        inset-block-start: 0;
        inset-inline: 0;
        z-index: 1;
        box-sizing: border-box;
        width: 100%;
        background-color: var(${headerBackgroundColor.cssCustomProperty});
        box-shadow: var(${elevation2BoxShadow.cssCustomProperty});
    }

    .sticky-header[hidden] {
        display: none;
    }
`;
