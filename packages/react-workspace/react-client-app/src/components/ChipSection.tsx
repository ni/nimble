import { NimbleChip } from '@ni/nimble-react/chip';
import { SubContainer } from './SubContainer';

export function ChipSection(): React.JSX.Element {

    function onChipRemove(): void {
        alert('Chip removed');
    }

    return (
        <SubContainer label="Chip">
            <NimbleChip>Outline Chip</NimbleChip>
            <NimbleChip appearance="block">Block Chip</NimbleChip>
            <NimbleChip removable onRemove={onChipRemove}>Removable Chip</NimbleChip>
            <NimbleChip disabled>Disabled Chip</NimbleChip>
        </SubContainer>
    );
}
