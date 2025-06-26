import { MappingSpinner, mappingSpinnerTag } from '..';

describe('Spinner Mapping', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(mappingSpinnerTag)).toBeInstanceOf(
            MappingSpinner
        );
    });
});
