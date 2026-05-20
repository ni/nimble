import { NimbleButton } from '@ni/nimble-react/button';
import { SubContainer } from './SubContainer';

export function ButtonsSection(): React.JSX.Element {
    return (
        <SubContainer label="Buttons">
            <NimbleButton appearance="outline">Outline Button</NimbleButton>
            <NimbleButton appearance="block">Block Button</NimbleButton>
            <NimbleButton appearance="ghost">Ghost Button</NimbleButton>
        </SubContainer>
    );
}
