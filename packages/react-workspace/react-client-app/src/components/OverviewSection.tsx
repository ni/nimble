import { NimbleAnchor } from '@ni/nimble-react/anchor';
import { SubContainer } from './SubContainer';

export function OverviewSection(): React.JSX.Element {
    return (
        <SubContainer label="Overview">
            Explore the components below to see the Nimble components in action.
            See the <NimbleAnchor href="https://nimble.ni.dev/storybook/">Nimble component docs</NimbleAnchor> for additional usage details.
            Navigate to the <NimbleAnchor href="../index.html">parent page</NimbleAnchor>.
        </SubContainer>
    );
}
