import { Component, Input } from '@angular/core';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';

@Component({
    selector: 'nimble-angular-button',
    templateUrl: './nimble-button.component.html'
})
export class NimbleButtonComponent {
    @Input() public disabled = false;
    @Input() public appearance = ButtonAppearance.Outline;
}