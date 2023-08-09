import { html, ref, repeat, children, elements } from '@microsoft/fast-element';
import type { RichTextEditor } from '.';
import { toolbarTag } from '../toolbar';
import { toggleButtonTag } from '../toggle-button';
import type { EditorButton } from './models/editor-button';

export const template = html<RichTextEditor>`
    <template>
        <div class="container">
            <section
                ${ref('editor')}
                class="editor"
                role="textbox"
                aria-multiline="true">
            </section>
            <section class="footer-section">
                <${toolbarTag}
                    ${children({
        property: 'toggleButtons',
        filter: elements(toggleButtonTag)
    })}>
                    ${repeat(
        x => x.editorButtons,
        html<EditorButton>`
                        <${toggleButtonTag}
                            appearance="ghost"
                            class=${x => x.class}
                            content-hidden
                            part="button"
                            slot="start"
                            @click=${x => x.clickHandler()}
                            @keydown=${(x, c) => x.keyDownActivateHandler(
        c.event as KeyboardEvent
    )}
                            >
                            ${x => x.iconTemplate}
                            ${
    '' /*
                            Below label will be modified when the label provider PR for the formatting buttons goes in.
                            */
}
                            ${x => x.iconLabel}
                        </${toggleButtonTag}>
                    `
    )}
                </${toolbarTag}>
                <span class="footer-actions" part="footer-actions">
                    <slot name="footer-actions"></slot>
                </span>
            </section>
        </div>
    </template>
`;
