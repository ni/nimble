import { css } from '@microsoft/fast-element';
import {
    bodyFont,
    bodyFontColor,
    borderHoverColor,
    borderWidth,
    fillSelectedColor,
    mediumPadding,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../utilities/style/display';

export const styles = css`
    ${display('flex')}

    :host {
        min-width: 16px;
        min-height: 16px;

        flex-direction: row;
        justify-content: center;
    }

    :host([status='outgoing']) {
        justify-content: flex-end;
    }

    :host([status='incoming']) {
        justify-content: flex-start;
    }

    div {
        max-width: calc(100% - 200px);
        width: fit-content;
        height: fit-content;
        padding: ${mediumPadding};
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    :host([status='outgoing']) div {
        background: ${fillSelectedColor};
        border: ${borderWidth} solid ${borderHoverColor};
        border-radius: 8px 8px 0px 8px;
    }

    :host([status='incoming']) div {
        border-radius: 8px 8px 8px 0px;
    }
`;
