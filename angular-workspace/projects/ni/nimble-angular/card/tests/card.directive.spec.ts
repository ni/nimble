import { TestBed } from '@angular/core/testing';
import { NimbleCardModule } from '../nimble-card.module';

describe('Nimble card', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleCardModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-card')).not.toBeUndefined();
        });
    });
});
