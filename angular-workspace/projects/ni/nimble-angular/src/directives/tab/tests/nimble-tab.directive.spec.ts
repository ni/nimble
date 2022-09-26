import { TestBed } from '@angular/core/testing';
import { NimbleTabModule } from '../nimble-tab.module';

describe('Nimble tab', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleTabModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-tab')).not.toBeUndefined();
        console.error('barf');
    });
});
