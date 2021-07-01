import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NimbleTextFieldModule } from '@ni/nimble-angular';
import { NimbleNumberFieldModule } from '@ni/nimble-angular'

import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        NimbleTextFieldModule,
        NimbleNumberFieldModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
