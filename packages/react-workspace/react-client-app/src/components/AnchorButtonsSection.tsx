import { NimbleAnchorButton } from '@ni/nimble-react/anchor-button';
import { SubContainer } from './SubContainer';

export function AnchorButtonsSection(): React.JSX.Element {
    return (
        <SubContainer label="Buttons - Anchor">
            <NimbleAnchorButton
                href="#"
                appearance="outline">Outline Anchor Button</NimbleAnchorButton>
            <NimbleAnchorButton
                href="#"
                appearance="block">Block Anchor Button</NimbleAnchorButton>
            <NimbleAnchorButton
                href="#"
                appearance="ghost">Ghost Anchor Button</NimbleAnchorButton>
        </SubContainer>
    );
}
