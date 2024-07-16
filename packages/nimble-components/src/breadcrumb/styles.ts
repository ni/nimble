import { css } from '@microsoft/fast-element';
import { display } from '../utilities/style/display';
import {
    bodyEmphasizedFont,
    controlSlimHeight,
    linkFontColor,
    linkProminentFontColor,
    menuMinWidth
} from '../theme-provider/design-tokens';
import { CollapseState } from './types';

export const styles = css`
    ${display('inline-block')}

    :host {
        width: 100%;
    }

    .list {
        display: flex;
    }

    .${CollapseState.collapseMiddle} ::slotted(:not(:first-child, :last-child)),
    .${CollapseState.collapseExceptCurrent} ::slotted(:not(:last-child)) {
        display: none;
    }

    .${CollapseState.collapseExceptCurrent} ::slotted(:last-child) {
        min-width: ${menuMinWidth};
    }

    ::slotted(:last-child) {
        order: 1000;
        font: ${bodyEmphasizedFont};
        color: ${linkFontColor};
    }

    :host([appearance='prominent']) ::slotted(:last-child) {
        color: ${linkProminentFontColor};
    }

    .collapsed-items-button {
        height: ${controlSlimHeight};
    }
`;
