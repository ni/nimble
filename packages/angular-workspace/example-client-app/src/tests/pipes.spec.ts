import { DurationPipe, NumberTextPipe, unitScaleByte, unitScaleByte1024, unitScaleCelsius, unitScaleFahrenheit, unitScaleVolt } from '@ni/nimble-angular/pipes';

describe('Pipes', () => {
    it('exports DurationPipe', () => {
        expect(new DurationPipe('en')).toBeTruthy();
    });

    it('exports NumberTextPipe', () => {
        expect(new NumberTextPipe('en')).toBeTruthy();
    });

    it('exports unitScaleByte', () => {
        expect(unitScaleByte).toBeTruthy();
    });

    it('exports unitScaleByte1024', () => {
        expect(unitScaleByte1024).toBeTruthy();
    });

    it('exports unitScaleCelsius', () => {
        expect(unitScaleCelsius).toBeTruthy();
    });

    it('exports unitScaleFahrenheit', () => {
        expect(unitScaleFahrenheit).toBeTruthy();
    });

    it('exports unitScaleVolt', () => {
        expect(unitScaleVolt).toBeTruthy();
    });
});