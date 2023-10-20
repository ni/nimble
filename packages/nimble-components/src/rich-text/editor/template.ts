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
import { anchoredRegionTag } from '../../anchored-region';
import { buttonTag } from '../../button';
import { listOptionTag } from '../../list-option';
import type { UserInfo } from './enum-text';
import { listBoxTag } from './mention-popup copy';

// prettier-ignore
export const template = html<RichTextEditor>`
    <template
    ${children({ property: 'childItems', filter: elements() })}
    >
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
                    <${buttonTag}
                        ${ref('atMentionButton')}
                        appearance="ghost"
                        ?disabled="${x => x.disabled}"
                        slot="start"
                        @click=${x => x.atMentionButtonClick()}
                        @change=${(x, c) => x.stopEventPropagation(c.event)}
                        @keydown=${(x, c) => x.atMentionButtonKeyDown(c.event as KeyboardEvent)}
                    >
                        <!-- Icon yet to be added here -->
                        @
                    </${buttonTag}>
                </${toolbarTag}>
                <span class="footer-actions" part="footer-actions">
                    <slot name="footer-actions"></slot>
                </span>
            </section>
            ${errorTextTemplate}
        </div>
        <${anchoredRegionTag}
            ${ref('region')}
            class="anchored-region"
            auto-update-mode="auto"
            vertical-positioning-mode="locktodefault"
            horizontal-positioning-mode="locktodefault"
            vertical-default-position="bottom"
            ?hidden="${x => !x.open}"
            >
            <${listBoxTag}
            ${ref('listBox')} 
            >    
            ${repeat(x => x.userList, html<UserInfo>`
                    <${listOptionTag} value="${x => x.key}">${x => x.value}</${listOptionTag}>
                    `)}
    </${listBoxTag}>
        </${anchoredRegionTag}>
    </template>
`;
