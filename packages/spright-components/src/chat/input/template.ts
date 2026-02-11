import { html, ref, when } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconPaperPlaneTag } from '@ni/nimble-components/dist/esm/icons/paper-plane';
import { iconStopSquareTag } from '@ni/nimble-components/dist/esm/icons/stop-square';
import type { ChatInput } from '.';

function getAppearanceVariant(x: ChatInput): string | undefined {
    return x.processing ? 'primary' : 'accent';
}

function getDisabled(x: ChatInput): boolean {
    return x.processing ? false : x.disableSendButton;
}

function getTitle(x: ChatInput): string | undefined {
    return x.processing ? x.stopButtonLabel : x.sendButtonLabel;
}

function getLabel(x: ChatInput): string | undefined {
    return x.processing ? x.stopButtonLabel : x.sendButtonLabel;
}

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
    appearance-variant="${getAppearanceVariant}"
    ?disabled=${getDisabled}
    @click=${x => (x.processing ? x.stopButtonClickHandler() : x.sendButtonClickHandler())}
    tabindex="${x => x.tabIndex}"
    title=${getTitle}
    content-hidden
    >
        ${getLabel}
        ${when(
            x => x.processing,
            html`<${iconStopSquareTag} slot="start"></${iconStopSquareTag}>`,
            html`<${iconPaperPlaneTag} slot="start"></${iconPaperPlaneTag}>`
        )}
    </${buttonTag}>
</div>`;
