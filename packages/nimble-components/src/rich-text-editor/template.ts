import { html, ref, when } from '@microsoft/fast-element';
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
            <div ${ref('editor')} class="editor"></div>
            ${when(x => x.showFooter, html<RichTextEditor>`
                <section class="footer-section">
                    <${toolbarTag} class="footer-toolbar" >
                        <${toggleButtonTag} ${ref('bold')} @click=${x => x.boldButtonClickHandler()} content-hidden appearance="ghost" slot="start">
                            <${iconBoldBTag} slot="start"></${iconBoldBTag}>
                        </${toggleButtonTag}>
                        <${toggleButtonTag} ${ref('italics')} @click=${x => x.italicButtonClickHandler()} content-hidden appearance="ghost" slot="start">
                            <${iconItalicITag} slot="start"></${iconItalicITag}>
                        </${toggleButtonTag}>
                        <${toggleButtonTag} ${ref('bulletList')} @click=${x => x.bulletListButtonClickHandler()} content-hidden appearance="ghost" slot="start">
                            <${iconListTag} slot="start"></${iconListTag}>
                        </${toggleButtonTag}>
                        <${toggleButtonTag} ${ref('numberedList')} @click=${x => x.numberedListButtonClickHandler()} content-hidden appearance="ghost" slot="start">
                            <${iconNumberListTag} slot="start"></${iconNumberListTag}>
                        </${toggleButtonTag}>
                    </${toolbarTag}>
                    <slot name="footer" class="footer-actions"></slot>
                </section>
            `)}
        </div>
    </template>
`;
