import { MappingText, mappingTextTag } from '..';

describe('Text Mapping', () => {
    it('should export its tag', () => {
        expect(mappingTextTag).toBe('nimble-mapping-text');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-mapping-text')).toBeInstanceOf(
            MappingText
        );
    });
});
