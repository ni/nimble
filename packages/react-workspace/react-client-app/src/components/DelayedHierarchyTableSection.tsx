import { useState, useRef, useEffect } from 'react';
import { NimbleTable, type Table, type TableRowExpandToggleEvent, type TableRecord, type TableSetRecordHierarchyOptions, fromTableRef } from '@ni/nimble-react/table';
import { NimbleTableColumnText } from '@ni/nimble-react/table-column/text';
import { NimbleTableColumnNumberText } from '@ni/nimble-react/table-column/number-text';
import { SubContainer } from './SubContainer';

interface PersonTableRecord extends TableRecord {
    [key: string]: string | number | boolean | undefined;
    id: string;
    parentId?: string;
    firstName: string;
    lastName: string;
    age: number;
    hasChildren?: boolean;
}

function getChildren(id: string): PersonTableRecord[] {
    switch (id) {
        case 'jacqueline-bouvier':
            return [{
                firstName: 'Marge',
                lastName: 'Simpson',
                age: 35,
                id: 'marge-simpson',
                parentId: id,
                hasChildren: true
            }, {
                firstName: 'Selma',
                lastName: 'Bouvier',
                age: 45,
                id: 'selma-bouvier',
                parentId: id
            }, {
                firstName: 'Patty',
                lastName: 'Bouvier',
                age: 45,
                id: 'patty-bouvier',
                parentId: id
            }];
        case 'marge-simpson':
            return [{
                firstName: 'Bart',
                lastName: 'Simpson',
                age: 12,
                id: 'bart-simpson',
                parentId: id
            }, {
                firstName: 'Lisa',
                lastName: 'Simpson',
                age: 10,
                id: 'lisa-simpson',
                parentId: id
            }, {
                firstName: 'Maggie',
                lastName: 'Simpson',
                age: 1,
                id: 'maggie-simpson',
                parentId: id
            }];
        case 'mona-simpson':
            return [{
                firstName: 'Homer',
                lastName: 'Simpson',
                age: 35,
                id: 'homer-simpson',
                parentId: id
            }];
        case 'agnes-skinner':
            return [{
                firstName: 'Seymour',
                lastName: 'Skinner',
                age: 42,
                id: 'seymour-skinner',
                parentId: id
            }];
        default:
            return [];
    }
}

export function DelayedHierarchyTableSection(): React.JSX.Element {
    const [delayedHierarchyTableData, setDelayedHierarchyTableData] = useState<PersonTableRecord[]>([
        {
            firstName: 'Jacqueline',
            lastName: 'Bouvier',
            age: 80,
            id: 'jacqueline-bouvier',
            parentId: undefined,
            hasChildren: true
        },
        {
            firstName: 'Mona',
            lastName: 'Simpson',
            age: 77,
            id: 'mona-simpson',
            parentId: undefined,
            hasChildren: true
        },
        {
            firstName: 'Agnes',
            lastName: 'Skinner',
            age: 88,
            id: 'agnes-skinner',
            parentId: undefined,
            hasChildren: true
        }
    ]);
    const [recordsLoadingChildren, setRecordsLoadingChildren] = useState<Set<string>>(new Set());
    const [recordsWithLoadedChildren, setRecordsWithLoadedChildren] = useState<Set<string>>(new Set());
    const delayedHierarchyTableRef = useRef<Table<PersonTableRecord>>(null);

    function onRowExpandToggle(event: TableRowExpandToggleEvent): void {
        const recordId = event.detail.recordId;
        if (event.detail.newState && !recordsLoadingChildren.has(recordId) && !recordsWithLoadedChildren.has(recordId)) {
            const record = delayedHierarchyTableData.find(x => x.id === recordId && x.hasChildren);
            if (!record) {
                return;
            }

            const newLoadingSet = new Set(recordsLoadingChildren);
            newLoadingSet.add(recordId);
            setRecordsLoadingChildren(newLoadingSet);
            void updateDelayedHierarchyTable(false);

            window.setTimeout(() => {
                const children = getChildren(recordId);
                setDelayedHierarchyTableData([...delayedHierarchyTableData, ...children]);
                const newLoadingSet2 = new Set(recordsLoadingChildren);
                newLoadingSet2.delete(recordId);
                setRecordsLoadingChildren(newLoadingSet2);
                const newLoadedSet = new Set(recordsWithLoadedChildren);
                newLoadedSet.add(recordId);
                setRecordsWithLoadedChildren(newLoadedSet);
            }, 1500);
        }
    }

    async function updateDelayedHierarchyTable(setData = true): Promise<void> {
        if (delayedHierarchyTableRef.current) {
            if (setData) {
                await delayedHierarchyTableRef.current.setData(delayedHierarchyTableData);
            }
            const hierarchyOptions: TableSetRecordHierarchyOptions[] = delayedHierarchyTableData.filter(person => {
                return person.hasChildren && !recordsWithLoadedChildren.has(person.id);
            }).map(person => {
                const state = recordsLoadingChildren.has(person.id)
                    ? 'loading-children'
                    : 'can-load-children';
                return {
                    recordId: person.id,
                    options: { delayedHierarchyState: state }
                };
            });
            void delayedHierarchyTableRef.current.setRecordHierarchyOptions(hierarchyOptions);
        }
    }

    useEffect(() => {
        void ((async (): Promise<void> => {
            if (delayedHierarchyTableRef.current) {
                await delayedHierarchyTableRef.current.setData(delayedHierarchyTableData);
                const hierarchyOptions: TableSetRecordHierarchyOptions[] = delayedHierarchyTableData.filter(person => {
                    return person.hasChildren && !recordsWithLoadedChildren.has(person.id);
                }).map(person => {
                    const state = recordsLoadingChildren.has(person.id)
                        ? 'loading-children'
                        : 'can-load-children';
                    return {
                        recordId: person.id,
                        options: { delayedHierarchyState: state }
                    };
                });
                await delayedHierarchyTableRef.current.setRecordHierarchyOptions(hierarchyOptions);
            }
        })());
    }, [delayedHierarchyTableData, recordsLoadingChildren, recordsWithLoadedChildren]);

    return (
        <SubContainer label="Table with delayed hierarchy">
            <NimbleTable
                ref={fromTableRef(delayedHierarchyTableRef)}
                idFieldName="id" parentIdFieldName="parentId" selectionMode="multiple"
                onRowExpandToggle={onRowExpandToggle}
            >
                <NimbleTableColumnText
                    fieldName="firstName"
                >
                    First name
                </NimbleTableColumnText>
                <NimbleTableColumnText
                    fieldName="lastName"
                >
                    Last name
                </NimbleTableColumnText>
                <NimbleTableColumnNumberText
                    fieldName="age"
                    format="decimal"
                    decimalDigits={0}
                >
                    Age
                </NimbleTableColumnNumberText>
            </NimbleTable>
        </SubContainer>
    );
}
