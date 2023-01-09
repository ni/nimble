import { TestBed } from '@angular/core/testing';
import { NimbleTableColumnModule } from '../../nimble-table-column.module';

describe('Nimble table column text', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleTableColumnModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-table-column-text')).not.toBeUndefined();
    });
});
