import { Component, ViewChild } from '@angular/core';
import { NimbleRichTextEditorDirective } from '@ni/nimble-angular/rich-text/editor';

@Component({
    selector: 'example-rich-text-editor-section',
    template: `
        <example-sub-container label="Rich Text Editor">
            <div class="rich-text-editor-container">
                <nimble-rich-text-editor class="rich-text-editor" placeholder="Rich text editor" #editor>
                    <nimble-rich-text-mention-users pattern="^user:(.*)" button-label="Mention User">
                        <nimble-mapping-user key="user:1" display-name="John Doe"></nimble-mapping-user>
                        <nimble-mapping-user key="user:2" display-name="Mary Wilson"></nimble-mapping-user>
                    </nimble-rich-text-mention-users>
                    <nimble-button slot="footer-actions" (click)="loadRichTextEditorContent()">Load Content</nimble-button>
                </nimble-rich-text-editor>
            </div>
        </example-sub-container>
    `,
    styles: [`
        @use '@ni/nimble-angular/styles/tokens' as *;
        .rich-text-editor-container { padding: $ni-nimble-small-padding; }
        .rich-text-editor { height: 280px; }
    `],
    standalone: false
})
export class RichTextEditorSectionComponent {
    public markdownString = `Supported rich text formatting options:
1. **Bold**
2. *Italics*
3. Numbered lists
    1. Option 1
    2. Option 2
4. Bulleted lists
    * Option 1
    * Option 2
5. Absolute link: <https://nimble.ni.dev/>
6. @mention: <user:1>
`;

    @ViewChild('editor', { read: NimbleRichTextEditorDirective }) private readonly editor: NimbleRichTextEditorDirective;

    public loadRichTextEditorContent(): void {
        this.editor.setMarkdown(this.markdownString);
    }
}
