import { NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NimbleTextFieldModule, NimbleNumberFieldModule, NimbleSelectModule, NimbleListboxOptionModule,
    NimbleButtonModule, NimbleTreeViewModule, NimbleTreeItemModule, NimbleThemeProviderModule } from '@ni/nimble-angular';

import { AppComponent } from './app.component';
import { CustomAppComponent } from './customapp/customapp.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        CustomAppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        NimbleThemeProviderModule,
        NimbleTextFieldModule,
        NimbleNumberFieldModule,
        NimbleSelectModule,
        NimbleListboxOptionModule,
        NimbleButtonModule,
        NimbleTreeViewModule,
        NimbleTreeItemModule,
        RouterModule.forRoot([
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'customapp', component: CustomAppComponent }
        ],
        { useHash: true })
    ],
    providers: [FormBuilder],
    bootstrap: [AppComponent]
})
export class AppModule { }
