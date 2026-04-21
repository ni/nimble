import { TestBed } from '@angular/core/testing';
import { OkExButtonModule } from '../ok-ex-button.module';

describe('Ok ex button', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkExButtonModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-ex-button')).not.toBeUndefined();
        });
    });
});
