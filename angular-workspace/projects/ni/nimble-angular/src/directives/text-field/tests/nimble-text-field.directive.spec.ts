import { TestBed } from '@angular/core/testing';
import { NimbleTextFieldModule } from '../nimble-text-field.module';

describe('Nimble text field', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleTextFieldModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-text-field')).not.toBeUndefined();
    });
});
