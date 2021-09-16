import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NimbleTheme } from '@ni/nimble-components/dist/esm/theme-provider/themes';
import { Icons } from '@ni/nimble-components/dist/esm/icons/types';

@Component({
    selector: 'nimble-example-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public loginForm: FormGroup;
    public theme: NimbleTheme = NimbleTheme.Light;
    public themes = NimbleTheme;
    public buttonIconType = Icons;

    public constructor(private readonly formBuilder: FormBuilder) {
        this.loginForm = this.formBuilder.group({
            username: [''],
            password: ['', Validators.required]
        });
    }
}
