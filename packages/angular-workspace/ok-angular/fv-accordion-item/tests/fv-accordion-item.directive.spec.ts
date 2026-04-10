import { TestBed } from '@angular/core/testing';
import { OkFvAccordionItemModule } from '../fv-accordion-item.module';

describe('Ok fv accordion item', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvAccordionItemModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-accordion-item')).not.toBeUndefined();
        });
    });
});
