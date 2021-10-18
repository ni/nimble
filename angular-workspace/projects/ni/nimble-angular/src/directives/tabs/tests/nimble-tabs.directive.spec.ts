import { TestBed } from '@angular/core/testing';
import { NimbleTabsModule } from '../nimble-tabs.module';

describe('Nimble tabs', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleTabsModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-tabs')).not.toBeUndefined();
    });
});
