import { TestBed } from '@angular/core/testing';
import { NimbleUnitCelsiusModule } from '../nimble-unit-celsius.module';

describe('Nimble Celsius unit', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleUnitCelsiusModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-unit-celsius')).not.toBeUndefined();
        });
    });
});