import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { hiddenWrapper } from '../../../utilities/tests/hidden';

const patternDescription = `A regex used for detecting, validating, and extracting information from mentions in the rich text markdown string.

The mention view will be rendered in the following ways based on specific inputs:

* As \`@display-name\` if the regex pattern matches, a user mapping element is found for the key, and the user mapping also has a \`display-name\`.
* As key portion of the mention link if the regex pattern matches, and the regex has a group, but no user mapping element is found. For example, to render \`@123\` for the markdown input \`<user:123>\`, the pattern should include a group regex like \`user:(.*)\` to extract the specific portion from the markdown input if the user mapping element is not found.
* Otherwise, as plain text or URL, depending on whether the mention is HTTP/HTTPS.
`;

const mappingUserValidityDescription = `Readonly object of boolean values that represents the validity states that the mention's configuration can be in.
The object's type is \`RichTextMentionValidity\`, and it contains the following boolean properties:

-   \`unsupportedMappingType\`: \`true\` when the mention contains a mapping element other than \`nimble-mapping-user\`
-   \`duplicateMappingMentionHref\`: \`true\` when multiple mappings have the same \`key\` value
-   \`missingMentionHrefValue\`: \`true\` when a mapping has no \`key\` value
-   \`mentionHrefNotValidUrl\`: \`true\` when any one of the \`key\` is not a valid URL i.e. throws error if \`new URL(key)\`
-   \`mentionHrefDoesNotMatchPattern\`: \`true\` when any one of the \`key\` does not match the \`pattern\`
-   \`missingPatternAttribute\`: \`true\` when a configuration has no \`pattern\` value
-   \`unsupportedPatternValue\`: \`true\` when the \`pattern\` is not a valid Regex
-   \`missingDisplayNameValue\`: \`true\` when a mapping has no \`display-name\` value
`;

const metadata: Meta = {
    title: 'Internal/Rich Text Mention Users',
    parameters: {
        docs: {
            description: {
                component:
                    'Add a `nimble-rich-text-mention-users` element as a child of the rich text components to enable support for `@mention`. Add `nimble-mapping-mention-user` elements as its children to specify the users available to be mentioned.'
            }
        }
    }
};

export default metadata;

export const richTextMentionUsers: StoryObj = {
    render: createUserSelectedThemeStory(hiddenWrapper(html`<style></style>`)),
    argTypes: {
        pattern: {
            description: patternDescription,
            control: { type: 'none' }
        },
        checkValidity: {
            name: 'checkValidity()',
            description:
                'Returns `true` if the mention configuration is valid, otherwise `false`.'
        },
        validity: {
            description: mappingUserValidityDescription
        }
    }
};
