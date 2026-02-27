import { html, ref, when } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconPaperPlaneTag } from '@ni/nimble-components/dist/esm/icons/paper-plane';
import { iconStopSquareTag } from '@ni/nimble-components/dist/esm/icons/stop-square';
import { iconExclamationMarkTag } from '@ni/nimble-components/dist/esm/icons/exclamation-mark';
import { errorTextTemplate } from '@ni/nimble-components/dist/esm/patterns/error/template';
import type { ChatInput } from '.';

export const template = html<ChatInput>`
<div class="container">
    <textarea
        ${ref('textArea')}
        placeholder="${x => x.placeholder}"
        rows="1"
        tabindex="${x => x.tabIndex}"
        maxlength="${x => x.maxLength}"
        @keydown="${(x, c) => x.textAreaKeydownHandler(c.event as KeyboardEvent)}"
        @input="${x => x.textAreaInputHandler()}"
    ></textarea>
    <${buttonTag}
        class="action-button"
        appearance="block"
        appearance-variant="${x => (x.processing ? 'primary' : 'accent')}"
        ?disabled=${x => (x.processing ? false : (x.sendDisabled || x.disableSendButton))}
        @click=${x => (x.processing ? x.stopButtonClickHandler() : x.sendButtonClickHandler())}
        tabindex="${x => x.tabIndex}"
        title=${x => (x.processing ? x.stopButtonLabel : x.sendButtonLabel)}
        content-hidden
    >
        ${x => (x.processing ? x.stopButtonLabel : x.sendButtonLabel)}
        ${when(
            x => x.processing,
            html`<${iconStopSquareTag} slot="start"></${iconStopSquareTag}>`,
            html`<${iconPaperPlaneTag} slot="start"></${iconPaperPlaneTag}>`
        )}
    </${buttonTag}>
    <${iconExclamationMarkTag}
        severity="error"
        class="error-icon ${x => (x.scrollbarWidth >= 0 ? 'scrollbar-width-calculated' : '')}"
        style="--ni-private-scrollbar-width: ${x => x.scrollbarWidth}px;"
    ></${iconExclamationMarkTag}>
    ${errorTextTemplate}
</div>`;
