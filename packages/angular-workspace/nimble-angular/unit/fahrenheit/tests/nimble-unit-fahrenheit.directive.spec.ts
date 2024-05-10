import { TestBed } from '@angular/core/testing';
import { NimbleUnitFahrenheitModule } from '../nimble-unit-fahrenheit.module';

describe('Nimble Fahrenheit unit', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleUnitFahrenheitModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-unit-fahrenheit')).not.toBeUndefined();
        });
    });
});