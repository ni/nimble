import { css } from '@ni/fast-element';
import { display } from '../utilities/style/display';
import { controlHeight, smallPadding } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('inline-flex')}

    :host {
        border: none;
    }

    :host([orientation="vertical"]) {
        flex-direction: column;
    }

    .scroll-button.start {
        width: ${controlHeight};
        height: ${controlHeight};
        margin-right: ${smallPadding};
        margin-bottom: 0px;
    }

    :host([orientation="vertical"]) .scroll-button.start {
        margin-right: 0px;
        margin-bottom: ${smallPadding};
    }

    .list {
        flex-grow: 1;
        display: inline-flex;
        gap: ${smallPadding};
        scrollbar-width: none;
        padding: 0;
        margin: 0;

        flex-direction: row;
        overflow-x: scroll;
        overflow-y: hidden;
        width: max-content;
        max-width: 100%;
        height: auto;
        max-height: none;
    }

    :host([orientation="vertical"]) .list {
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: scroll;
        width: auto;
        max-width: none;
        height: max-content;
        max-height: 100%;
    }

    .scroll-button.end {
        width: ${controlHeight};
        height: ${controlHeight};
        margin-left: ${smallPadding};
        margin-top: 0px;
    }

    :host([orientation="vertical"]) .scroll-button.end {
        margin-left: 0px;
        margin-top: ${smallPadding};
    }

    slot[name="step"]::slotted(*) {
        flex-grow: 1;
    }

    slot[name="step"]::slotted(:last-child) {
        flex-grow: 0;
    }
`;
