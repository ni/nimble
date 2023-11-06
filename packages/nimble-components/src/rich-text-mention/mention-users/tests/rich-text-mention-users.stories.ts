import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { createUserSelectedThemeStory, incubatingWarning } from '../../../utilities/tests/storybook';
import { richTextMentionUsersTag } from '..';
import { mappingMentionUserTag } from '../../../mapping/mention-user';
import { richTextEditorTag } from '../../../rich-text/editor';

const metadata: Meta = {
    title: 'Incubating/Rich Text: Mention Users',
    tags: ['autodocs'],
    decorators: [withActions],
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
  ${incubatingWarning({
        componentName: 'rich text mention users',
        statusLink: 'https://github.com/ni/nimble/issues/1288'
    })}
     <${richTextEditorTag} style="height: 160px;">
        <${richTextMentionUsersTag} pattern="http://users/.*">
            <${mappingMentionUserTag} mention-href="http://users/user-id-1" display-name="John Doe"></${mappingMentionUserTag}>
            <${mappingMentionUserTag} mention-href="http://users/user-id-2" display-name="Alice Smith"></${mappingMentionUserTag}>
            <${mappingMentionUserTag} mention-href="http://users/user-id-3" display-name="Bob Jones"></${mappingMentionUserTag}>
        </${richTextMentionUsersTag}>
    </${richTextEditorTag} style="height: 160px;">
  `),

};

export default metadata;

export const richTextEditor: StoryObj = {};