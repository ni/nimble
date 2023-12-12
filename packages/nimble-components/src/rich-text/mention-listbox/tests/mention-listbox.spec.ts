import { RichTextMentionListbox, richTextMentionListboxTag } from '..';

describe('RichTextMentionListbox', () => {
    it('should export its tag', () => {
        expect(richTextMentionListboxTag).toBe(
            'nimble-rich-text-mention-listbox'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-rich-text-mention-listbox')
        ).toBeInstanceOf(RichTextMentionListbox);
    });
});
