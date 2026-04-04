import { TestBed } from '@angular/core/testing';
import { OkAccordionItemModule } from '../ok-accordion-item.module';

describe('Ok accordion item', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkAccordionItemModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-accordion-item')).not.toBeUndefined();
        });
    });
});
