import { Component, Input } from '@angular/core';

@Component({
    selector: 'nimble-angular-text-field',
    templateUrl: './nimble-text-field.component.html',
    styleUrls: ['./nimble-text-field.component.scss']
})
export class NimbleTextFieldComponent {
    @Input() public placeholder = '';
}
