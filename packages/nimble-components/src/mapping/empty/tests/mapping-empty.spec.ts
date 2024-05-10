import { MappingEmpty, mappingEmptyTag } from '..';

describe('Empty Mapping', () => {
    it('should export its tag', () => {
        expect(mappingEmptyTag).toBe('nimble-mapping-empty');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-mapping-empty')).toBeInstanceOf(
            MappingEmpty
        );
    });
});
