import type { MappingUser } from '../../../mapping/user';
import type { RichTextMentionTest } from '../../../rich-text-mention/base/tests/rich-text-mention.fixtures';
import type { RichTextMentionUsers } from '../../../rich-text-mention/users';

export const ToolbarButton = {
    bold: 0,
    italics: 1,
    bulletList: 2,
    numberedList: 3
} as const;
export type ToolbarButton = (typeof ToolbarButton)[keyof typeof ToolbarButton];

export type LabelProvider =
    | 'toggleBold'
    | 'toggleItalics'
    | 'toggleBulletedList'
    | 'toggleNumberedList';

export type ToolbarButtonKey = keyof typeof ToolbarButton;

export interface UserMentionElements {
    userMentionElement: RichTextMentionUsers;
    mappingElements: MappingUser[];
}

export interface TestMentionElements {
    testMentionElement: RichTextMentionTest;
    mappingElements: MappingUser[];
}

export interface MappingConfiguration {
    key?: string;
    displayName?: string;
}
