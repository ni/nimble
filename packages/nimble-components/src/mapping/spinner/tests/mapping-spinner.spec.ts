import { MappingSpinner, mappingSpinnerTag } from '..';

describe('Spinner Mapping', () => {
    it('should export its tag', () => {
        expect(mappingSpinnerTag).toBe('nimble-mapping-spinner');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-mapping-spinner')).toBeInstanceOf(
            MappingSpinner
        );
    });
});
