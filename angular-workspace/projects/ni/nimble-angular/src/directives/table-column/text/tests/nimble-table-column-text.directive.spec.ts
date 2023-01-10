import { TestBed } from '@angular/core/testing';
import { NimbleTableColumnTextModule } from '../nimble-table-column-text.module';

describe('Nimble table column text', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleTableColumnTextModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-table-column-text')).not.toBeUndefined();
    });
});
