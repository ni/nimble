import { NimbleThemeProvider, Theme } from '@ni/nimble-react/theme-provider';
import { NimbleAnchor } from '@ni/nimble-react/anchor';
import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleBanner } from '@ni/nimble-react/banner';
import { NimbleBreadcrumb } from '@ni/nimble-react/breadcrumb';
import { NimbleBreadcrumbItem } from '@ni/nimble-react/breadcrumb-item';
import { NimbleToggleButton } from '@ni/nimble-react/toggle-button';
import { NimbleAnchorButton } from '@ni/nimble-react/anchor-button';
import { NimbleCard } from '@ni/nimble-react/card';
import { NimbleNumberField } from '@ni/nimble-react/number-field';
import { NimbleSelect, type Select, type SelectChangeEvent, type SelectFilterInputEvent } from '@ni/nimble-react/select';
import { NimbleListOption } from '@ni/nimble-react/list-option';
import { NimbleListOptionGroup } from '@ni/nimble-react/list-option-group';
import { NimbleCardButton } from '@ni/nimble-react/card-button';
import { NimbleCheckbox } from '@ni/nimble-react/checkbox';
import { NimbleRadioGroup } from '@ni/nimble-react/radio-group';
import { NimbleRadio } from '@ni/nimble-react/radio';
import { NimbleTextField } from '@ni/nimble-react/text-field';
import { NimbleDialog, type Dialog, DialogUserDismissed, fromDialogRef } from '@ni/nimble-react/dialog';
import { NimbleDrawer, type Drawer, DrawerUserDismissed, DrawerLocation, fromDrawerRef } from '@ni/nimble-react/drawer';
import { NimbleMenu } from '@ni/nimble-react/menu';
import { NimbleMenuItem, type MenuItemChangeEvent } from '@ni/nimble-react/menu-item';
import { NimbleAnchorMenuItem } from '@ni/nimble-react/anchor-menu-item';
import { NimbleMenuButton } from '@ni/nimble-react/menu-button';
import { NimbleIconAdd } from '@ni/nimble-react/icons/add';
import { NimbleIconCheck } from '@ni/nimble-react/icons/check';
import { NimbleIconXmarkCheck } from '@ni/nimble-react/icons/xmark-check';
import { NimbleSpinner } from '@ni/nimble-react/spinner';
import { NimbleSwitch } from '@ni/nimble-react/switch';
import { NimbleTable, type Table, type TableRowExpandToggleEvent, type TableRecord, type TableSetRecordHierarchyOptions, fromTableRef } from '@ni/nimble-react/table';
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
import { NimbleTabs } from '@ni/nimble-react/tabs';
import { NimbleTab } from '@ni/nimble-react/tab';
import { NimbleTabsToolbar } from '@ni/nimble-react/tabs-toolbar';
import { NimbleTabPanel } from '@ni/nimble-react/tab-panel';
import { NimbleAnchorTabs } from '@ni/nimble-react/anchor-tabs';
import { NimbleAnchorTab } from '@ni/nimble-react/anchor-tab';
import { NimbleTextArea } from '@ni/nimble-react/text-area';
import { NimbleToolbar } from '@ni/nimble-react/toolbar';
import { NimbleTooltip } from '@ni/nimble-react/tooltip';
import { NimbleTreeView } from '@ni/nimble-react/tree-view';
import { NimbleTreeItem } from '@ni/nimble-react/tree-item';
import { NimbleAnchorTreeItem } from '@ni/nimble-react/anchor-tree-item';
import { NimbleCombobox } from '@ni/nimble-react/combobox';
import { NimbleRichTextEditor, type RichTextEditor } from '@ni/nimble-react/rich-text/editor';
import { NimbleRichTextMentionUsers } from '@ni/nimble-react/rich-text-mention/users';
import { NimbleMappingUser } from '@ni/nimble-react/mapping/user';
import { NimbleRichTextViewer } from '@ni/nimble-react/rich-text/viewer';
import { SprightChatConversation } from '@ni/spright-react/chat/conversation';
import { SprightChatInput } from '@ni/spright-react/chat/input';
import { SprightChatMessage } from '@ni/spright-react/chat/message';
import { NimbleIconCopyText } from '@ni/nimble-react/icons/copy-text';
import { NimbleIconWebviCustom } from '@ni/nimble-react/icons/webvi-custom';

import { SprightRectangle } from '@ni/spright-react/rectangle';

import { OkButton } from '@ni/ok-react/button';

import './App.scss';
import { useRef, useState, useEffect } from 'react';

interface ComboboxItem {
    first: string;
    last: string;
}

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

interface PersonTableRecord extends TableRecord {
    [key: string]: string | number | boolean | undefined;
    id: string;
    parentId?: string;
    firstName: string;
    lastName: string;
    age: number;
    hasChildren?: boolean;
}

export function App(): React.JSX.Element {
    const prefersColorSchemeDarkMediaQuery: MediaQueryList = window.matchMedia(
        '(prefers-color-scheme: dark)'
    );
    const [theme, setTheme] = useState<Theme>(prefersColorSchemeDarkMediaQuery.matches ? 'dark' : 'light');
    const [bannerOpen, setBannerOpen] = useState(true);
    const [selectedRadio, setSelectedRadio] = useState('mango');
    const dialogRef = useRef<Dialog<string>>(null);
    const [dialogCloseReason, setDialogCloseReason] = useState('');
    const drawerRef = useRef<Drawer<string>>(null);
    const [drawerCloseReason, setDrawerCloseReason] = useState('');
    const [drawerLocation, setDrawerLocation] = useState<DrawerLocation>(DrawerLocation.right);

    const [underlineSelectValue, setUnderlineSelectValue] = useState('');
    const [outlineSelectValue, setOutlineSelectValue] = useState('');
    const [blockSelectValue, setBlockSelectValue] = useState('');
    const availableSelectItems: ComboboxItem[] = [
        { first: 'Homer', last: 'Simpson' },
        { first: 'Marge', last: 'Simpson' },
        { first: 'Bart', last: 'Simpson' },
        { first: 'Lisa', last: 'Simpson' },
        { first: 'Maggie', last: 'Simpson' },
        { first: 'Mona', last: 'Simpson' },
        { first: 'Jacqueline', last: 'Bouvier' },
        { first: 'Selma', last: 'Bouvier' },
        { first: 'Patty', last: 'Bouvier' },
        { first: 'Abe', last: 'Simpson' },
        { first: 'Ned', last: 'Flanders' },
        { first: 'Maude', last: 'Flanders' },
        { first: 'Rod', last: 'Flanders' },
        { first: 'Todd', last: 'Flanders' }
    ];

    const defaultDynamicSelectItems = availableSelectItems.slice(0, 5);
    const [dynamicSelectItems, setDynamicSelectItems] = useState<ComboboxItem[]>(defaultDynamicSelectItems);
    const [dynamicSelectValue, setDynamicSelectValue] = useState<ComboboxItem | null>(null);
    const [hideSelectedItem, setHideSelectedItem] = useState(false);
    const dynamicSelectRef = useRef<Select>(null);
    const dynamicSelectFilterTimeoutRef = useRef<number | undefined>(undefined);
    const dynamicSelectValueRef = useRef<ComboboxItem | null>(null);

    const comboboxItems: ComboboxItem[] = [
        { first: 'foo', last: 'bar' },
        { first: 'Bubba', last: 'Hotep' },
        { first: 'Mister', last: 'Smithers' }
    ];

    const [activeTabId, setActiveTabId] = useState('tab-1');
    const [activeAnchorTabId, setActiveAnchorTabId] = useState('a-tab-2');
    const [chatUserMessages, setChatUserMessages] = useState<string[]>([]);

    // Initialize table data
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
    const tableRef = useRef<Table<SimpleTableRecord>>(null);
    const delayedHierarchyTableRef = useRef<Table<PersonTableRecord>>(null);

    const richTextEditorRef = useRef<RichTextEditor>(null);
    const markdownString = `Supported rich text formatting options:
1. **Bold**
2. *Italics*
3. Numbered lists
    1. Option 1
    2. Option 2
4. Bulleted lists
    * Option 1
    * Option 2
5. Absolute link: <https://nimble.ni.dev/>
6. @mention: <user:1>
`;

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

    function openDialog(): void {
        void (async (): Promise<void> => {
            const closeReason = await dialogRef.current?.show();
            setDialogCloseReason((closeReason === DialogUserDismissed) ? 'escape pressed' : (closeReason ?? 'unknown'));
        })();
    }

    function closeDialog(reason: string): void {
        dialogRef.current?.close(reason);
    }

    function openDrawer(): void {
        void (async (): Promise<void> => {
            const closeReason = await drawerRef.current?.show();
            setDrawerCloseReason((closeReason === DrawerUserDismissed) ? 'escape pressed' : (closeReason ?? 'unknown'));
        })();
    }

    function closeDrawer(reason: string): void {
        drawerRef.current?.close(reason);
    }

    function onMenuButtonMenuChange(event: MenuItemChangeEvent): void {
        const menuItemText = event.target.innerText;
        alert(`${menuItemText} selected`);
    }

    function loadRichTextEditorContent(): void {
        richTextEditorRef.current?.setMarkdown(markdownString);
    }

    function onTabToolbarButtonClick(): void {
        alert('Tab toolbar button clicked');
    }

    function onChatInputSend(event: CustomEvent<{ text: string }>): void {
        const text = event.detail.text;
        setChatUserMessages(prevMessages => [...prevMessages, text]);
    }

    // Update table data when component mounts or data changes
    useEffect(() => {
        void ((async (): Promise<void> => {
            await tableRef.current?.setData(tableData);
        })());
    }, [tableData]);

    // Update delayed hierarchy table when data changes
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

    function onDynamicSelectFilterInput(event: SelectFilterInputEvent): void {
        const filter = event.detail.filterText || '';
        if (filter.length > 0) {
            window.clearTimeout(dynamicSelectFilterTimeoutRef.current);
            if (dynamicSelectRef.current) {
                dynamicSelectRef.current.loadingVisible = true;
            }
            const timeoutId = window.setTimeout(() => {
                // Check if this timeout is still the active one
                if (dynamicSelectFilterTimeoutRef.current !== timeoutId) {
                    return;
                }
                const filteredItems = availableSelectItems.filter(item => item.first.concat(item.last).toLowerCase().includes(filter.toLowerCase()));
                // Use the ref to get the latest value
                const currentValue = dynamicSelectValueRef.current;
                // Ensure the selected value is in the list if it exists
                let itemsToSet = filteredItems;
                if (currentValue) {
                    const valueInFiltered = filteredItems.some(
                        item => item.first === currentValue.first && item.last === currentValue.last
                    );
                    if (!valueInFiltered) {
                        itemsToSet = [...filteredItems, currentValue];
                    }
                }
                setDynamicSelectItems(itemsToSet);
                const selectedItemInFiltered = currentValue
                    ? filteredItems.some(item => item.first === currentValue.first && item.last === currentValue.last)
                    : true;
                setHideSelectedItem(!selectedItemInFiltered);
                if (dynamicSelectRef.current) {
                    dynamicSelectRef.current.loadingVisible = false;
                }
                // Clear the timeout ref after execution
                dynamicSelectFilterTimeoutRef.current = undefined;
            }, 2000);
            dynamicSelectFilterTimeoutRef.current = timeoutId; // simulate async loading with debounce
        } else {
            setHideSelectedItem(false);
            window.clearTimeout(dynamicSelectFilterTimeoutRef.current);
            dynamicSelectFilterTimeoutRef.current = undefined;
            // Don't reset items here - let handleDynamicSelectChange manage the items
            // The filter being cleared doesn't mean we should reset the list
            if (dynamicSelectRef.current) {
                dynamicSelectRef.current.loadingVisible = false;
            }
        }
    }

    function shouldHideItem(item: ComboboxItem): boolean {
        return hideSelectedItem && dynamicSelectValue !== null
            && item.first === dynamicSelectValue.first
            && item.last === dynamicSelectValue.last;
    }

    function onDynamicSelectChange(evt: SelectChangeEvent): void {
        const selectedKey = evt.target.value;
        // Clear any pending filter timeout to prevent list updates during selection
        window.clearTimeout(dynamicSelectFilterTimeoutRef.current);
        dynamicSelectFilterTimeoutRef.current = undefined;

        if (selectedKey) {
            // Find the item in availableSelectItems using the key
            const selectedItem = availableSelectItems.find(
                item => `${item.first}-${item.last}` === selectedKey
            );
            if (selectedItem) {
                // Update the ref immediately
                dynamicSelectValueRef.current = selectedItem;

                // Update items list first to ensure the selected value is present
                setDynamicSelectItems(currentItems => {
                    const itemInList = currentItems.some(
                        item => item.first === selectedItem.first && item.last === selectedItem.last
                    );
                    const newItems = itemInList ? currentItems : [...currentItems, selectedItem];
                    return newItems;
                });

                // Then update the selected value
                setDynamicSelectValue(selectedItem);
                setHideSelectedItem(false);
            }

            // Stop loading indicator
            if (dynamicSelectRef.current) {
                dynamicSelectRef.current.loadingVisible = false;
            }
        } else {
            dynamicSelectValueRef.current = null;
            setDynamicSelectValue(null);
            setHideSelectedItem(false);
        }
    }

    return (
        <>
            <NimbleThemeProvider theme={theme}>
                <div className="example-root">
                    <div className="header">
                        <NimbleSelect
                            className="theme-select"
                            appearance="frameless"
                            value={theme}
                            onChange={e => setTheme(e.target.value as Theme)}
                        >
                            {Object.values(Theme).map(item => (
                                <NimbleListOption
                                    key={item}
                                    value={item}
                                >
                                    {`${item.charAt(0).toUpperCase()}${item.slice(1)}`} Theme
                                </NimbleListOption>
                            ))}
                        </NimbleSelect>
                    </div>
                    <div className="content-container-wrapper">
                        <div className="content-container">
                            <div className="container">
                                <div className="sub-container">
                                    Explore the components below to see the Nimble components in action.
                                    See the <NimbleAnchor href="https://nimble.ni.dev/storybook/">Nimble component docs</NimbleAnchor> for additional usage details.
                                    Navigate to the <NimbleAnchor href="../index.html">parent page</NimbleAnchor>.
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Anchor</div>
                                    <div><NimbleAnchor href="#" appearance="prominent">Site root</NimbleAnchor></div>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Banner</div>
                                    <NimbleBanner
                                        open={bannerOpen}
                                        onToggle={e => setBannerOpen(e.detail.newState)}
                                        severity="information">
                                        <span slot="title">Title of the banner</span>
                                        This is the message text of this banner. It tells you something interesting.
                                    </NimbleBanner>
                                    <NimbleCheckbox
                                        checked={bannerOpen}
                                        onChange={e => setBannerOpen(e.target.checked)}
                                    >Show banner</NimbleCheckbox>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Breadcrumb</div>
                                    <NimbleBreadcrumb>
                                        <NimbleBreadcrumbItem href="#">Page 1</NimbleBreadcrumbItem>
                                        <NimbleBreadcrumbItem
                                            href="#"
                                        >Page 2</NimbleBreadcrumbItem>
                                        <NimbleBreadcrumbItem>Current Page (No Link)</NimbleBreadcrumbItem>
                                    </NimbleBreadcrumb>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Buttons</div>
                                    <NimbleButton appearance="outline">Outline Button</NimbleButton>
                                    <NimbleButton appearance="block">Block Button</NimbleButton>
                                    <NimbleButton appearance="ghost">Ghost Button</NimbleButton>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Buttons - Anchor</div>
                                    <NimbleAnchorButton
                                        href="#"
                                        appearance="outline">Outline Anchor Button</NimbleAnchorButton>
                                    <NimbleAnchorButton
                                        href="#"
                                        appearance="block">Block Anchor Button</NimbleAnchorButton>
                                    <NimbleAnchorButton
                                        href="#"
                                        appearance="ghost">Ghost Anchor Button</NimbleAnchorButton>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Buttons - Toggle</div>
                                    <NimbleToggleButton appearance="outline">Outline Toggle Button</NimbleToggleButton>
                                    <NimbleToggleButton appearance="block">Block Toggle Button</NimbleToggleButton>
                                    <NimbleToggleButton appearance="ghost">Ghost Toggle Button</NimbleToggleButton>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Card</div>
                                    <NimbleCard>
                                        <span slot="title">Title of the card</span>
                                        <NimbleNumberField>Numeric field 1</NimbleNumberField>
                                        <NimbleNumberField>Numeric field 2</NimbleNumberField>
                                        <NimbleSelect>
                                            Select
                                            <NimbleListOption value="1">Option 1</NimbleListOption>
                                            <NimbleListOption value="2">Option 2</NimbleListOption>
                                            <NimbleListOption value="3">Option 3</NimbleListOption>
                                        </NimbleSelect>
                                    </NimbleCard>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Card Button</div>
                                    <NimbleCardButton>
                                        <span className="card-button-content">Card Button</span>
                                    </NimbleCardButton>
                                    <NimbleCardButton selected>
                                        <span className="card-button-content">Selected Card Button</span>
                                    </NimbleCardButton>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Checkbox</div>
                                    <NimbleCheckbox>Checkbox label</NimbleCheckbox>
                                    <NimbleCheckbox>Checkbox label</NimbleCheckbox>
                                    <NimbleCheckbox>Checkbox label</NimbleCheckbox>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Radio Buttons</div>
                                    <NimbleRadioGroup
                                        value={selectedRadio}
                                        onChange={e => setSelectedRadio(e.target.value)}
                                    >
                                        <span slot="label">Fruit</span>
                                        <NimbleRadio name="fruit" value="apple"
                                        >Apple</NimbleRadio>
                                        <NimbleRadio name="fruit" value="banana"
                                        >Banana</NimbleRadio>
                                        <NimbleRadio name="fruit" value="mango"
                                        >Mango</NimbleRadio>
                                    </NimbleRadioGroup>
                                    <NimbleTextField
                                        value={selectedRadio}
                                    >Selected value</NimbleTextField>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Dialog</div>
                                    <NimbleDialog
                                        ref={fromDialogRef(dialogRef)}
                                    >
                                        <span slot="title">This is a dialog</span>
                                        <div>It opened when you pushed the button</div>
                                        <NimbleButton slot="footer"
                                            onClick={_ => closeDialog('cancel pressed')}
                                        >Cancel</NimbleButton>
                                        <NimbleButton slot="footer"
                                            onClick={_ => closeDialog('OK pressed')}
                                        >OK</NimbleButton>
                                    </NimbleDialog>
                                    <NimbleButton
                                        onClick={openDialog}
                                    >Open Dialog</NimbleButton>
                                    <NimbleTextField
                                        value={dialogCloseReason}
                                    >Closed Reason</NimbleTextField>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Drawer</div>
                                    <NimbleDrawer
                                        ref={fromDrawerRef(drawerRef)}
                                        location={drawerLocation}
                                    >
                                        <header>This is a drawer</header>
                                        <section>
                                            <p style={{ height: '1000px' }}>It opened when you pushed the button</p>
                                            <p>This is the bottom!</p>
                                        </section>
                                        <footer className="drawer-footer">
                                            <NimbleButton appearance="ghost"
                                                onClick={() => closeDrawer('cancel pressed')}
                                            >Cancel</NimbleButton>
                                            <NimbleButton
                                                onClick={() => closeDrawer('OK pressed')}
                                            >OK</NimbleButton>
                                        </footer>
                                    </NimbleDrawer>
                                    <NimbleButton
                                        onClick={openDrawer}
                                    >Open Drawer</NimbleButton>
                                    <NimbleTextField
                                        readOnly
                                        value={drawerCloseReason}
                                    >Closed Reason</NimbleTextField>
                                    <NimbleSelect className="drawer-location-select"
                                        value={drawerLocation}
                                        onChange={e => setDrawerLocation(e.target.value === DrawerLocation.left ? DrawerLocation.left : DrawerLocation.right)}
                                    >
                                        Drawer Location
                                        <NimbleListOption
                                            value={DrawerLocation.left}
                                        >Drawer: Left-side</NimbleListOption>
                                        <NimbleListOption
                                            value={DrawerLocation.right}
                                        >Drawer: Right-side</NimbleListOption>
                                    </NimbleSelect>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Menu</div>
                                    <NimbleMenu>
                                        <header>Header 1</header>
                                        <NimbleMenuItem>
                                            Item 1
                                            <NimbleIconAdd slot="start"></NimbleIconAdd>
                                        </NimbleMenuItem>
                                        <NimbleMenuItem>Item 2</NimbleMenuItem>
                                        <hr />
                                        <header>Header 2</header>
                                        <NimbleMenuItem>Item 4</NimbleMenuItem>
                                        <NimbleAnchorMenuItem
                                            href="#"
                                        >Item 5 (link)</NimbleAnchorMenuItem>
                                    </NimbleMenu>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Menu Button</div>
                                    <NimbleMenuButton>
                                        Menu Button
                                        <NimbleMenu slot="menu"
                                            onChange={onMenuButtonMenuChange}
                                        >
                                            <header>Header 1</header>
                                            <NimbleMenuItem>
                                                Item 1
                                                <NimbleIconAdd slot="start"></NimbleIconAdd>
                                            </NimbleMenuItem>
                                            <NimbleMenuItem>Item 2</NimbleMenuItem>
                                            <hr/>
                                            <header>Header 2</header>
                                            <NimbleMenuItem>Item 4</NimbleMenuItem>
                                        </NimbleMenu>
                                    </NimbleMenuButton>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Number Field</div>
                                    <NimbleNumberField appearance="underline" placeholder="Number Field" value="42">Underline Number Field</NimbleNumberField>
                                    <NimbleNumberField appearance="outline" placeholder="Number Field" value="42">Outline Number Field</NimbleNumberField>
                                    <NimbleNumberField appearance="block" placeholder="Number Field" value="42">Block Number Field</NimbleNumberField>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Select</div>
                                    <NimbleSelect
                                        filterMode="standard"
                                        appearance="underline"
                                        value={underlineSelectValue}
                                        onChange={e => setUnderlineSelectValue(e.target.value)}
                                    >
                                        Underline Select
                                        <NimbleListOption hidden selected disabled value="">Select an option</NimbleListOption>
                                        <NimbleListOptionGroup label="Group 1">
                                            <NimbleListOption value="1">Option 1</NimbleListOption>
                                            <NimbleListOption value="2">Option 2</NimbleListOption>
                                        </NimbleListOptionGroup>
                                        <NimbleListOptionGroup label="Group 2">
                                            <NimbleListOption value="3">Option 3</NimbleListOption>
                                            <NimbleListOption value="4">Option 4</NimbleListOption>
                                        </NimbleListOptionGroup>
                                    </NimbleSelect>
                                    <NimbleSelect
                                        appearance="outline"
                                        value={outlineSelectValue}
                                        onChange={e => setOutlineSelectValue(e.target.value)}
                                    >
                                        Outline Select
                                        <NimbleListOption hidden selected disabled value="">Select an option</NimbleListOption>
                                        <NimbleListOptionGroup label="Group 1">
                                            <NimbleListOption>Option 1</NimbleListOption>
                                            <NimbleListOption>Option 2</NimbleListOption>
                                        </NimbleListOptionGroup>
                                        <NimbleListOptionGroup label="Group 2">
                                            <NimbleListOption>Option 3</NimbleListOption>
                                            <NimbleListOption>Option 4</NimbleListOption>
                                        </NimbleListOptionGroup>
                                    </NimbleSelect>
                                    <NimbleSelect
                                        appearance="block"
                                        value={blockSelectValue}
                                        onChange={e => setBlockSelectValue(e.target.value)}
                                    >
                                        Block Select
                                        <NimbleListOption hidden selected disabled value="">Select an option</NimbleListOption>
                                        <NimbleListOptionGroup label="Group 1">
                                            <NimbleListOption>Option 1</NimbleListOption>
                                            <NimbleListOption>Option 2</NimbleListOption>
                                        </NimbleListOptionGroup>
                                        <NimbleListOptionGroup label="Group 2">
                                            <NimbleListOption>Option 3</NimbleListOption>
                                            <NimbleListOption>Option 4</NimbleListOption>
                                        </NimbleListOptionGroup>
                                    </NimbleSelect>
                                    <div className="sub-container">
                                        <div className="container-label">Select with dynamic options</div>
                                        <NimbleSelect
                                            ref={dynamicSelectRef}
                                            appearance="underline"
                                            filterMode="manual"
                                            value={dynamicSelectValue ? `${dynamicSelectValue.first}-${dynamicSelectValue.last}` : ''}
                                            onChange={onDynamicSelectChange}
                                            onFilterInput={onDynamicSelectFilterInput}
                                        >
                                            <NimbleListOption hidden selected disabled value="">
                                                Select an option
                                            </NimbleListOption>
                                            {dynamicSelectItems.map(item => (
                                                <NimbleListOption
                                                    key={`${item.first}-${item.last}`}
                                                    value={`${item.first}-${item.last}`}
                                                    hidden={shouldHideItem(item)}
                                                >
                                                    {item.first} {item.last}
                                                </NimbleListOption>
                                            ))}
                                        </NimbleSelect>
                                    </div>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Combobox</div>
                                    <NimbleCombobox
                                        aria-label="Combobox"
                                        appearance="underline"
                                        autocomplete="both"
                                        placeholder="Select value..."
                                    >
                                        Underline Combobox
                                        {comboboxItems.map((item, index) => (
                                            <NimbleListOption key={index}>{item.first}</NimbleListOption>
                                        ))}
                                    </NimbleCombobox>
                                    <NimbleCombobox
                                        aria-label="Combobox"
                                        appearance="outline"
                                        autocomplete="both"
                                        placeholder="Select value..."
                                    >
                                        Outline Combobox
                                        {comboboxItems.map((item, index) => (
                                            <NimbleListOption key={index}>{item.first}</NimbleListOption>
                                        ))}
                                    </NimbleCombobox>
                                    <NimbleCombobox
                                        aria-label="Combobox"
                                        appearance="block"
                                        autocomplete="both"
                                        placeholder="Select value..."
                                    >
                                        Block Combobox
                                        {comboboxItems.map((item, index) => (
                                            <NimbleListOption key={index}>{item.first}</NimbleListOption>
                                        ))}
                                    </NimbleCombobox>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Rich Text Editor</div>
                                    <div className="rich-text-editor-container">
                                        <NimbleRichTextEditor
                                            ref={richTextEditorRef}
                                            className="rich-text-editor"
                                            placeholder="Rich text editor"
                                        >
                                            <NimbleRichTextMentionUsers buttonLabel='Mention User' pattern="^user:(.*)">
                                                <NimbleMappingUser keyValue='user:1' displayName='John Doe'></NimbleMappingUser>
                                                <NimbleMappingUser keyValue='user:2' displayName='Mary Wilson'></NimbleMappingUser>
                                            </NimbleRichTextMentionUsers>
                                            <NimbleButton slot="footer-actions"
                                                onClick={loadRichTextEditorContent}
                                            >Load Content</NimbleButton>
                                        </NimbleRichTextEditor>
                                    </div>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Rich Text Viewer</div>
                                    <div className="rich-text-viewer-container">
                                        <NimbleRichTextViewer
                                            markdown={markdownString}
                                        >
                                            <NimbleRichTextMentionUsers buttonLabel='Mention User' pattern="^user:(.*)">
                                                <NimbleMappingUser keyValue='user:1' displayName='John Doe'></NimbleMappingUser>
                                                <NimbleMappingUser keyValue='user:2' displayName='Mary Wilson'></NimbleMappingUser>
                                            </NimbleRichTextMentionUsers>
                                        </NimbleRichTextViewer>
                                    </div>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Spinner</div>
                                    <NimbleSpinner aria-label="Loading example content"></NimbleSpinner>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Switch</div>
                                    <NimbleSwitch>Switch</NimbleSwitch>
                                    <NimbleSwitch checked>
                                        Switch with checked/unchecked messages
                                        <span slot="unchecked-message">Off</span>
                                        <span slot="checked-message">On</span>
                                    </NimbleSwitch>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Table</div>
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
                                                icon="nimble-icon-check"
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
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Table with delayed hierarchy</div>
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
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Tabs</div>
                                    <NimbleTabs
                                        activeid={activeTabId}
                                        onChange={e => setActiveTabId(e.target.activeid)}
                                    >
                                        <NimbleTab id="tab-1">Tab 1</NimbleTab>
                                        <NimbleTab id="tab-2">Tab 2</NimbleTab>
                                        <NimbleTab id="tab-3" disabled>Tab 3 (Disabled)</NimbleTab>
                                        <NimbleTabsToolbar>
                                            <NimbleButton
                                                onClick={onTabToolbarButtonClick}
                                            >Toolbar button</NimbleButton>
                                        </NimbleTabsToolbar>
                                        <NimbleTabPanel>
                                            <div className="container-label">Tab 1 content</div>
                                        </NimbleTabPanel>
                                        <NimbleTabPanel>
                                            <div className="container-label">Tab 2 content</div>
                                        </NimbleTabPanel>
                                        <NimbleTabPanel>
                                            <div className="container-label">Tab 3 content</div>
                                        </NimbleTabPanel>
                                    </NimbleTabs>
                                    <label id="activeTabLabel">
                                        Active tab:
                                    </label>
                                    <NimbleSelect
                                        value={activeTabId}
                                        onChange={e => setActiveTabId(e.target.value)}
                                        aria-labelledby="activeTabLabel">
                                        <NimbleListOption value="tab-1">Tab 1</NimbleListOption>
                                        <NimbleListOption value="tab-2">Tab 2</NimbleListOption>
                                        <NimbleListOption value="tab-3">Tab 3</NimbleListOption>
                                    </NimbleSelect>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Tabs - Anchor</div>
                                    <NimbleAnchorTabs
                                        activeid={activeAnchorTabId}
                                    >
                                        <NimbleAnchorTab id="a-tab-1" href="https://nimble.ni.dev">Tab 1</NimbleAnchorTab>
                                        <NimbleAnchorTab id="a-tab-2" href="https://ni.com">Tab 2</NimbleAnchorTab>
                                        <NimbleAnchorTab disabled id="a-tab-3" href="https://google.com">Tab 3 (Disabled)</NimbleAnchorTab>
                                        <NimbleTabsToolbar>
                                            <NimbleButton
                                                onClick={onTabToolbarButtonClick}
                                            >Toolbar button</NimbleButton>
                                        </NimbleTabsToolbar>
                                    </NimbleAnchorTabs>
                                    <label id="activeAnchorTabLabel">
                                        Active tab:
                                    </label>
                                    <NimbleSelect
                                        value={activeAnchorTabId}
                                        onChange={e => setActiveAnchorTabId(e.target.value)}
                                        aria-labelledby="activeAnchorTabLabel">
                                        <NimbleListOption value="a-tab-1">Tab 1</NimbleListOption>
                                        <NimbleListOption value="a-tab-2">Tab 2</NimbleListOption>
                                        <NimbleListOption value="a-tab-3">Tab 3</NimbleListOption>
                                    </NimbleSelect>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Text Area</div>
                                    <NimbleTextArea placeholder="Text Area" cols={50} rows={5} resize="horizontal" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.">Text Area Label</NimbleTextArea>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Text Field</div>
                                    <NimbleTextField appearance="underline" placeholder="Text Field" value="Here is text!">Underline Text Field</NimbleTextField>
                                    <NimbleTextField appearance="outline" placeholder="Text Field" value="Here is text!">Outline Text Field</NimbleTextField>
                                    <NimbleTextField appearance="block" placeholder="Text Field" value="Here is text!">Block Text Field</NimbleTextField>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Toolbar</div>
                                    <NimbleToolbar>
                                        <NimbleButton slot="start" appearance="outline">First button</NimbleButton>
                                        <NimbleButton slot="start" appearance="outline">Second button</NimbleButton>
                                        <NimbleButton>Middle button</NimbleButton>
                                        <NimbleButton slot="end" appearance="outline">Last button</NimbleButton>
                                    </NimbleToolbar>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Tooltip</div>
                                    <NimbleButton id="anchor1">Default</NimbleButton>
                                    <NimbleTooltip anchor="anchor1">Tooltip label</NimbleTooltip>
                                    <NimbleButton id="anchor2">Fail</NimbleButton>
                                    <NimbleTooltip anchor="anchor2" severity="error">Tooltip label</NimbleTooltip>
                                    <NimbleButton id="anchor3">Information</NimbleButton>
                                    <NimbleTooltip anchor="anchor3" severity="information">Tooltip label</NimbleTooltip>
                                    <NimbleButton id="anchor4">Fail Icon </NimbleButton>
                                    <NimbleTooltip anchor="anchor4" severity="error" iconVisible>Tooltip label</NimbleTooltip>
                                    <NimbleButton id="anchor5">Information Icon</NimbleButton>
                                    <NimbleTooltip anchor="anchor5" severity="information" iconVisible>Tooltip label</NimbleTooltip>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Tree View</div>
                                    <NimbleTreeView>
                                        <NimbleTreeItem>
                                            Parent 1
                                            <NimbleTreeItem>Child 1</NimbleTreeItem>
                                            <NimbleAnchorTreeItem
                                                href="#"
                                            >Child 2 (link)</NimbleAnchorTreeItem>
                                            <NimbleTreeItem disabled>Child 3</NimbleTreeItem>
                                        </NimbleTreeItem>
                                        <NimbleTreeItem expanded>
                                            Parent 2
                                            <NimbleTreeItem>Child 2-1</NimbleTreeItem>
                                            <NimbleTreeItem>Child 2-2</NimbleTreeItem>
                                            <NimbleTreeItem>Child 2-3</NimbleTreeItem>
                                        </NimbleTreeItem>
                                    </NimbleTreeView>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Chat Conversation and Messages (Spright)</div>
                                    <SprightChatConversation>
                                        <SprightChatMessage>To start, press any key.</SprightChatMessage>
                                        <SprightChatMessage messageType="outbound">Where is the Any key?</SprightChatMessage>
                                        <SprightChatMessage>
                                            <NimbleSpinner appearance="accent"></NimbleSpinner>
                                        </SprightChatMessage>
                                        <SprightChatMessage messageType="inbound">
                                            <NimbleButton slot="footer-actions" appearance='ghost' contentHidden>
                                                <NimbleIconCopyText slot="start"></NimbleIconCopyText>
                                                Copy
                                            </NimbleButton>
                                            <NimbleIconWebviCustom style={{ height: '100px', width: '100px' }}></NimbleIconWebviCustom>
                                            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                                            <NimbleButton slot="end" appearance="block">Order a tab</NimbleButton>
                                            <NimbleButton slot="end" appearance="block">Check core temperature</NimbleButton>
                                        </SprightChatMessage>
                                        {chatUserMessages.map((message, index) => (
                                            <SprightChatMessage key={index} messageType="outbound">
                                                <span>{message}</span>
                                            </SprightChatMessage>
                                        ))}
                                        <SprightChatInput
                                            slot="input"
                                            placeholder="Type here"
                                            onSend={onChatInputSend}
                                        ></SprightChatInput>
                                    </SprightChatConversation>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Rectangle (Spright)</div>
                                    <SprightRectangle>Spright!</SprightRectangle>
                                </div>
                                <div className="sub-container">
                                    <div className="container-label">Button (Ok)</div>
                                    <OkButton>Ok</OkButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </NimbleThemeProvider>
        </>
    );
}
