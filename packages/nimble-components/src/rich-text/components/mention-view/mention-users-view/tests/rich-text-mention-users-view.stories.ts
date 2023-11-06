import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../../../../utilities/tests/storybook';
import { mentionUsersViewTag } from '..';

interface RichTextMentionUsersViewArgs {
    mentionHref: string;
    mentionLabel: string;
}

const richTextMentionUsersViewDescription = 'The rich text mention users view component is used to render the at(@) mentioned users in the nimble rich text editor and nimble rich text viewer.';

const metadata: Meta<RichTextMentionUsersViewArgs> = {
    title: 'Incubating/Rich Text View: Mention Users Node',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: richTextMentionUsersViewDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
    ${incubatingWarning({
        componentName: 'rich text mention users view',
        statusLink: 'https://github.com/ni/nimble/issues/1288'
    })}
    <${mentionUsersViewTag}
        mention-href="${x => x.mentionHref}"
        mention-label="${x => x.mentionLabel}"
    >
        @John Doe
    </${mentionUsersViewTag}>
    `),
    argTypes: {
        mentionHref: {
            description:
                'User URL containing a user ID of the mentioned user'
        },
        mentionLabel: {
            description:
                'Stores the value of the rendering label'
        }
    },
    args: {
        mentionHref: 'users:1',
        mentionLabel: 'John Doe'
    }
};

export default metadata;

export const richTextMentionUsersView: StoryObj<RichTextMentionUsersViewArgs> = {};
