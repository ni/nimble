import { Component, Input } from '@angular/core';

@Component({
    selector: 'example-sub-container',
    template: `
        <div class="sub-container">
            <div class="container-label" *ngIf="label">{{ label }}</div>
            <ng-content></ng-content>
        </div>
    `,
    styles: [`
        @use '@ni/nimble-angular/styles/tokens' as *;
        .sub-container { margin: $ni-nimble-standard-padding; }
        .container-label {
            font: $ni-nimble-group-header-font;
            color: $ni-nimble-group-header-font-color;
            padding-bottom: $ni-nimble-standard-padding;
        }
    `],
    standalone: false
})
export class SubContainerComponent {
    @Input() public label = '';
}
