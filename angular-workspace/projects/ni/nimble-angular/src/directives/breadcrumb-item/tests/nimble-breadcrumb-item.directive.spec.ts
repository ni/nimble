import { TestBed } from '@angular/core/testing';
import { NimbleBreadcrumbItemModule } from '../nimble-breadcrumb-item.module';

describe('Nimble breadcrumb item', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleBreadcrumbItemModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-breadcrumb-item')).not.toBeUndefined();
    });
});
