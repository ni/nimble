import { DurationPipe, FormatNumberTextPipe } from '@ni/nimble-angular/pipes';

describe('Pipes', () => {
    it('exports DurationPipe', () => {
        expect(new DurationPipe('en')).toBeTruthy();
    });

    it('exports FormatNumberTextPipe', () => {
        expect(new FormatNumberTextPipe('en')).toBeTruthy();
    });
});