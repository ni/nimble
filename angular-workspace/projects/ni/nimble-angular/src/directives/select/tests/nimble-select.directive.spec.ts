import { TestBed } from '@angular/core/testing';
import { NimbleSelectModule } from '../nimble-select.module';

describe('Nimble select', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleSelectModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-select')).not.toBeUndefined();
    });
});
