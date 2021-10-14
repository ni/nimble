import { TestBed } from '@angular/core/testing';
import { NimbleCheckboxModule } from '../nimble-checkbox.module';

describe('Nimble checkbox', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleCheckboxModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-checkbox')).not.toBeUndefined();
    });
});
