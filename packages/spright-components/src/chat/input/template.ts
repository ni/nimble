import { html, ref, slotted } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconPaperPlaneTag } from '@ni/nimble-components/dist/esm/icons/paper-plane';
import type { ChatInput } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatInput>`
<div class="container">
    <div class="attachments ${x => (x.hasAttachments ? '' : 'empty')}">
        <slot
            name="attachments"
            ${slotted({ property: 'attachmentContent' })}
        ></slot>
    </div>
    <textarea
        ${ref('textArea')}
        placeholder="${x => x.placeholder}"
        rows="1"
        tabindex="${x => x.tabIndex}"
        @keydown="${(x, c) => x.textAreaKeydownHandler(c.event as KeyboardEvent)}"
        @input="${x => x.textAreaInputHandler()}"
    ></textarea>
    <div class="footer">
        <slot name="start"></slot>
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
    </div>
</div>`;
/* eslint-enable @typescript-eslint/indent */
