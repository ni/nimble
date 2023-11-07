import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../../../../utilities/tests/storybook';
import { richTextMentionUsersViewTag } from '..';
import {
    bodyFont,
    bodyFontColor
} from '../../../../../theme-provider/design-tokens';

interface RichTextMentionUsersViewArgs {
    mentionHref: string;
    mentionLabel: string;
}

const richTextMentionUsersViewDescription = 'The rich text mention users view component is used to render the at(@) mentioned users in the nimble rich text editor and nimble rich text viewer.';

const metadata: Meta<RichTextMentionUsersViewArgs> = {
    title: 'Tests/Rich Text Mention: User',
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
    <style class='code-hide'>
        .mention-container {
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
        }
    </style>
    <p class="mention-container">
        Tagging
        <${richTextMentionUsersViewTag} mention-href="${x => x.mentionHref}" mention-label="${x => x.mentionLabel}">
        </${richTextMentionUsersViewTag}>
        in a comment
    </p>
    `),
    argTypes: {
        mentionHref: {
            description:
                'User URL containing a unique user ID of the mentioned user'
        },
        mentionLabel: {
            description: 'Stores the value of the rendering label'
        }
    },
    args: {
        mentionHref: 'users:1',
        mentionLabel: 'John Doe'
    }
};

export default metadata;

export const richTextMentionUsersView: StoryObj<RichTextMentionUsersViewArgs> = {};
