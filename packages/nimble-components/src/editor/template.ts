/* eslint-disable */
import { html, when } from '@microsoft/fast-element';
import type { RichTextEditor } from '.';
import { buttonTag } from '../button/index';
import { dialogTag } from '../dialog';
import { textFieldTag } from '../text-field';

export const template = html<RichTextEditor>`
    <div id="editor-window" class="editor-window"></div>
    ${when(
        (x) => x.isFocus,
        html<RichTextEditor>`
            <div class="menu-item-wrapper" style="display: ${(x) =>
                x.readOnly ? 'none' : ''}">
                <div class="titptap-menu">
                    <${buttonTag}  appearance="${(x) =>
            x.isBold ? 'block' : 'ghost'}" id="tiptap-bold" class="tiptap-icons"
                        @click=${(x) => x.boldButtonClickHandler()}>
                        <img src="./assets/bold-icon.svg" width="20px" height="15px" />
                    </${buttonTag} >
                    <${buttonTag}  appearance="${(x) =>
            x.isItalic
                ? 'block'
                : 'ghost'}" id="tiptap-italic" class="tiptap-icons"
                        @click=${(x) => x.italicButtonClickHandler()}>
                        <img src="./assets/italics-icon.svg" width="20px" height="15px" />
                    </${buttonTag} >
                    <${buttonTag}  appearance="${(x) =>
            x.isLink ? 'block' : 'ghost'}" id="tiptap-link" class="tiptap-icons"
                        @click=${(x) => x.openDialogLink()} ?disabled="${(x) =>
            x.linkButtonDisabled}">
                        <img src="./assets/link-icon.svg" width="20px" height="15px" />
                    </${buttonTag} >
                    <${buttonTag}  appearance="${(x) =>
            x.isNumberedList ? 'block' : 'ghost'}" id="tiptap-numbered-list"
                        class="tiptap-icons" @click=${(x) =>
                            x.numberedListButtonClickHandler()} ">
                        <img src="./assets/numbered-list-icon.svg" width="20px" height="15px" />
                    </${buttonTag} >
                    <${buttonTag}  appearance="${(x) =>
            x.isBulletList ? 'block' : 'ghost'}" id="tiptap-bullet-list"
                        class="tiptap-icons" @click=${(x) =>
                            x.bulletListButtonClickHandler()} ">
                        <img src="./assets/bulleted-list-icon.svg" width="20px" height="15px" />
                    </${buttonTag} >
                    <${buttonTag}  appearance="${(x) =>
            x.isStrikeOut ? 'block' : 'ghost'}" id="tiptap-strikethrough"
                        class="tiptap-icons" @click=${(x) =>
                            x.strikethroughButtonClickHandler()} ">
                        <img src="./assets/strike-icon.svg" width="20px" height="15px" />
                    </${buttonTag} >
                    <${buttonTag}  appearance="${(x) =>
            x.isUnderline ? 'block' : 'ghost'}" id="tiptap-underline"
                        class="tiptap-icons" @click=${(x) =>
                            x.underlineButtonClickHandler()} ">
                        <img src="./assets/underline-icon.svg" width="20px" height="15px" />
                    </${buttonTag} >
                    <${buttonTag}  id="upload" class="tiptap-icons" appearance=ghost @click=${(
            x
        ) => x.imageUploadButtonClickHandler()}
                        ?disabled="${(x) => x.imageButtonDisabled}">
                        <img src="./assets/image-icon.svg" width="20px" height="15px" />
                    </${buttonTag} >
                    <input type="file" style={display:"none"} id="imageUploadInput" accept="image/*" @change=${(
                        x,
                        c
                    ) => x.imageUploadButtonChangeEvent(c.event)}>
                </div>

                <div>
                    <slot class="editor-footer" name="footer"></slot>
                </div>
            </div>
        `
    )}
    <${dialogTag} id="dialog" header-hidden>
        <!-- <h3 slot="title">Insert Link</h3> -->
        <${textFieldTag}
            id="urlInput"
            placeholder="Set Link"
            type="url"
            appearance="block"
            error-text="Value is invalid"
            full-bleed
            autofocus
        >
            Set Link
        </${textFieldTag}>
        <div slot="footer">
            <${buttonTag} 
                id="dialog-cancel"
                appearance="ghost"
                @click=${(x) => x.dialog.close()}
            >
                Cancel
            </${buttonTag} >
            <${buttonTag} 
                id="dialog-ok"
                appearance="outline"
                @click=${(x) => x.dialogOkButtonClickHandler()}
            >
                Ok
            </${buttonTag} >
        </div>
    </${dialogTag}>
    <div>
        <${buttonTag} 
            id="load-markdown"
            class="tiptap-icons"
            @click=${(x) => x.loadMarkdownButtonClickHandler()}
        >
            Load Markdown
        </${buttonTag} >
        <${buttonTag} 
            id="log-markdown"
            class="tiptap-icons"
            @click=${(x) => x.logMarkdownButtonClickHandler()}
        >
            Log Markdown
        </${buttonTag} >
    </div>

    <h3>Comments</h3>
`;
