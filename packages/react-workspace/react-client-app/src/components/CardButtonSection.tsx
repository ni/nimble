import { NimbleCardButton } from '@ni/nimble-react/card-button';
import { SubContainer } from './SubContainer';

export function CardButtonSection(): React.JSX.Element {
    return (
        <SubContainer label="Card Button">
            <NimbleCardButton>
                <span className="card-button-content">Card Button</span>
            </NimbleCardButton>
            <NimbleCardButton selected>
                <span className="card-button-content">Selected Card Button</span>
            </NimbleCardButton>
        </SubContainer>
    );
}
