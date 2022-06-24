import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { applicationBackgroundColor, bodyFont, bodyFontColor, popupBorderColor } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('block')}

    :host {
        position: relative;
        top: 0;
        bottom: 0;
        width: fit-content;
        height: fit-content;
        outline: none;
        font: ${bodyFont};
        color: ${bodyFontColor};
        z-index: 999;
        --ni-nimble-dialog-background-color: ${applicationBackgroundColor}
    }

    .positioning-region {
        display: block;
        position: relative;
        inset: 0px;
        overflow: hidden;
    }

    ${/* Note: overlay is only present in the DOM when modal=true */ ''}
    .overlay {
        position: fixed;
        inset: 0px;
        background: ${popupBorderColor};
        touch-action: none;
    }

    .control {
        position: relative;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border-radius: 0px;
        border-width: 0px;
        background-color: var(--ni-nimble-dialog-background-color);
    }
`;