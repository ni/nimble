import { OkFvSearchInput } from '@ni/ok-react/fv/search-input';
import { SubContainer } from '../SubContainer';

export function FvSearchInputSection(): React.JSX.Element {
    return (
        <SubContainer label="Fv Search Input (Ok)">
            <OkFvSearchInput
                appearance="underline"
                placeholder="Search assets"
                value="PXI"
            />
        </SubContainer>
    );
}