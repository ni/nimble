import { TestBed } from '@angular/core/testing';
import { NimbleButtonModule } from '../nimble-button.module';

describe('Nimble button', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleButtonModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-button')).not.toBeUndefined();
    });
});
