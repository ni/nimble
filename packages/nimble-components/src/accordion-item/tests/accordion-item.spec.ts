import { AccordionItem, accordionItemTag } from '..';

describe('Accordion Item', () => {
    it('should export its tag', () => {
        expect(accordionItemTag).toBe('nimble-accordion-item');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-accordion-item')).toBeInstanceOf(
            AccordionItem
        );
    });
});