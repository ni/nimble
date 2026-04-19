import { NimbleNumberField } from '@ni/nimble-react/number-field';
import { SubContainer } from './SubContainer';

export function NumberFieldSection(): React.JSX.Element {
    return (
        <SubContainer label="Number Field">
            <NimbleNumberField appearance="underline" placeholder="Number Field" value="42">Underline Number Field</NimbleNumberField>
            <NimbleNumberField appearance="outline" placeholder="Number Field" value="42">Outline Number Field</NimbleNumberField>
            <NimbleNumberField appearance="block" placeholder="Number Field" value="42">Block Number Field</NimbleNumberField>
        </SubContainer>
    );
}
