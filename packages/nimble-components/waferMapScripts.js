// eslint-disable-next-line no-undef
document.addEventListener('DOMContentLoaded', main);

const colorScales = {
    colors: ['red', 'yellow', 'green'],
    values: ['1', '50', '100']
};

function createWaferMap(functionName, dieCount) {
    performance.mark(`${functionName}_start`);
    // eslint-disable-next-line no-undef
    const waferMap = document.createElement('nimble-wafer-map');
    waferMap.dies = generateDies(dieCount).wafermapDieSet;
    waferMap.colorScales = colorScales;
    // eslint-disable-next-line no-undef
    document.body.appendChild(waferMap);
    performance.mark(`${functionName}_end`);
    performance.measure(functionName, `${functionName}_start`, `${functionName}_end`);
    performance.clearMarks(`${functionName}_start`);
    performance.clearMarks(`${functionName}_end`);
}

async function main() {
    await createWaferMap('smallWafer', 10 ** 4);
    await createWaferMap('mediumWafer', 10 ** 5);
    await createWaferMap('largeWafer', 10 ** 6);
}

function generateDies(diesCount) {
    const wafermapDieSet = [];
    const sideLength = Math.floor(Math.sqrt(diesCount / Math.PI) * 2); // Calculate the side length of the square
    const radius = sideLength / 2;
    const centerX = Math.floor(sideLength / 2);
    const centerY = centerX;
    for (let i = 0; i <= sideLength; i++) {
        for (let j = 0; j <= sideLength; j++) {
            const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
            if (distance <= radius) {
                wafermapDieSet.push({ x: i, y: j, value: ((i + j) % 100).toString() });
            }
        }
    }
    return { wafermapDieSet };
}
