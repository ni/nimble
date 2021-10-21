import { TestBed } from '@angular/core/testing';
import { NimbleTabPanelModule } from '../nimble-tab-panel.module';

describe('Nimble tab panel', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleTabPanelModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-tab-panel')).not.toBeUndefined();
    });
});
