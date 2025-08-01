import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { richTextMentionUsersTag } from '@ni/nimble-components/dist/esm/rich-text-mention/users';
import { mappingUserTag } from '@ni/nimble-components/dist/esm/mapping/user';
import { mappingTextTag } from '@ni/nimble-components/dist/esm/mapping/text';
import { hiddenWrapper } from '../../../utilities/hidden';
import {
    apiCategory,
    checkValidityDescription,
    createUserSelectedThemeStory,
    validityDescription
} from '../../../utilities/storybook';

const patternDescription = `A regex used for detecting, validating, and extracting information from mentions in the rich text markdown string.

The mention view will be rendered in the following ways based on specific inputs:

* As \`@display-name\` if the regex pattern matches, a user mapping element is found for the key, and the user mapping also has a \`display-name\`.
* As key portion of the mention link if the regex pattern matches, and the regex has a group, but no user mapping element is found. For example, to render \`@123\` for the markdown input \`<user:123>\`, the pattern should include a group regex like \`user:(.*)\` to extract the specific portion from the markdown input if the user mapping element is not found.
* Otherwise, as plain text or URL, depending on whether the mention is HTTP/HTTPS.
`;

const mentionUpdateEventDescription = `Event emitted on following actions:

- Whenever the \`@\` character is entered into the editor
- When the user types any character after \`@\` into the editor

This emits with the \`eventData\` containing the current text that is added after the \`@\` character and before the current position of the
    text cursor.

For the viewer, this event will never be emitted.
`;

const metadata: Meta = {
    title: 'Internal/Rich Text Mention Users',
    parameters: {
        docs: {
            description: {
                component: `Add a \`${richTextMentionUsersTag}\` element as a child of the rich text components to enable support for \`@mention\`. Add \`${mappingUserTag}\` elements as its children to specify the users available to be mentioned.
                    
These components facilitate the parsing of input markdown into a mention node that displays a user's name. For the editor component they are also used to populate the list of user names in the mention dropdown.`
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
            control: false,
            table: { category: apiCategory.attributes }
        },
        checkValidity: {
            name: 'checkValidity()',
            description: checkValidityDescription({
                componentName: 'rich text mention users'
            }),
            table: { category: apiCategory.methods }
        },
        validity: {
            description: validityDescription({
                colloquialName: 'mention',
                validityObjectType: 'RichTextMentionValidity',
                validityFlags: [
                    {
                        flagName: 'unsupportedMappingType',
                        description:
                            '`true` when the mention contains a mapping element other than `mapping-user`'
                    },
                    {
                        flagName: 'duplicateMappingMentionHref',
                        description:
                            '`true` when multiple mappings have the same `key` value'
                    },
                    {
                        flagName: 'missingMentionHrefValue',
                        description: '`true` when a mapping has no `key` value'
                    },
                    {
                        flagName: 'mentionHrefNotValidUrl',
                        description:
                            '`true` when any one of the `key` is not a valid URL i.e. throws error if `new URL(key)`'
                    },
                    {
                        flagName: 'mentionHrefDoesNotMatchPattern',
                        description:
                            '`true` when any one of the `key` does not match the `pattern`'
                    },
                    {
                        flagName: 'missingPatternAttribute',
                        description:
                            '`true` when a configuration has no `pattern` value'
                    },
                    {
                        flagName: 'unsupportedPatternValue',
                        description:
                            '`true` when the `pattern` is not a valid Regex'
                    },
                    {
                        flagName: 'missingDisplayNameValue',
                        description:
                            '`true` when a mapping has no `display-name` value'
                    }
                ]
            }),
            table: { category: apiCategory.nonAttributeProperties }
        },
        mentionUpdate: {
            name: 'mention-update',
            description: mentionUpdateEventDescription,
            table: { category: apiCategory.events }
        },
        buttonLabel: {
            name: 'button-label',
            description:
                'Label and title text for the mention button in the footer toolbar.',
            table: { category: apiCategory.attributes }
        },
        content: {
            name: 'default',
            description: `Configure how users are displayed by adding \`${mappingTextTag}\` elements as content. Ensure that each user mentioned in the markdown input has a corresponding user mapping.

For the rich text editor, the user mappings are used to populate the mention dropdown. Update the mention elements dynamically by listening to the \`mention-update\` event and filtering the user mappings based on the current text input.
It is recommended to limit the number of users displayed to 50 or fewer.

For more details, see **Guidance for filtering users**.`,
            table: { category: apiCategory.slots }
        }
    }
};
