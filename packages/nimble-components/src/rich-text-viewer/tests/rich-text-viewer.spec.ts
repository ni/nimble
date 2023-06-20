import { RichTextViewer } from '..';

describe('RichTextViewer', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-rich-text-viewer')
        ).toBeInstanceOf(RichTextViewer);
    });
});
