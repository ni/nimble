import { NimbleCard } from '@ni/nimble-react/card';
import { NimbleNumberField } from '@ni/nimble-react/number-field';
import { NimbleSelect } from '@ni/nimble-react/select';
import { NimbleListOption } from '@ni/nimble-react/list-option';
import { SubContainer } from './SubContainer';

export function CardSection(): React.JSX.Element {
    return (
        <SubContainer label="Card">
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
        </SubContainer>
    );
}
