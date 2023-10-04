import { html, ref, slotted } from '@microsoft/fast-element';
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
import { ListOption } from '../../list-option';

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
            vertical-positioning-mode="dynamic"
            horizontal-positioning-mode="dynamic"
            ?hidden="${x => !x.open}"
            @click= "${(x, c) => x.clickHandler(c.event as MouseEvent)}">
            <div
                class="listbox"
                part="listbox"
                role="listbox"
                ?disabled="${x => x.disabled}"
            >
                <slot
                    ${slotted({
        filter: (n: Node) => n instanceof ListOption,
        flatten: true,
        property: 'slottedOptions',
    })}
                ></slot>
            </div>
        </${anchoredRegionTag}>
    </template>
`;
