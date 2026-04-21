import { OkFvAccordionItem } from '@ni/ok-react/fv/accordion-item';
import { SubContainer } from '../SubContainer';

export function FvAccordionItemSection(): React.JSX.Element {
    return (
        <SubContainer label="Accordion Item (Ok)">
            <OkFvAccordionItem header="Asset details" expanded>
                Calibration assets can expose operator-facing status, location, and ownership details.
            </OkFvAccordionItem>
            <OkFvAccordionItem header="Maintenance history">
                This section starts collapsed to show the default interaction state.
            </OkFvAccordionItem>
        </SubContainer>
    );
}