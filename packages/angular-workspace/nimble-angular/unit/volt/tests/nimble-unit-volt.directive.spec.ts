import { TestBed } from '@angular/core/testing';
import { NimbleUnitVoltModule } from '../nimble-unit-volt.module';

describe('Nimble volt unit', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleUnitVoltModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-unit-volt')).not.toBeUndefined();
        });
    });
});