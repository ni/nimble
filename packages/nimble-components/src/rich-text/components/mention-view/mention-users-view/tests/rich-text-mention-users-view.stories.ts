import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../../../../utilities/tests/storybook';
import { mentionUsersViewTag } from '..';
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
    <style class='code-hide'>
        .mention-container {
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
        }
    </style>
    <p class="mention-container">
        Tagging
        <${mentionUsersViewTag} mention-href="${x => x.mentionHref}" mention-label="${x => x.mentionLabel}">
            @${x => x.mentionLabel}
        </${mentionUsersViewTag}>
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
