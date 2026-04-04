import { TestBed } from '@angular/core/testing';
import { OkSearchInputModule } from '../ok-search-input.module';

describe('Ok search input', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [OkSearchInputModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('ok-search-input')).not.toBeUndefined();
    });
});