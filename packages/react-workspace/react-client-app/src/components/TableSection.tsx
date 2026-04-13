import { useState, useRef, useEffect } from 'react';
import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleMenu } from '@ni/nimble-react/menu';
import { NimbleMenuItem } from '@ni/nimble-react/menu-item';
import { NimbleTable, type Table, type TableRecord, fromTableRef } from '@ni/nimble-react/table';
import { NimbleTableColumnText } from '@ni/nimble-react/table-column/text';
import { NimbleTableColumnAnchor } from '@ni/nimble-react/table-column/anchor';
import { NimbleTableColumnDateText } from '@ni/nimble-react/table-column/date-text';
import { NimbleTableColumnMapping } from '@ni/nimble-react/table-column/mapping';
import { NimbleMappingText } from '@ni/nimble-react/mapping/text';
import { NimbleMappingIcon } from '@ni/nimble-react/mapping/icon';
import { NimbleMappingSpinner } from '@ni/nimble-react/mapping/spinner';
import { NimbleMappingEmpty } from '@ni/nimble-react/mapping/empty';
import { NimbleTableColumnNumberText } from '@ni/nimble-react/table-column/number-text';
import { NimbleTableColumnDurationText } from '@ni/nimble-react/table-column/duration-text';
import { NimbleTableColumnMenuButton, type TableColumnMenuButtonBeforeToggleEvent } from '@ni/nimble-react/table-column/menu-button';
import { iconCheckTag, NimbleIconCheck } from '@ni/nimble-react/icons/check';
import { NimbleIconXmarkCheck } from '@ni/nimble-react/icons/xmark-check';
import { SubContainer } from './SubContainer';

const colors = ['Red', 'Green', 'Blue', 'Black', 'Yellow'] as const;
type Color = typeof colors[number];

interface SimpleTableRecord extends TableRecord {
    [key: string]: string | number | boolean | undefined;
    id: string;
    parentId?: string;
    stringValue1: string;
    stringValue2: string;
    href?: string;
    linkLabel?: string;
    date: number;
    statusCode: number;
    result: string;
    number: number;
    duration: number;
    color: Color;
}

export function TableSection(): React.JSX.Element {
    const [tableData, setTableData] = useState<SimpleTableRecord[]>(() => {
        const possibleStatuses = ['success', 'calculating', 'unknown'];
        const initialRows: SimpleTableRecord[] = [];
        for (let i = 0; i < 10; i++) {
            initialRows.push({
                id: i.toString(),
                parentId: (i >= 4 ? (i % 4).toString() : undefined),
                stringValue1: `new string ${i}`,
                stringValue2: `bar ${i}`,
                href: '/customapp',
                linkLabel: 'Link',
                date: (i % 2 === 0) ? new Date(2023, 7, 16, 3, 56, 11).valueOf() : new Date(2022, 2, 7, 20, 28, 41).valueOf(),
                statusCode: (i % 2 === 0) ? 100 : 101,
                result: possibleStatuses[i % 3],
                number: i / 10,
                duration: i * 1000 * (1.1 + 2 * 60 + 3 * 3600),
                color: colors[i % colors.length]
            });
        }
        return initialRows;
    });
    const [currentColor, setCurrentColor] = useState<Color | undefined>(undefined);
    const [openMenuButtonColumnRecordId, setOpenMenuButtonColumnRecordId] = useState<string | undefined>(undefined);
    const tableRef = useRef<Table<SimpleTableRecord>>(null);

    function addTableRows(numberOfRowsToAdd: number): void {
        const possibleStatuses = ['success', 'calculating', 'unknown'];
        const newRows: SimpleTableRecord[] = [];
        for (let i = 0; i < numberOfRowsToAdd; i++) {
            const currentLength = tableData.length + i;
            newRows.push({
                id: currentLength.toString(),
                parentId: (currentLength >= 4 ? (currentLength % 4).toString() : undefined),
                stringValue1: `new string ${currentLength}`,
                stringValue2: `bar ${currentLength}`,
                href: '/customapp',
                linkLabel: 'Link',
                date: (currentLength % 2 === 0) ? new Date(2023, 7, 16, 3, 56, 11).valueOf() : new Date(2022, 2, 7, 20, 28, 41).valueOf(),
                statusCode: (currentLength % 2 === 0) ? 100 : 101,
                result: possibleStatuses[currentLength % 3],
                number: currentLength / 10,
                duration: currentLength * 1000 * (1.1 + 2 * 60 + 3 * 3600),
                color: colors[currentLength % colors.length]
            });
        }
        setTableData([...tableData, ...newRows]);
    }

    function onMenuButtonColumnBeforeToggle(event: TableColumnMenuButtonBeforeToggleEvent): void {
        if (event.detail.newState) {
            setOpenMenuButtonColumnRecordId(event.detail.recordId);
            const currentRecord = tableData.find(record => record.id === event.detail.recordId);
            if (currentRecord) {
                setCurrentColor(currentRecord.color);
            }
        }
    }

    function onColorSelected(color: Color): void {
        const recordToUpdate = tableData.find(record => record.id === openMenuButtonColumnRecordId);
        if (recordToUpdate) {
            recordToUpdate.color = color;
            setTableData([...tableData]);
        }
    }

    useEffect(() => {
        void ((async (): Promise<void> => {
            await tableRef.current?.setData(tableData);
        })());
    }, [tableData]);

    return (
        <SubContainer label="Table">
            <NimbleTable
                ref={fromTableRef(tableRef)}
                idFieldName="id"
                parentIdFieldName="parentId"
                selectionMode="multiple"
                style={{ height: '400px' }}>
                <NimbleTableColumnText
                    fieldName="stringValue1"
                    actionMenuSlot="action-menu"
                    actionMenuLabel="Action menu"
                    fractionalWidth={2}
                    minPixelWidth={300}
                    sortDirection="ascending"
                    sortIndex={0}>
                    <NimbleIconCheck title="String 1"></NimbleIconCheck>
                </NimbleTableColumnText>
                <NimbleTableColumnAnchor
                    hrefFieldName="href"
                    labelFieldName="linkLabel">
                    Link
                </NimbleTableColumnAnchor>
                <NimbleTableColumnDateText fieldName="date">
                    Date
                </NimbleTableColumnDateText>
                <NimbleTableColumnMapping
                    fieldName="statusCode"
                    keyType="number">
                    <NimbleMappingText keyValue="100" text="Status message 1"></NimbleMappingText>
                    <NimbleMappingText keyValue="101" text="Status message 2"></NimbleMappingText>
                    Status
                </NimbleTableColumnMapping>
                <NimbleTableColumnMapping
                    fieldName="result"
                    keyType="string"
                    widthMode="icon-size">
                    <NimbleMappingIcon
                        keyValue="success"
                        text="Success"
                        icon={iconCheckTag}
                        severity="success"
                        textHidden>
                    </NimbleMappingIcon>
                    <NimbleMappingSpinner
                        keyValue="calculating"
                        text="Calculating"
                        textHidden>
                    </NimbleMappingSpinner>
                    <NimbleMappingEmpty
                        keyValue="unknown"
                        text="Unknown">
                    </NimbleMappingEmpty>
                    <NimbleIconXmarkCheck title="Result"></NimbleIconXmarkCheck>
                </NimbleTableColumnMapping>
                <NimbleTableColumnNumberText fieldName="number">
                    Number
                </NimbleTableColumnNumberText>
                <NimbleTableColumnDurationText fieldName="duration">
                    Duration
                </NimbleTableColumnDurationText>
                <NimbleTableColumnText fieldName="stringValue2" minPixelWidth={400} groupIndex={0}>
                    String 2
                </NimbleTableColumnText>
                <NimbleTableColumnMenuButton
                    fieldName="color"
                    menuSlot="color-menu"
                    onBeforeToggle={onMenuButtonColumnBeforeToggle}>
                    Color
                </NimbleTableColumnMenuButton>

                <NimbleMenu slot="action-menu">
                    <NimbleMenuItem>Item 1</NimbleMenuItem>
                    <NimbleMenuItem>Item 2</NimbleMenuItem>
                    <NimbleMenuItem>Item 3</NimbleMenuItem>
                </NimbleMenu>

                <NimbleMenu slot="color-menu">
                    {colors.map(color => (
                        <NimbleMenuItem
                            key={color}
                            onChange={() => onColorSelected(color)}>
                            {color === currentColor && (
                                <NimbleIconCheck slot="start"></NimbleIconCheck>
                            )}
                            {color}
                        </NimbleMenuItem>
                    ))}
                </NimbleMenu>
            </NimbleTable>
            <NimbleButton className="add-table-row-button"
                onClick={() => addTableRows(10)}
            >Add rows</NimbleButton>
            <div>Row count: {tableData.length}</div>
        </SubContainer>
    );
}
