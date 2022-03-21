import { Component } from '@angular/core';
import { DrawerLocation, NimbleCheckboxDirective } from '@ni/nimble-angular';

@Component({
    selector: 'example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss']
})
export class CustomAppComponent {
    public drawerLocation: DrawerLocation = DrawerLocation.Right;
    public isDrawerPinned = false;
    public drawerLocations = DrawerLocation;
    public checkboxState: string;
    public onCheckBoxValueChange(event: Event): void {
        const checked = (event.target as unknown as NimbleCheckboxDirective).checked ? '' : 'not ';
        this.checkboxState = `The checkbox is ${checked}checked`;
    }
}
