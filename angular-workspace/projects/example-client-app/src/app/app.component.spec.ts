import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NimbleNumberFieldModule, NimbleTextFieldModule } from '@ni/nimble-angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                NimbleTextFieldModule,
                NimbleNumberFieldModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
