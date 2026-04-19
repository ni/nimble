import { NimbleStepper } from '@ni/nimble-react/stepper';
import { NimbleStep } from '@ni/nimble-react/step';
import { SubContainer } from './SubContainer';

export function StepperSection(): React.JSX.Element {
    return (
        <SubContainer label="Stepper">
            <NimbleStepper>
                <NimbleStep severity='success'>
                    <span slot="title">First step</span>
                    <span slot="subtitle">Something we did</span>
                </NimbleStep>
                <NimbleStep selected>
                    <span slot="title">Second step</span>
                    <span slot="subtitle">Something we are doing</span>
                </NimbleStep>
                <NimbleStep>
                    <span slot="title">Third step</span>
                    <span slot="subtitle">Something to do</span>
                </NimbleStep>
            </NimbleStepper>
        </SubContainer>
    );
}
