import { RichTextMentionUsers } from '@ni/nimble-components/dist/esm/rich-text-mention/users';
import type { MentionUpdateEventDetail } from '@ni/nimble-components/dist/esm/rich-text-mention/base/types';
import { wrap } from '../../utilities/react-wrapper';

export const NimbleRichTextMentionUsers = wrap(RichTextMentionUsers, {
    events: {
        onMentionUpdate: 'mention-update',
    }
});

export interface RichTextMentionUsersMentionUpdateEvent extends CustomEvent<MentionUpdateEventDetail> {
    target: RichTextMentionUsers;
}
