import { WaferMap } from '..';
import { MatrixRenderer } from '../modules/matrix-renderer';
import * as Comlink from 'comlink';

describe('MatrixRenderer', () => {
    let mockComlinkWrap: jasmine.Spy;

    beforeAll(() => {
        global.Worker = jasmine.createSpy('Worker');
        global.Blob = jasmine.createSpy('Blob').and.callFake(() => 'mockBlob');
        global.URL.createObjectURL = jasmine.createSpy('createObjectURL').and.returnValue('mockUrl');

        // Setup Comlink mock
        mockComlinkWrap = jasmine.createSpy('wrap');
        (Comlink.wrap as any) = mockComlinkWrap.and.returnValue('mockWorkerOne');
    });

    it('should correctly initialize workerOne using Comlink', () => {
        const mockWaferMap = new WaferMap(); // Provide a mock waferMap as needed for your tests
        const renderer = new MatrixRenderer(mockWaferMap as any);

        expect(global.Blob).toHaveBeenCalledWith([jasmine.any(String)], { type: 'text/javascript' });
        expect(global.URL.createObjectURL).toHaveBeenCalledWith('mockBlob');
        expect(global.Worker).toHaveBeenCalledWith('mockUrl');
        expect(Comlink.wrap).toHaveBeenCalledWith(jasmine.any(Worker));
        expect(renderer.workerOne).toBe('mockWorkerOne');
    });
});