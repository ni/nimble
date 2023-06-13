/* eslint-disable */
import { html, when } from '@microsoft/fast-element';
import type { RichTextEditor } from '.';
import '@ni/nimble-components/dist/esm/all-components.js';

export const template = html<RichTextEditor>`
    <div id="editor-window" class="editor-window"></div>
    ${when(
        (x) => x.isFocus,
        html<RichTextEditor>`
            <div class="menu-item-wrapper" style="display: ${(x) =>
                x.readOnly ? 'none' : ''}">
                <div class="titptap-menu">
                    <nimble-button appearance="${(x) =>
                        x.isBold
                            ? 'block'
                            : 'ghost'}" id="tiptap-bold" class="tiptap-icons"
                        @click=${(x) => x.boldButtonClickHandler()}>
                        <img src="./assets/bold-icon.svg" width="20px" height="15px" />
                    </nimble-button>
                    <nimble-button appearance="${(x) =>
                        x.isItalic
                            ? 'block'
                            : 'ghost'}" id="tiptap-italic" class="tiptap-icons"
                        @click=${(x) => x.italicButtonClickHandler()}>
                        <img src="./assets/italics-icon.svg" width="20px" height="15px" />
                    </nimble-button>
                    <nimble-button appearance="${(x) =>
                        x.isLink
                            ? 'block'
                            : 'ghost'}" id="tiptap-link" class="tiptap-icons"
                        @click=${(x) => x.openDialogLink()} ?disabled="${(x) =>
            x.linkButtonDisabled}">
                        <img src="./assets/link-icon.svg" width="20px" height="15px" />
                    </nimble-button>
                    <nimble-button appearance="${(x) =>
                        x.isNumberedList
                            ? 'block'
                            : 'ghost'}" id="tiptap-numbered-list"
                        class="tiptap-icons" @click=${(x) =>
                            x.numberedListButtonClickHandler()} ">
                        <img src="./assets/numbered-list-icon.svg" width="20px" height="15px" />
                    </nimble-button>
                    <nimble-button appearance="${(x) =>
                        x.isBulletList
                            ? 'block'
                            : 'ghost'}" id="tiptap-bullet-list"
                        class="tiptap-icons" @click=${(x) =>
                            x.bulletListButtonClickHandler()} ">
                        <img src="./assets/bulleted-list-icon.svg" width="20px" height="15px" />
                    </nimble-button>
                    <nimble-button appearance="${(x) =>
                        x.isStrikeOut
                            ? 'block'
                            : 'ghost'}" id="tiptap-strikethrough"
                        class="tiptap-icons" @click=${(x) =>
                            x.strikethroughButtonClickHandler()} ">
                        <img src="./assets/strike-icon.svg" width="20px" height="15px" />
                    </nimble-button>
                    <nimble-button appearance="${(x) =>
                        x.isUnderline
                            ? 'block'
                            : 'ghost'}" id="tiptap-underline"
                        class="tiptap-icons" @click=${(x) =>
                            x.underlineButtonClickHandler()} ">
                        <img src="./assets/underline-icon.svg" width="20px" height="15px" />
                    </nimble-button>
                    <nimble-button id="upload" class="tiptap-icons" appearance=ghost @click=${(
                        x
                    ) => x.imageUploadButtonClickHandler()}
                        ?disabled="${(x) => x.imageButtonDisabled}">
                        <img src="./assets/image-icon.svg" width="20px" height="15px" />
                    </nimble-button>
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
    <nimble-dialog id="dialog" header-hidden>
        <!-- <h3 slot="title">Insert Link</h3> -->
        <nimble-text-field
            id="urlInput"
            placeholder="Set Link"
            type="url"
            appearance="block"
            error-text="Value is invalid"
            full-bleed
            autofocus
        >
            Set Link
        </nimble-text-field>
        <div slot="footer">
            <nimble-button
                id="dialog-cancel"
                appearance="ghost"
                @click=${(x) => x.dialog.close()}
            >
                Cancel
            </nimble-button>
            <nimble-button
                id="dialog-ok"
                appearance="outline"
                @click=${(x) => x.dialogOkButtonClickHandler()}
            >
                Ok
            </nimble-button>
        </div>
    </nimble-dialog>
    <div>
        <nimble-button
            id="load-markdown"
            class="tiptap-icons"
            @click=${(x) => x.loadMarkdownButtonClickHandler()}
        >
            Load Markdown
        </nimble-button>
        <nimble-button
            id="log-markdown"
            class="tiptap-icons"
            @click=${(x) => x.logMarkdownButtonClickHandler()}
        >
            Log Markdown
        </nimble-button>
    </div>

    <h3>Comments</h3>
`;
