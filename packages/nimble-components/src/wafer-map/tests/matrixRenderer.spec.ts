import * as Comlink from 'comlink';
import * as jest from '@jest/globals';
import { MatrixRenderer } from '../modules/matrixRenderer';
import type { WaferMap } from '..';
import { getWaferMapMockValidator } from './utilities';

jest.mock('comlink', () => ({
    wrap: jest.fn(),
}));

describe('MatrixRenderer', () => {
    it('should create an instance with a WaferMap', () => {
        const waferMapMock = getWaferMapMockValidator(0, 0, 0, 0);
        const renderer = new MatrixRenderer(waferMapMock as WaferMap);
        expect(renderer).toBeInstanceOf(MatrixRenderer);
    });

    it('initializes a worker and wraps it with Comlink', () => {
        const waferMapMock = {} as WaferMap; // Mocking WaferMap, adjust accordingly
        const workerInitSpy = jest.spyOn(window, 'Worker').mockImplementation(() => {
            return {} as unknown as Worker; // Mocking Worker instance
        });
        const comlinkWrapSpy = jest.spyOn(Comlink, 'wrap');

        new MatrixRenderer(waferMapMock as WaferMap);

        expect(workerInitSpy).toHaveBeenCalled();
        expect(comlinkWrapSpy).toHaveBeenCalled();

        // Cleanup
        workerInitSpy.mockRestore();
        comlinkWrapSpy.mockRestore();
    });
});