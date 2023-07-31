import { html, ref } from '@microsoft/fast-element';
import type { RichTextEditor } from '.';
import { toolbarTag } from '../toolbar';
import { toggleButtonTag } from '../toggle-button';
import { iconBoldBTag } from '../icons/bold-b';
import { iconItalicITag } from '../icons/italic-i';
import { iconNumberListTag } from '../icons/number-list';
import { iconListTag } from '../icons/list';
import { iconExclamationMarkTag } from '../icons/exclamation-mark';
import { errorTextTemplate } from '../patterns/error/template';

export const template = html<RichTextEditor>`
    <template>
        <div class="container">
            <section ${ref('editor')} class="editor"></section>
            <${iconExclamationMarkTag}
                severity="error"
                class="error-icon"
                style="--ni-private-scrollbar-width: 5px;"
            ></${iconExclamationMarkTag}>
            <section 
                class="footer-section"
                style="--ni-private-footer-visibility: ${x => ((x.footerHidden) ? 'hidden' : 'visible')}">
                <${toolbarTag}
                    ?disabled="${x => x.disabled}"
                    class="footer-toolbar">
                    <${toggleButtonTag} ${ref('bold')}
                        content-hidden
                        appearance="ghost"
                        slot="start"
                        ?disabled="${x => x.disabled}"
                        @click=${x => x.boldButtonClickHandler()}>
                        <${iconBoldBTag} slot="start"></${iconBoldBTag}>
                        Bold
                    </${toggleButtonTag}>
                    <${toggleButtonTag} ${ref('italics')}
                        content-hidden
                        appearance="ghost"
                        slot="start"
                        ?disabled="${x => x.disabled}"
                        @click=${x => x.italicButtonClickHandler()}>
                        <${iconItalicITag} slot="start"></${iconItalicITag}>
                        Italics
                    </${toggleButtonTag}>
                    <${toggleButtonTag} ${ref('bulletList')}
                        content-hidden
                        appearance="ghost"
                        slot="start"
                        ?disabled="${x => x.disabled}"
                        @click=${x => x.bulletListButtonClickHandler()}>
                        <${iconListTag} slot="start"></${iconListTag}>
                        Bullet list
                    </${toggleButtonTag}>
                    <${toggleButtonTag} ${ref('numberedList')}
                        content-hidden
                        appearance="ghost"
                        slot="start"
                        ?disabled="${x => x.disabled}"
                        @click=${x => x.numberedListButtonClickHandler()}>
                        <${iconNumberListTag} slot="start"></${iconNumberListTag}>
                        Numbered list
                    </${toggleButtonTag}>
                </${toolbarTag}>
                <span class="footer-actions" part="footer-actions">
                    <slot name="footer-actions"></slot>
                </span>
            </section>
        </div>
        ${errorTextTemplate}
    </template>
`;
