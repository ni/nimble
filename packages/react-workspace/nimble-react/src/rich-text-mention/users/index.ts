import { RichTextMentionUsers, richTextMentionUsersTag } from '@ni/nimble-components/dist/esm/rich-text-mention/users';
import type { MentionUpdateEventDetail } from '@ni/nimble-components/dist/esm/rich-text-mention/base/types';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { richTextMentionUsersTag };
export { type RichTextMentionUsers };
export const NimbleRichTextMentionUsers = wrap(RichTextMentionUsers, {
    events: {
        onMentionUpdate: 'mention-update' as EventName<RichTextMentionUsersMentionUpdateEvent>,
    }
});
export interface RichTextMentionUsersMentionUpdateEvent extends CustomEvent<MentionUpdateEventDetail> {
    target: RichTextMentionUsers;
}
