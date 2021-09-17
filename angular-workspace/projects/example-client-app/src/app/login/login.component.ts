import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';
import { NimbleTheme } from '@ni/nimble-components/dist/esm/theme-provider/themes';

@Component({
    selector: 'nimble-example-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public loginForm: FormGroup;
    public theme: NimbleTheme = NimbleTheme.Light;
    public themes = NimbleTheme;
    public buttonAppearance = ButtonAppearance;

    public constructor(private readonly formBuilder: FormBuilder, private readonly router: Router) {
        this.loginForm = this.formBuilder.group({
            username: [''],
            password: ['', Validators.required]
        });
    }

    public onSubmit(): void {
        void this.router.navigate(['/customapp']);
    }
}
