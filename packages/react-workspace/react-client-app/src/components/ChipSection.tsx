import { useState } from 'react';
import { NimbleChip } from '@ni/nimble-react/chip';
import { SubContainer } from './SubContainer';

export function ChipSection(): React.JSX.Element {
    const [chipSelected, setChipSelected] = useState(false);

    function onChipRemove(): void {
        alert('Chip removed');
    }

    return (
        <SubContainer label="Chip">
            <NimbleChip>Outline Chip</NimbleChip>
            <NimbleChip appearance="block">Block Chip</NimbleChip>
            <NimbleChip selectable selected={chipSelected} onSelectedChange={() => setChipSelected(value => !value)}>
                Selectable Chip
            </NimbleChip>
            <NimbleChip removable onRemove={onChipRemove}>Removable Chip</NimbleChip>
            <NimbleChip disabled>Disabled Chip</NimbleChip>
        </SubContainer>
    );
}
