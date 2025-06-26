import { TestBed } from '@angular/core/testing';
import { NimbleToolbarModule } from '../nimble-toolbar.module';

describe('Nimble toolbar', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleToolbarModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-toolbar')).not.toBeUndefined();
    });
});
