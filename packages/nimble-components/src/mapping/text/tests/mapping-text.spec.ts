import { MappingText, mappingTextTag } from '..';

describe('Text Mapping', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(mappingTextTag)).toBeInstanceOf(
            MappingText
        );
    });
});
