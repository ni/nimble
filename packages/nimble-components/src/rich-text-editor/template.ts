import { html, ref } from '@microsoft/fast-element';
import type { RichTextEditor } from '.';
import { toolbarTag } from '../toolbar';
import { toggleButtonTag } from '../toggle-button';
import { iconBoldBTag } from '../icons/bold-b';
import { iconItalicITag } from '../icons/italic-i';
import { iconListTag } from '../icons/list';
import { iconNumberListTag } from '../icons/number-list';

// prettier-ignore
export const template = html<RichTextEditor>`
    <template>
        <div class="container">
            <section
                ${ref('editor')}
                class="editor"
                role="textbox"
                aria-multiline="true">
            </section>
            <section class="footer-section" part="footer-section">
                <${toolbarTag}>
                    <${toggleButtonTag}
                        ${ref('boldButton')}
                        appearance="ghost"
                        class="bold"
                        content-hidden
                        slot="start"
                        @click=${x => x.boldButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @keydown=${(x, c) => x.boldButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        Bold
                        <${iconBoldBTag} slot="start"></${iconBoldBTag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag}
                        ${ref('italicsButton')}
                        appearance="ghost"
                        class="italics"
                        content-hidden
                        slot="start"
                        @click=${x => x.italicsButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @keydown=${(x, c) => x.italicsButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        Italics
                        <${iconItalicITag} slot="start"></${iconItalicITag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag}
                        ${ref('bulletListButton')}
                        appearance="ghost"
                        class="bullet-list"
                        content-hidden
                        slot="start"
                        @click=${x => x.bulletListButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @keydown=${(x, c) => x.bulletListButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        Bullet List
                        <${iconListTag} slot="start"></${iconListTag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag}
                        ${ref('numberedListButton')}
                        appearance="ghost"
                        class="numbered-list"
                        content-hidden
                        slot="start"
                        @click=${x => x.numberedListButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
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
        </div>
    </template>
`;
