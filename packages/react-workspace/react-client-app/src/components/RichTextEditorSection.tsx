import { useRef } from 'react';
import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleRichTextEditor, type RichTextEditor } from '@ni/nimble-react/rich-text/editor';
import { NimbleRichTextMentionUsers } from '@ni/nimble-react/rich-text-mention/users';
import { NimbleMappingUser } from '@ni/nimble-react/mapping/user';
import { SubContainer } from './SubContainer';

const markdownString = `Supported rich text formatting options:
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

export function RichTextEditorSection(): React.JSX.Element {
    const richTextEditorRef = useRef<RichTextEditor>(null);

    function loadRichTextEditorContent(): void {
        richTextEditorRef.current?.setMarkdown(markdownString);
    }

    return (
        <SubContainer label="Rich Text Editor">
            <div className="rich-text-editor-container">
                <NimbleRichTextEditor
                    ref={richTextEditorRef}
                    className="rich-text-editor"
                    placeholder="Rich text editor"
                >
                    <NimbleRichTextMentionUsers buttonLabel='Mention User' pattern="^user:(.*)">
                        <NimbleMappingUser keyValue='user:1' displayName='John Doe'></NimbleMappingUser>
                        <NimbleMappingUser keyValue='user:2' displayName='Mary Wilson'></NimbleMappingUser>
                    </NimbleRichTextMentionUsers>
                    <NimbleButton slot="footer-actions"
                        onClick={loadRichTextEditorContent}
                    >Load Content</NimbleButton>
                </NimbleRichTextEditor>
            </div>
        </SubContainer>
    );
}
