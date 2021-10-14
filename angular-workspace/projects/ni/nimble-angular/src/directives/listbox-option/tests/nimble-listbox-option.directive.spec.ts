import { TestBed } from '@angular/core/testing';
import { NimbleListboxOptionModule } from '../nimble-listbox-option.module';

describe('Nimble listbox option', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleListboxOptionModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-listbox-option')).not.toBeUndefined();
    });
});
