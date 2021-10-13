import { TestBed } from '@angular/core/testing';
import { NimbleNumberFieldModule } from '../nimble-number-field.module';

describe('Nimble number field', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleNumberFieldModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-number-field')).not.toBeUndefined();
    });
});
