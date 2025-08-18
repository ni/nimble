import { html, ref, slotted, when } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconPaperPlaneTag } from '@ni/nimble-components/dist/esm/icons/paper-plane';
import { iconStopSquareTag } from '@ni/nimble-components/dist/esm/icons/stop-square';
import type { ChatInput } from '.';
import {
    chatInputSendLabel,
    chatInputStopLabel
} from '../../label-provider/chat/label-tokens';

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
        ${when(x => !x.processing, html<ChatInput>`
            <${buttonTag}
                class="send-button"
                appearance="block"
                appearance-variant="accent"
                ?disabled=${x => x.disableSendButton}
                @click=${x => x.sendButtonClickHandler()}
                tabindex="${x => x.tabIndex}"
                content-hidden
            >
                ${x => chatInputSendLabel.getValueFor(x)}
                <${iconPaperPlaneTag} slot="start"><${iconPaperPlaneTag}/>
            </${buttonTag}>
        `)}
        ${when(x => x.processing, html<ChatInput>`
            <${buttonTag}
                class="stop-button"
                appearance="block"
                appearance-variant="accent"
                @click=${x => x.stopButtonClickHandler()}
                tabindex="${x => x.tabIndex}"
                content-hidden
            >
                ${x => chatInputStopLabel.getValueFor(x)}
                <${iconStopSquareTag} slot="start"></${iconStopSquareTag}>
            </${buttonTag}>            
        `)}
    </div>
</div>`;
/* eslint-enable @typescript-eslint/indent */
