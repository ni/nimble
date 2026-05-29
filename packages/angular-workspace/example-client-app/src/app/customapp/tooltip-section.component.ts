import { Component } from '@angular/core';

@Component({
    selector: 'example-tooltip-section',
    template: `
        <example-sub-container label="Tooltip">
            <nimble-button id="anchor1">Default</nimble-button>
            <nimble-tooltip anchor="anchor1">Tooltip label</nimble-tooltip>
            <nimble-button id="anchor2">Fail</nimble-button>
            <nimble-tooltip anchor="anchor2" severity="error">Tooltip label</nimble-tooltip>
            <nimble-button id="anchor3">Information</nimble-button>
            <nimble-tooltip anchor="anchor3" severity="information">Tooltip label</nimble-tooltip>
            <nimble-button id="anchor4">Fail Icon </nimble-button>
            <nimble-tooltip anchor="anchor4" severity="error" icon-visible>Tooltip label</nimble-tooltip>
            <nimble-button id="anchor5">Information Icon</nimble-button>
            <nimble-tooltip anchor="anchor5" severity="information" icon-visible>Tooltip label</nimble-tooltip>
        </example-sub-container>
    `,
    standalone: false
})
export class TooltipSectionComponent {}
