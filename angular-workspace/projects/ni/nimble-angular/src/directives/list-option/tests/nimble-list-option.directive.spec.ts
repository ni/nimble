import { TestBed } from '@angular/core/testing';
import { NimbleListOptionModule } from '../nimble-list-option.module';

describe('Nimble listbox option', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleListOptionModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-list-option')).not.toBeUndefined();
    });
});
