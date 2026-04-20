import { NimbleStepper } from '@ni/nimble-react/stepper';
import { NimbleAnchorStep } from '@ni/nimble-react/anchor-step';
import { SubContainer } from './SubContainer';

export function StepperAnchorSection(): React.JSX.Element {
    return (
        <SubContainer label="Stepper - Anchor">
            <NimbleStepper>
                <NimbleAnchorStep severity='success' href='https://nimble.ni.dev'>
                    <span slot="title">First step</span>
                    <span slot="subtitle">Something we did</span>
                </NimbleAnchorStep>
                <NimbleAnchorStep selected href='https://ni.com'>
                    <span slot="title">Second step</span>
                    <span slot="subtitle">Something we are doing</span>
                </NimbleAnchorStep>
                <NimbleAnchorStep href='https://google.com'>
                    <span slot="title">Third step</span>
                    <span slot="subtitle">Something to do</span>
                </NimbleAnchorStep>
            </NimbleStepper>
        </SubContainer>
    );
}
