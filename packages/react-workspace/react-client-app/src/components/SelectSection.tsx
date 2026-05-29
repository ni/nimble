import { useState, useRef } from 'react';
import { NimbleSelect, type Select, type SelectChangeEvent, type SelectFilterInputEvent } from '@ni/nimble-react/select';
import { NimbleListOption } from '@ni/nimble-react/list-option';
import { NimbleListOptionGroup } from '@ni/nimble-react/list-option-group';
import { SubContainer } from './SubContainer';

interface ComboboxItem {
    first: string;
    last: string;
}

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

export function SelectSection(): React.JSX.Element {
    const [underlineSelectValue, setUnderlineSelectValue] = useState('');
    const [outlineSelectValue, setOutlineSelectValue] = useState('');
    const [blockSelectValue, setBlockSelectValue] = useState('');

    const defaultDynamicSelectItems = availableSelectItems.slice(0, 5);
    const [dynamicSelectItems, setDynamicSelectItems] = useState<ComboboxItem[]>(defaultDynamicSelectItems);
    const [dynamicSelectValue, setDynamicSelectValue] = useState<ComboboxItem | null>(null);
    const [hideSelectedItem, setHideSelectedItem] = useState(false);
    const dynamicSelectRef = useRef<Select>(null);
    const dynamicSelectFilterTimeoutRef = useRef<number | undefined>(undefined);
    const dynamicSelectValueRef = useRef<ComboboxItem | null>(null);

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
        <SubContainer label="Select">
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
            <SubContainer label="Select with dynamic options">
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
            </SubContainer>
        </SubContainer>
    );
}
