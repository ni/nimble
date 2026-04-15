import { NimbleCombobox } from '@ni/nimble-react/combobox';
import { NimbleListOption } from '@ni/nimble-react/list-option';
import { SubContainer } from './SubContainer';

interface ComboboxItem {
    first: string;
    last: string;
}

const comboboxItems: ComboboxItem[] = [
    { first: 'foo', last: 'bar' },
    { first: 'Bubba', last: 'Hotep' },
    { first: 'Mister', last: 'Smithers' }
];

export function ComboboxSection(): React.JSX.Element {
    return (
        <SubContainer label="Combobox">
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
        </SubContainer>
    );
}
