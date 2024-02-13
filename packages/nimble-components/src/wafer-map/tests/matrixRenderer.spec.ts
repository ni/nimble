import { WaferMap } from '..';
import { MatrixRenderer } from '../modules/matrixRenderer';

describe('MatrixRenderer', () => {
    it('should initialize workerOne with a wrapped worker', () => {
        const waferMap = new WaferMap();
        const renderer = new MatrixRenderer(waferMap);
        expect(renderer.workerOne).toBeInstanceOf(Worker);
    });

    // Add more tests here as needed
});
