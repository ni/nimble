describe('Retry failed tests', () => {
    it('does not impact a normal test', () => {
        expect(true).toBe(true);
    });
    describe('with tests that fail intermittently', () => {
        const testSpy = jasmine.createSpy();
        const beforeEachSpy = jasmine.createSpy();
        const afterEachSpy = jasmine.createSpy();
        beforeEach(() => {
            beforeEachSpy();
        });
        afterEach(() => {
            afterEachSpy();
        });
        it('eventually do pass', () => {
            testSpy();
            // The it statement will run multiple times increasing the spy count
            expect(testSpy.calls.count()).toBe(3);
            // the beforeEach statement will have run before each retry
            expect(beforeEachSpy.calls.count()).toBe(3);
            // the afterEach statement will have run after each retry except the last by this point (should run the last time after the test)
            expect(afterEachSpy.calls.count()).toBe(2);
        });
    });
    describe('with tests that console.error intermittently', () => {
        let failedOnce = false;
        const testSpy = jasmine.createSpy();
        it('eventually do pass', () => {
            testSpy();
            if (!failedOnce) {
                failedOnce = true;
                // eslint-disable-next-line no-console
                console.error('Testing error logging');
            }
            // The it statement will run multiple times increasing the spy count
            expect(testSpy.calls.count()).toBe(2);
        });
    });
});
