import { NimbleCheckbox } from '@ni/nimble-react/checkbox';
import { SubContainer } from './SubContainer';

export function CheckboxSection(): React.JSX.Element {
    return (
        <SubContainer label="Checkbox">
            <NimbleCheckbox>Checkbox label</NimbleCheckbox>
            <NimbleCheckbox>Checkbox label</NimbleCheckbox>
            <NimbleCheckbox>Checkbox label</NimbleCheckbox>
        </SubContainer>
    );
}
