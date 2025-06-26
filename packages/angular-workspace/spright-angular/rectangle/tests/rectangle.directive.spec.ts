import { TestBed } from '@angular/core/testing';
import { SprightRectangleModule } from '../spright-rectangle.module';

describe('Spright rectangle', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SprightRectangleModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('spright-rectangle')).not.toBeUndefined();
        });
    });
});
