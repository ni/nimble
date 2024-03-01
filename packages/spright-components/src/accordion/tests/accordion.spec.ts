import { Accordion, accordionTag } from '..';

describe('Accordion', () => {
    it('should export its tag', () => {
        expect(accordionTag).toBe('spright-accordion');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('spright-accordion')).toBeInstanceOf(
            Accordion
        );
    });
});
