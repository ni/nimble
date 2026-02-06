import { html, ref, when } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconPaperPlaneTag } from '@ni/nimble-components/dist/esm/icons/paper-plane';
import { iconStopSquareTag } from '@ni/nimble-components/dist/esm/icons/stop-square';
import type { ChatInput } from '.';

export const template = html<ChatInput>`
<div class="container">
    <textarea
        ${ref('textArea')}
        placeholder="${x => x.placeholder}"
        rows="1"
        tabindex="${x => x.tabIndex}"
        @keydown="${(x, c) => x.textAreaKeydownHandler(c.event as KeyboardEvent)}"
        @input="${x => x.textAreaInputHandler()}"
    ></textarea>
    ${when(x => !x.processing, html<ChatInput>`
        <${buttonTag}
            class="send-button"
            appearance="block"
            appearance-variant="accent"
            ?disabled=${x => x.disableSendButton}
            @click=${x => x.sendButtonClickHandler()}
            tabindex="${x => x.tabIndex}"
            title=${x => x.sendButtonLabel}
            content-hidden
        >
            ${x => x.sendButtonLabel}
            <${iconPaperPlaneTag} slot="start"></${iconPaperPlaneTag}>
        </${buttonTag}>
    `)}
    ${when(x => x.processing, html<ChatInput>`
        <${buttonTag}
            class="stop-button"
            appearance="block"
            @click=${x => x.stopButtonClickHandler()}
            tabindex="${x => x.tabIndex}"
            title=${x => x.stopButtonLabel}
            content-hidden
        >
            ${x => x.stopButtonLabel}
            <${iconStopSquareTag} slot="start"></${iconStopSquareTag}>
        </${buttonTag}>
    `)}  
</div>`;
