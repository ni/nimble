import { html, ref } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconPaperPlaneTag } from '@ni/nimble-components/dist/esm/icons/paper-plane';
import { iconExclamationMarkTag } from '@ni/nimble-components/dist/esm/icons/exclamation-mark';
import { errorTextTemplate } from '@ni/nimble-components/dist/esm/patterns/error/template';
import type { ChatInput } from '.';

export const template = html<ChatInput>`
<div class="container">
    <div class="input-container">
        <textarea
            ${ref('textArea')}
            placeholder="${x => x.placeholder}"
            rows="1"
            tabindex="${x => x.tabIndex}"
            maxlength="${x => x.maxLength}"
            @keydown="${(x, c) => x.textAreaKeydownHandler(c.event as KeyboardEvent)}"
            @input="${x => x.textAreaInputHandler()}"
        ></textarea>
        <${iconExclamationMarkTag}
            severity="error"
            class="error-icon scrollbar-width-calculated"
            style="--ni-private-scrollbar-width: ${x => (x.scrollbarWidth >= 0 ? x.scrollbarWidth : 0)}px;"
        ></${iconExclamationMarkTag}>
    </div>
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
        <${iconPaperPlaneTag} slot="start"><${iconPaperPlaneTag}/>
    </${buttonTag}>    
    ${errorTextTemplate}
</div>`;
