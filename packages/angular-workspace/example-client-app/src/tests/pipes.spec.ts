import { DurationPipe, NumberTextPipe, byteUnitScale, byte1024UnitScale, celsiusUnitScale, fahrenheitUnitScale, voltUnitScale } from '@ni/nimble-angular/pipes';

describe('Pipes', () => {
    it('exports DurationPipe', () => {
        expect(new DurationPipe('en')).toBeTruthy();
    });

    it('exports NumberTextPipe', () => {
        expect(new NumberTextPipe('en')).toBeTruthy();
    });

    it('exports byteUnitScale', () => {
        expect(byteUnitScale).toBeTruthy();
    });

    it('exports byte1024UnitScale', () => {
        expect(byte1024UnitScale).toBeTruthy();
    });

    it('exports celsiusUnitScale', () => {
        expect(celsiusUnitScale).toBeTruthy();
    });

    it('exports fahrenheitUnitScale', () => {
        expect(fahrenheitUnitScale).toBeTruthy();
    });

    it('exports voltUnitScale', () => {
        expect(voltUnitScale).toBeTruthy();
    });
});