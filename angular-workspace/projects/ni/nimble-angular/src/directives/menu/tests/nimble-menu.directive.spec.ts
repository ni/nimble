import { TestBed } from '@angular/core/testing';
import { NimbleMenuModule } from '../nimble-menu.module';

describe('Nimble menu', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleMenuModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-menu')).not.toBeUndefined();
    });
});
