import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NimbleTextFieldModule, NimbleNumberFieldModule, NimbleSelectModule, NimbleListboxOptionModule, NimbleControlValueAccessorModule } from '@ni/nimble-angular';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        NimbleTextFieldModule,
        NimbleNumberFieldModule,
        NimbleSelectModule,
        NimbleListboxOptionModule,
        NimbleControlValueAccessorModule,
        RouterModule.forRoot([
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent }
        ],
        { useHash: true })
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
