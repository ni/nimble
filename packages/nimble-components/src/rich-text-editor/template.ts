import { html, ref } from '@microsoft/fast-element';
import type { RichTextEditor } from '.';
import { toolbarTag } from '../toolbar';
import { toggleButtonTag } from '../toggle-button';
import { iconBoldBTag } from '../icons/bold-b';
import { iconItalicITag } from '../icons/italic-i';
import { iconListTag } from '../icons/list';
import { iconNumberListTag } from '../icons/number-list';
import { errorTextTemplate } from '../patterns/error/template';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';

// prettier-ignore
export const template = html<RichTextEditor>`
    <template>
        <div class="container">
            <section ${ref('editorContainer')} class="editor-container">
            </section>
            <${iconExclamationMarkTag}
                severity="error"
                class="error-icon ${x => (x.scrollbarWidth >= 0 ? 'scrollbar-width-calculated' : '')}"
                style="--ni-private-rich-text-editor-scrollbar-width: ${x => x.scrollbarWidth}px;"
            ></${iconExclamationMarkTag}>
            <section class="footer-section">
                <${toolbarTag}>
                    <${toggleButtonTag}
                        ${ref('boldButton')}
                        appearance="ghost"
                        content-hidden
                        ?disabled="${x => x.disabled}"
                        slot="start"
                        title="Bold"
                        @click=${x => x.boldButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @touchstart=${(x, c) => x.boldButtonTouchStart(c.event)}
                        @keydown=${(x, c) => x.boldButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        Bold
                        <${iconBoldBTag} slot="start"></${iconBoldBTag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag}
                        ${ref('italicsButton')}
                        appearance="ghost"
                        content-hidden
                        ?disabled="${x => x.disabled}"
                        slot="start"
                        title="Italics"
                        @click=${x => x.italicsButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @touchstart=${(x, c) => x.italicsButtonTouchStart(c.event)}
                        @keydown=${(x, c) => x.italicsButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        Italics
                        <${iconItalicITag} slot="start"></${iconItalicITag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag}
                        ${ref('bulletListButton')}
                        appearance="ghost"
                        content-hidden
                        ?disabled="${x => x.disabled}"
                        slot="start"
                        title="Bullet List"
                        @click=${x => x.bulletListButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @touchstart=${(x, c) => x.bulletListTouchStart(c.event)}
                        @keydown=${(x, c) => x.bulletListButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        Bullet List
                        <${iconListTag} slot="start"></${iconListTag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag}
                        ${ref('numberedListButton')}
                        appearance="ghost"
                        content-hidden
                        ?disabled="${x => x.disabled}"
                        slot="start"
                        title="Numbered List"
                        @click=${x => x.numberedListButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @touchstart=${(x, c) => x.numberedListTouchStart(c.event)}
                        @keydown=${(x, c) => x.numberedListButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        Numbered List
                        <${iconNumberListTag} slot="start"></${iconNumberListTag}>
                    </${toggleButtonTag}>
                </${toolbarTag}>
                <span class="footer-actions" part="footer-actions">
                    <slot name="footer-actions"></slot>
                </span>
            </section>
            ${errorTextTemplate}
        </div>
    </template>
`;
