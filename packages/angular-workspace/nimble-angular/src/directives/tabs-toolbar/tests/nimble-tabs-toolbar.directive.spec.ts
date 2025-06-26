import { TestBed } from '@angular/core/testing';
import { NimbleTabsToolbarModule } from '../nimble-tabs-toolbar.module';

describe('Nimble tabs toolbar', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleTabsToolbarModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-tabs-toolbar')).not.toBeUndefined();
    });
});
