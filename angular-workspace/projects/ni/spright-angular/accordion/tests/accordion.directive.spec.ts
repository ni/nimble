import { TestBed } from '@angular/core/testing';
import { SprightAccordionModule } from '../spright-accordion.module';

describe('Spright accordion', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SprightAccordionModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('spright-accordion')).not.toBeUndefined();
        });
    });
});
