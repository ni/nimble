import { TestBed } from '@angular/core/testing';
import { NimbleSpinnerModule } from '../nimble-spinner.module';

describe('Nimble Spinner', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleSpinnerModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-spinner')).not.toBeUndefined();
    });
});