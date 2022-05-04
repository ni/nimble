import { TestBed } from '@angular/core/testing';
import { NimbleComboboxModule } from '../nimble-combobox.module';

describe('Nimble select', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleComboboxModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-combobox')).not.toBeUndefined();
    });
});
