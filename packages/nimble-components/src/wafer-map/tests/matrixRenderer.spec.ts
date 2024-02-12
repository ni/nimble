import * as Comlink from 'comlink';
import { MatrixRenderer } from '../modules/matrixRenderer';
import type { WaferMap } from '..';

describe('MatrixRenderer', () => {
    let originalWorker: typeof Worker;

    beforeEach(() => {
        // Save the original Worker to restore it after tests
        originalWorker = window.Worker;

        // Mock the Worker constructor
        window.Worker = jasmine.createSpy('Worker').and.callFake(() => {
            // Return a fake worker instance
            return {
                postMessage: jasmine.createSpy('postMessage'),
                terminate: jasmine.createSpy('terminate'),
                addEventListener: jasmine.createSpy('addEventListener'),
                removeEventListener: jasmine.createSpy('removeEventListener'),
            } as unknown as Worker;
        });

        // Mock Comlink.wrap
        spyOn(Comlink, 'wrap').and.returnValue({});
    });

    afterEach(() => {
        // Restore the original Worker after each test
        window.Worker = originalWorker;
    });

    it('should create a Worker instance and wrap it with Comlink', () => {
        const waferMapMock = {} as WaferMap; // Adjust this mock as necessary for your tests
        // eslint-disable-next-line no-new
        new MatrixRenderer(waferMapMock);

        // Check that a Worker was created
        expect(window.Worker).toHaveBeenCalled();

        // Verify that Comlink.wrap was called with a mocked Worker instance
        expect(Comlink.wrap).toHaveBeenCalled();
    });
});