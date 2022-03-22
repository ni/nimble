import { Component } from '@angular/core';
import { DrawerLocation } from '@ni/nimble-angular';

@Component({
    selector: 'example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss']
})
export class CustomAppComponent {
    public drawerLocation: DrawerLocation = DrawerLocation.Right;
    public isDrawerPinned = false;
    public drawerLocations = DrawerLocation;
}
