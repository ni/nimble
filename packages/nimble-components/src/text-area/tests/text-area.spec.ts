import { TextArea, textAreaTag } from '..';

describe('Text Area', () => {
    it('should export its tag', () => {
        expect(textAreaTag).toBe('nimble-text-area');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-text-area')).toBeInstanceOf(
            TextArea
        );
    });
});
