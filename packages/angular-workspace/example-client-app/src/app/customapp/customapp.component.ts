import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss'],
    standalone: false
})
export class CustomAppComponent {
    public constructor(@Inject(ActivatedRoute) public readonly route: ActivatedRoute) {}
}
