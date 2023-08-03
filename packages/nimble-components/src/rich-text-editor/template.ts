import { html, ref } from '@microsoft/fast-element';
import type { RichTextEditor } from '.';
import { toolbarTag } from '../toolbar';
import { toggleButtonTag } from '../toggle-button';
import { iconBoldBTag } from '../icons/bold-b';
import { iconItalicITag } from '../icons/italic-i';
import { iconNumberListTag } from '../icons/number-list';
import { iconListTag } from '../icons/list';

export const template = html<RichTextEditor>`
    <template>
        <div class="container">
            <section ${ref('editor')} class="editor"></section>
            <section class="footer-section">
                <${toolbarTag}>
                    <${toggleButtonTag} ${ref('bold')}
                        content-hidden
                        appearance="ghost"
                        slot="start"
                        class="bold"
                        @click=${x => x.boldButtonClickHandler()}
                        @keydown=${(x, c) => x.boldButtonKeyDownHandler(
        c.event as KeyboardEvent
    )}
                        >
                        <${iconBoldBTag} slot="start"></${iconBoldBTag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag} ${ref('italics')}
                        content-hidden
                        appearance="ghost"
                        slot="start"
                        class="italics"
                        @click=${x => x.italicsButtonClickHandler()}
                        @keydown=${(x, c) => x.italicsButtonKeyDownHandler(
        c.event as KeyboardEvent
    )}
                        >
                        <${iconItalicITag} slot="start"></${iconItalicITag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag} ${ref('bulletList')}
                        content-hidden
                        appearance="ghost"
                        slot="start"
                        class="bullet-list"
                        @click=${x => x.bulletListButtonClickHandler()}
                        @keydown=${(x, c) => x.bulletListButtonKeyDownHandler(
        c.event as KeyboardEvent
    )}
                        >
                        <${iconListTag} slot="start"></${iconListTag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag} ${ref('numberedList')}
                        content-hidden
                        appearance="ghost"
                        slot="start"
                        class="numbered-list"
                        @click=${x => x.numberedListButtonClickHandler()}
                        @keydown=${(x, c) => x.numberedListButtonKeyDownHandler(
        c.event as KeyboardEvent
    )}
                        >
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
