import { NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NimbleTextFieldModule, NimbleNumberFieldModule, NimbleSelectModule, NimbleListboxOptionModule,
    NimbleButtonModule, NimbleTreeViewModule, NimbleTreeItemModule, NimbleDrawerModule, NimbleThemeProviderModule,
    NimbleTabModule, NimbleTabPanelModule, NimbleTabsModule, NimbleTabsToolbarModule, NimbleMenuModule,
    NimbleMenuItemModule } from '@ni/nimble-angular';
import { AppComponent } from './app.component';
import { CustomAppComponent } from './customapp/customapp.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { NavDrawerComponent } from './nav-drawer/nav-drawer.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HeaderComponent,
        NavDrawerComponent,
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
        NimbleMenuModule,
        NimbleMenuItemModule,
        NimbleTabsModule,
        NimbleTabModule,
        NimbleTabPanelModule,
        NimbleTabsToolbarModule,
        NimbleDrawerModule,
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
