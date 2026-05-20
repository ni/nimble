import { SprightRectangle } from '@ni/spright-react/rectangle';
import { SubContainer } from './SubContainer';

export function RectangleSection(): React.JSX.Element {
    return (
        <SubContainer label="Rectangle (Spright)">
            <SprightRectangle>Spright!</SprightRectangle>
        </SubContainer>
    );
}
