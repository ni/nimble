import { html, ref } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconPaperPlaneTag } from '@ni/nimble-components/dist/esm/icons/paper-plane';
import type { ChatInput } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<ChatInput>`
<div class="container">
    <textarea
        ${ref('textArea')}
        placeholder="Ask Nigel"
        rows="1"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
    ></textarea>
    <${buttonTag}
        class="send-button"
        appearance="block"
        appearance-variant="accent"
        @click=${x => x.onSubmit()}
    >
        Send
        <${iconPaperPlaneTag} slot="start"><${iconPaperPlaneTag}/>
    </${buttonTag}>    
</div>`;
/* eslint-enable @typescript-eslint/indent */
