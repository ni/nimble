import { getColumns, makeData, Person } from './makedata';

// tanstack table-core TS files have code checking process.env
(window as any).process = {};
(window as any).process.env = 'production';

window.onload = () => {
    const table = document.querySelector('nimble-table')!;
    const loadButton = document.getElementById('loadButton')!;
    const loadDataButton = document.getElementById('loadDataButton')!;
    const loadColumnsButton = document.getElementById('loadColumnsButton')!;
    const rowCountTextBox = document.getElementById('rowCountTextBox')! as HTMLInputElement;

    let rowCount = 2000;
    let tableData: Person[] | undefined = makeData(rowCount);

    const loadData = () => {
        if (tableData === undefined) {
            tableData = makeData(rowCount);
        }
        table.data = tableData;
        tableData = undefined;
    };

    const loadColumns = () => {
        table.columns = getColumns();
    };

    loadButton.onclick = () => {
        loadData();
        loadColumns();
    };
    loadDataButton.onclick = () => {
        loadData();
    };
    loadColumnsButton.onclick = () => {
        loadColumns();
    };
    rowCountTextBox.onblur = () => {
        rowCount = parseInt(rowCountTextBox.value);
        tableData = makeData(rowCount);
    };
};