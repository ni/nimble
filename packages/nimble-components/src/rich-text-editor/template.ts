import { html, ref } from '@microsoft/fast-element';
import type { RichTextEditor } from '.';
import { toolbarTag } from '../toolbar';
import { toggleButtonTag } from '../toggle-button';
import { iconBoldBTag } from '../icons/bold-b';
import { iconItalicITag } from '../icons/italic-i';
import { iconListTag } from '../icons/list';
import { iconNumberListTag } from '../icons/number-list';
import {
    richTextToggleBoldLabel,
    richTextToggleItalicsLabel,
    richTextToggleBulletedListLabel,
    richTextToggleNumberedListLabel
} from '../label-provider/rich-text/label-tokens';

// prettier-ignore
export const template = html<RichTextEditor>`
    <template>
        <div class="container">
            <section ${ref('editorContainer')} class="editor-container">
            </section>
            <section class="footer-section" part="footer-section">
                <${toolbarTag}>
                    <${toggleButtonTag}
                        ${ref('boldButton')}
                        appearance="ghost"
                        content-hidden
                        slot="start"
                        title=${x => richTextToggleBoldLabel.getValueFor(x)}
                        @click=${x => x.boldButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @keydown=${(x, c) => x.boldButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        ${x => richTextToggleBoldLabel.getValueFor(x)}
                        <${iconBoldBTag} slot="start"></${iconBoldBTag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag}
                        ${ref('italicsButton')}
                        appearance="ghost"
                        content-hidden
                        slot="start"
                        title=${x => richTextToggleItalicsLabel.getValueFor(x)}
                        @click=${x => x.italicsButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @keydown=${(x, c) => x.italicsButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        ${x => richTextToggleItalicsLabel.getValueFor(x)}
                        <${iconItalicITag} slot="start"></${iconItalicITag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag}
                        ${ref('bulletListButton')}
                        appearance="ghost"
                        content-hidden
                        slot="start"
                        title=${x => richTextToggleBulletedListLabel.getValueFor(x)}
                        @click=${x => x.bulletListButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @keydown=${(x, c) => x.bulletListButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        ${x => richTextToggleBulletedListLabel.getValueFor(x)}
                        <${iconListTag} slot="start"></${iconListTag}>
                    </${toggleButtonTag}>
                    <${toggleButtonTag}
                        ${ref('numberedListButton')}
                        appearance="ghost"
                        content-hidden
                        slot="start"
                        title=${x => richTextToggleNumberedListLabel.getValueFor(x)}
                        @click=${x => x.numberedListButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @keydown=${(x, c) => x.numberedListButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        ${x => richTextToggleNumberedListLabel.getValueFor(x)}
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
