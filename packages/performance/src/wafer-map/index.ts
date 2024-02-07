import { waferMapTag } from '@ni/nimble-components/dist/esm/wafer-map';
import type { WaferMapDie } from '@ni/nimble-components/dist/esm/wafer-map/types';

document.addEventListener('DOMContentLoaded', main);

async function waitAnimationFrame(): Promise<void> {
    return new Promise(resolve => {
        requestAnimationFrame(() => resolve());
    });
}

async function runBenchmark(benchmark: string, dieCount: number): Promise<void> {
    const waferMapDies = generateDies(dieCount);

    const start = performance.now();
    const waferMap = document.createElement(waferMapTag);
    waferMap.dies = waferMapDies;
    waferMap.colorScale = {
        colors: ['red', 'orange', 'yellow', 'green'],
        values: ['1', '33', '66', '100']
    };
    document.body.append(waferMap);
    await waitAnimationFrame();
    performance.measure(benchmark, { start });

    document.body.removeChild(waferMap);
}

function main(): void {
    void (async (): Promise<void> => {
        document.querySelector<HTMLParagraphElement>('.running')!.hidden = false;
        await runBenchmark('wafer_10K_dies', 10 ** 4);
        await runBenchmark('wafer_100K_dies', 10 ** 5);
        await runBenchmark('wafer_1M_dies', 10 ** 6);
        document.querySelector<HTMLParagraphElement>('.finished')!.hidden = false;
    })();
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
