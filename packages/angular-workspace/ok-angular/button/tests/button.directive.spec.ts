import { TestBed } from '@angular/core/testing';
import { OkButtonModule } from '../ok-button.module';

describe('Ok button', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkButtonModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-button')).not.toBeUndefined();
        });
    });
});
