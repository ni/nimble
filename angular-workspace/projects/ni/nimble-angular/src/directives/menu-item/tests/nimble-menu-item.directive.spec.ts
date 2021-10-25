import { TestBed } from '@angular/core/testing';
import { NimbleMenuItemModule } from '..';

describe('Nimble menu item', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleMenuItemModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-menu-item')).not.toBeUndefined();
    });
});