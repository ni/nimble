import { NimbleAnchor } from '@ni/nimble-react/anchor';
import { SubContainer } from './SubContainer';

export function AnchorSection(): React.JSX.Element {
    return (
        <SubContainer label="Anchor">
            <div><NimbleAnchor href="#" appearance="prominent">Site root</NimbleAnchor></div>
        </SubContainer>
    );
}
