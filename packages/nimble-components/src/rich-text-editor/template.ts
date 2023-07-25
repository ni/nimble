import { html, ref } from '@microsoft/fast-element';
import type { RichTextEditor } from '.';
import { toolbarTag } from '../toolbar';
import { toggleButtonTag } from '../toggle-button';
import { iconBoldBTag } from '../icons/bold-b';
import { iconItalicITag } from '../icons/italic-i';
import { iconNumberListTag } from '../icons/number-list';
import { iconListTag } from '../icons/list';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';

export const template = html<RichTextEditor>`
    <template>
        <div class="container">
            <div ${ref('editor')} class="editor"></div>
            <${iconExclamationMarkTag}
                severity="error"
                class="error-icon"
                style="--ni-private-scrollbar-width: 5px;"
            ></${iconExclamationMarkTag}>
            <section class="footer-section" style="--ni-private-footer-visibility: ${x => ((x.footerHidden) ? 'hidden' : '')}">
                <${toolbarTag} ?disabled="${x => x.disabled}" class="footer-toolbar" >
                    <${toggleButtonTag} ?disabled="${x => x.disabled}" ${ref('bold')} @click=${x => x.boldButtonClickHandler()} content-hidden appearance="ghost" slot="start">
                        <${iconBoldBTag} slot="start"></${iconBoldBTag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag} ?disabled="${x => x.disabled}" ${ref('italics')} @click=${x => x.italicButtonClickHandler()} content-hidden appearance="ghost" slot="start">
                        <${iconItalicITag} slot="start"></${iconItalicITag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag} ?disabled="${x => x.disabled}" ${ref('bulletList')} @click=${x => x.bulletListButtonClickHandler()} content-hidden appearance="ghost" slot="start">
                        <${iconListTag} slot="start"></${iconListTag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag} ?disabled="${x => x.disabled}" ${ref('numberedList')} @click=${x => x.numberedListButtonClickHandler()} content-hidden appearance="ghost" slot="start">
                        <${iconNumberListTag} slot="start"></${iconNumberListTag}>
                    </${toggleButtonTag}>
                </${toolbarTag}>
                <slot name="footer" class="footer-actions"></slot>
            </section>
        </div>
    </template>
`;
