import { TestBed } from '@angular/core/testing';
import { NimbleTreeViewModule } from '../nimble-tree-view.module';

describe('Nimble tree view', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NimbleTreeViewModule]
        }).compileComponents();
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-tree-view')).not.toBeUndefined();
    });
});
