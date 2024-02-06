import { WaferMap } from '@ni/nimble-components/dist/esm/wafer-map';
import { WaferMapDie } from '@ni/nimble-components/dist/esm/wafer-map/types';
// eslint-disable-next-line @typescript-eslint/no-misused-promises
document.addEventListener('DOMContentLoaded', main);

const colorScales = {
    colors: ['red', 'orange', 'yellow', 'green'],
    values: ['1', '33', '66', '100']
};

async function createWaferMap(functionName: string, dieCount: number): Promise<void> {
    const waferMapDies = generateDies(dieCount);
    performance.mark(`${functionName}_start`);
    const waferMap = new WaferMap();
    waferMap.dies = waferMapDies;
    waferMap.colorScale = colorScales;
    document.body.append(waferMap);

    await new Promise(requestAnimationFrame);
    performance.mark(`${functionName}_end`);
    performance.measure(functionName, `${functionName}_start`, `${functionName}_end`);
    performance.clearMarks(`${functionName}_start`);
    performance.clearMarks(`${functionName}_end`);
}

async function main(): Promise<void> {
    await createWaferMap('smallWafer', 10 ** 4);
    await createWaferMap('mediumWafer', 10 ** 5);
    await createWaferMap('largeWafer', 10 ** 6);
}

function generateDies(diesCount: number): WaferMapDie[] {
    const wafermapDieSet: WaferMapDie[] = [];
    const sideLength = Math.sqrt(diesCount / Math.PI) * 2;
    const radius = sideLength / 2;
    const centerX = radius;
    const centerY = centerX;
    for (let i = 0; i <= sideLength; i++) {
        for (let j = 0; j <= sideLength; j++) {
            const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
            if (distance <= radius) {
                wafermapDieSet.push({ x: i, y: j, value: `${(i + j) % 100}` });
            }
        }
    }
    return wafermapDieSet;
}