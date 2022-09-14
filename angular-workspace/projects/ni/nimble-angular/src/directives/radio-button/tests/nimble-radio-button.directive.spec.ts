import { TestBed } from '@angular/core/testing';
import { NimbleRadioButtonModule } from '../nimble-radio-button.module';

describe('Nimble radio button', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleRadioButtonModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-radio-button')).not.toBeUndefined();
    });
});