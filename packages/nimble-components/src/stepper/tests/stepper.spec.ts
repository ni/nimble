import { Stepper, stepperTag } from '..';

describe('Stepper', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(stepperTag)).toBeInstanceOf(Stepper);
    });
});
