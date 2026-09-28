import { css } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    failColor,
    iconColor,
    mediumPadding,
    passColor,
    smallPadding,
    standardPadding,
    warningColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { display } from '../../../../utilities/style/display';
import { chatToolCallInputTag } from '../tool-call-input';

export const styles = css`
    ${display('block')}

    :host {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        color: ${bodyFontColor};
        font: ${bodyFont};
        padding: ${mediumPadding} ${standardPadding};
    }

    .tool-call-row {
        display: flex;
        align-items: center;
        gap: ${smallPadding};
        min-width: 0;
        overflow-wrap: anywhere;
        text-align: start;
    }

    .status-icon {
        display: inline-flex;
        flex: 0 0 auto;
        color: ${iconColor};
    }

    .status-icon > * {
        width: 16px;
        height: 16px;
    }

    :host([status='success']) .status-icon {
        color: ${passColor};
    }

    :host([status='warning']) .status-icon {
        color: ${warningColor};
    }

    :host([status='error']) .status-icon,
    :host([status='terminated']) .status-icon {
        color: ${failColor};
    }

    .tool-name {
        min-width: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        user-select: text;
    }

    .status-label {
        flex: 0 0 auto;
        margin-inline-start: auto;
    }

    :host([status='canceled']),
    :host([status='declined']) {
        opacity: 0.72;
    }

    .input-list {
        display: flex;
        flex-direction: column;
        gap: ${smallPadding};
        margin-block-start: ${mediumPadding};
        margin-inline-start: calc(16px + ${smallPadding});
        min-width: 0;
    }

    .input-list ::slotted(${chatToolCallInputTag}) {
        min-width: 0;
    }

    @media (max-width: 400px) {
        .tool-call-row {
            flex-wrap: wrap;
        }

        .status-label {
            margin-inline-start: 0;
        }
    }
`;