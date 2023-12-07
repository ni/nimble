import { children, elements, html, ref, repeat } from '@microsoft/fast-element';
import type { RichTextEditor } from '.';
import { toolbarTag } from '../../toolbar';
import { toggleButtonTag } from '../../toggle-button';
import { iconBoldBTag } from '../../icons/bold-b';
import { iconItalicITag } from '../../icons/italic-i';
import { iconListTag } from '../../icons/list';
import { iconNumberListTag } from '../../icons/number-list';
import {
    richTextToggleBoldLabel,
    richTextToggleItalicsLabel,
    richTextToggleBulletedListLabel,
    richTextToggleNumberedListLabel
} from '../../label-provider/rich-text/label-tokens';
import { errorTextTemplate } from '../../patterns/error/template';
import { iconExclamationMarkTag } from '../../icons/exclamation-mark';
import { richTextMentionListBoxTag } from '../mention-list-box';
import type { MentionExtensionConfiguration } from '../models/mention-extension-configuration';
import { buttonTag } from '../../button';
import type { MappingConfig } from '../../rich-text-mention/base/models/mapping-config';
import { listOptionTag } from '../../list-option';

// prettier-ignore
export const template = html<RichTextEditor>`
    <template ${children({ property: 'childItems', filter: elements() })}>
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
                        ?disabled="${x => x.disabled}"
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
                        ?disabled="${x => x.disabled}"
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
                        ?disabled="${x => x.disabled}"
                        slot="start"
                        title=${x => richTextToggleNumberedListLabel.getValueFor(x)}
                        @click=${x => x.numberedListButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @keydown=${(x, c) => x.numberedListButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        ${x => richTextToggleNumberedListLabel.getValueFor(x)}
                        <${iconNumberListTag} slot="start"></${iconNumberListTag}>
                    </${toggleButtonTag}>
                    ${repeat(
        x => Array.from(x.getMentionExtensionConfig()),
        html<MentionExtensionConfiguration, RichTextEditor>`<${buttonTag}
                        appearance="ghost"
                        content-hidden
                        ?disabled="${(_x, c) => c.parent.disabled}"
                        slot="start"
                        title=${x => x.label}
                        @click=${(x, c) => c.parent.mentionButtonClick(x.character)}
                        @keydown=${(x, c) => c.parent.mentionButtonKeyDown(c.event as KeyboardEvent, x.character)}
                    >
                        ${x => x.label}
                        ${x => x.iconTemplate}
                    </${buttonTag}>`
    )}
                </${toolbarTag}>
                <span class="footer-actions" part="footer-actions">
                    <slot name="footer-actions"></slot>
                </span>
            </section>
            ${errorTextTemplate}
        </div>
        <${richTextMentionListBoxTag}
            ${ref('mentionListBox')}
            >
            ${repeat(
        x => Array.from(x.activeMappingConfigs?.values() ?? []),
        html<MappingConfig>`<${listOptionTag} value="${x => x.mentionHref}">${x => x.displayName}</${listOptionTag}>`,

        { recycle: false }
    )}
        </${richTextMentionListBoxTag}>
    </template>
`;
