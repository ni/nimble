import { Component } from '@angular/core';

@Component({
    selector: 'example-rich-text-viewer-section',
    template: `
        <example-sub-container label="Rich Text Viewer">
            <div class="rich-text-viewer-container">
                <nimble-rich-text-viewer [markdown]="markdownString">
                    <nimble-rich-text-mention-users pattern="^user:(.*)">
                        <nimble-mapping-user key="user:1" display-name="John Doe"></nimble-mapping-user>
                        <nimble-mapping-user key="user:2" display-name="Mary Wilson"></nimble-mapping-user>
                    </nimble-rich-text-mention-users>
                </nimble-rich-text-viewer>
            </div>
        </example-sub-container>
    `,
    styles: [`
        @use '@ni/nimble-angular/styles/tokens' as *;
        .rich-text-viewer-container {
            border: $ni-nimble-border-width solid rgba($ni-nimble-action-rgb-partial-color, 0.3);
            padding: $ni-nimble-small-padding;
            width: 350px;
        }
    `],
    standalone: false
})
export class RichTextViewerSectionComponent {
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
}
