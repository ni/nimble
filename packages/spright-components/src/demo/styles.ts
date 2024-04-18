import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { iconColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        position: relative;
        height: 32px;
        max-width: 32px;
        ${iconColor.cssCustomProperty}: white;
    }

    .backplate {
        position: relative;
        display: flex;
    }

    .circle {
        border-radius: 100%;
        min-width: 100%;
        overflow: hidden;
    }

    .link {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        min-width: 100%;
    }
`;
