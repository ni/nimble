import { OkButton } from '@ni/ok-react/button';
import { SubContainer } from './SubContainer';

export function OkButtonSection(): React.JSX.Element {
    return (
        <SubContainer label="Button (Ok)">
            <OkButton>Ok</OkButton>
        </SubContainer>
    );
}
