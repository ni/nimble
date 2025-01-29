import type { RichTextMentionUsers } from '.';
import type { MappingUser } from '../../mapping/user';

export interface UserMentionElements {
    userMentionElement: RichTextMentionUsers;
    mappingElements: MappingUser[];
}
