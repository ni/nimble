import { MappingEmpty, mappingEmptyTag } from '..';

describe('Empty Mapping', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(mappingEmptyTag)).toBeInstanceOf(
            MappingEmpty
        );
    });
});
