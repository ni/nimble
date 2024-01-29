// eslint-disable-next-line no-undef
document.addEventListener('DOMContentLoaded', main);

const colorScales = {
    colors: ['red', 'yellow', 'green'],
    values: ['0', '50', '100']
};

async function createWaferMap(file, functionName) {
    performance.mark(`${functionName}_start`);
    const waferMap = await fetchAndCreateWaferMap(file);
    // eslint-disable-next-line no-undef
    document.body.appendChild(waferMap);
    performance.mark(`${functionName}_end`);
    performance.measure(functionName, `${functionName}_start`, `${functionName}_end`);
    performance.clearMarks(`${functionName}_start`);
    performance.clearMarks(`${functionName}_end`);
}

async function fetchAndCreateWaferMap(file) {
    const response = await fetch(file);
    const data = await response.json();
    // eslint-disable-next-line no-undef
    const waferMap = document.createElement('nimble-wafer-map');
    waferMap.dies = data.wafermapDieSet;
    waferMap.colorScale = colorScales;
    return waferMap;
}

async function main() {
    await createWaferMap('smallWafer.json', 'smallWafer');
    await createWaferMap('mediumWafer.json', 'mediumWafer');
    await createWaferMap('bigWafer.json', 'bigWafer');
}
