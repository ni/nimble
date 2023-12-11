import type { RichTextEditor } from '..';
import { type MappingUser, mappingUserTag } from '../../../mapping/user';
import { richTextMentionTestTag } from '../../../rich-text-mention/base/tests/rich-text-mention.fixtures';
import {
    richTextMentionUsersTag,
    type RichTextMentionUsers
} from '../../../rich-text-mention/users';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import type {
    MappingConfiguration,
    UserMentionElements,
    TestMentionElements
} from './types';

export async function appendUserMentionConfiguration(
    element: RichTextEditor,
    mappings?: MappingConfiguration[]
): Promise<UserMentionElements> {
    const userMentionElement = document.createElement(
        richTextMentionUsersTag
    ) as RichTextMentionUsers;
    userMentionElement.pattern = '^user:(.*)';
    const mappingElements: MappingUser[] = [];
    mappings?.forEach(mapping => {
        const mappingUser = document.createElement(
            mappingUserTag
        ) as MappingUser;
        mappingUser.key = mapping.key ?? '';
        mappingUser.displayName = mapping.displayName;
        userMentionElement.appendChild(mappingUser);
        mappingElements.push(mappingUser);
    });
    element.appendChild(userMentionElement);
    await waitForUpdatesAsync();
    return {
        userMentionElement,
        mappingElements
    };
}

export async function appendTestMentionConfiguration(
    element: RichTextEditor,
    mappings?: MappingConfiguration[]
): Promise<TestMentionElements> {
    const testMentionElement = document.createElement(richTextMentionTestTag);
    testMentionElement.pattern = '^test:(.*)';
    const mappingElements: MappingUser[] = [];
    mappings?.forEach(mapping => {
        const mappingUser = document.createElement(
            mappingUserTag
        ) as MappingUser;
        mappingUser.key = mapping.key;
        mappingUser.displayName = mapping.displayName;
        testMentionElement.appendChild(mappingUser);
        mappingElements.push(mappingUser);
    });
    element.appendChild(testMentionElement);
    await waitForUpdatesAsync();
    return {
        testMentionElement,
        mappingElements
    };
}
