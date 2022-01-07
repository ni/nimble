import { TestBed } from '@angular/core/testing';
import { NimbleTreeViewModule } from '../nimble-tree-view.module';

describe('Nimble tree view', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleTreeViewModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-tree-view')).not.toBeUndefined();
    });
});
