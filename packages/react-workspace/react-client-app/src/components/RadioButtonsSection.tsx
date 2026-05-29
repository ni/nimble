import { useState } from 'react';
import { NimbleRadioGroup } from '@ni/nimble-react/radio-group';
import { NimbleRadio } from '@ni/nimble-react/radio';
import { NimbleTextField } from '@ni/nimble-react/text-field';
import { SubContainer } from './SubContainer';

export function RadioButtonsSection(): React.JSX.Element {
    const [selectedRadio, setSelectedRadio] = useState('mango');

    return (
        <SubContainer label="Radio Buttons">
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
        </SubContainer>
    );
}
