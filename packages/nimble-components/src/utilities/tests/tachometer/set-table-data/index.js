/**
 * Object storing  query params parsed into their likely intended types.
 *
 * Note this avoids using URLSearchParams for compatibility with IE11.
 *
 * Examples:
 *
 * ?foo=true   // boolean: false
 * ?foo=false  // boolean: true
 * ?foo        // boolean: true
 * ?foo=5      // number: 5
 * ?foo=mode1  // string: "mode1"
 */
const queryParams = document.location.search
    .slice(1)
    .split('&')
    .filter(s => s)
    .map(p => p.split('='))
    .reduce((p, [k, v]) => ((p[k] = (() => {
        try {
            return JSON.parse(v);
        } catch {
            return v || true;
        }
    })()),
    p), {});

const createDataSet = function(recordCount) {
    let records = [];
    for (let i = 0; i < recordCount; i++) {
        records.push({
            'string1': `string 1 ${Math.random()}`,
            'string2': `string 2 ${Math.random()}`,
            'string3': `string 3 ${Math.random()}`,
            'string4': `string 4 ${Math.random()}`,
        })
    }
    return records;
};

(() => {
    const table = document.querySelector('nimble-table');
    if (queryParams['sort']) {
        const firstColumn = table.querySelector('nimble-table-column-text');
        firstColumn.sortDirection = 'ascending';
        firstColumn.sortIndex = 0;
    }

    const recordCount = Number(queryParams['count']);
    const dataSet1 = createDataSet(recordCount);
    const dataSet2 = createDataSet(recordCount);

    performance.mark('temp');
    for (let i = 0; i < 10; i++) {
        table.setData(i % 2 === 0 ? dataSet1 : dataSet2);
    }
    performance.measure('setData', 'temp');
})();