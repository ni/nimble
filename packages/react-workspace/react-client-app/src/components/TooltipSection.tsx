import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleTooltip } from '@ni/nimble-react/tooltip';
import { SubContainer } from './SubContainer';

export function TooltipSection(): React.JSX.Element {
    return (
        <SubContainer label="Tooltip">
            <NimbleButton id="anchor1">Default</NimbleButton>
            <NimbleTooltip anchor="anchor1">Tooltip label</NimbleTooltip>
            <NimbleButton id="anchor2">Fail</NimbleButton>
            <NimbleTooltip anchor="anchor2" severity="error">Tooltip label</NimbleTooltip>
            <NimbleButton id="anchor3">Information</NimbleButton>
            <NimbleTooltip anchor="anchor3" severity="information">Tooltip label</NimbleTooltip>
            <NimbleButton id="anchor4">Fail Icon </NimbleButton>
            <NimbleTooltip anchor="anchor4" severity="error" iconVisible>Tooltip label</NimbleTooltip>
            <NimbleButton id="anchor5">Information Icon</NimbleButton>
            <NimbleTooltip anchor="anchor5" severity="information" iconVisible>Tooltip label</NimbleTooltip>
        </SubContainer>
    );
}
