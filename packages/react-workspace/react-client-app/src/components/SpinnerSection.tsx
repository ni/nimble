import { NimbleSpinner } from '@ni/nimble-react/spinner';
import { SubContainer } from './SubContainer';

export function SpinnerSection(): React.JSX.Element {
    return (
        <SubContainer label="Spinner">
            <NimbleSpinner aria-label="Loading example content"></NimbleSpinner>
        </SubContainer>
    );
}
