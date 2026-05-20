import { NimbleRichTextViewer } from '@ni/nimble-react/rich-text/viewer';
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

export function RichTextViewerSection(): React.JSX.Element {
    return (
        <SubContainer label="Rich Text Viewer">
            <div className="rich-text-viewer-container">
                <NimbleRichTextViewer
                    markdown={markdownString}
                >
                    <NimbleRichTextMentionUsers buttonLabel='Mention User' pattern="^user:(.*)">
                        <NimbleMappingUser keyValue='user:1' displayName='John Doe'></NimbleMappingUser>
                        <NimbleMappingUser keyValue='user:2' displayName='Mary Wilson'></NimbleMappingUser>
                    </NimbleRichTextMentionUsers>
                </NimbleRichTextViewer>
            </div>
        </SubContainer>
    );
}
