import { TestBed } from '@angular/core/testing';
import { NimbleThemeProviderModule } from '../nimble-theme-provider.module';

describe('Nimble theme provider', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleThemeProviderModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-theme-provider')).not.toBeUndefined();
    });
});
