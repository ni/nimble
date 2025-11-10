# Nimble Angular Components - AI Assistant Guide

This guide helps AI code generation tools like GitHub Copilot generate better code using Nimble with Angular.

## Package Information

- **Package Name**: `@ni/nimble-angular`
- **Framework**: Angular (v14+)
- **Underlying**: Web Components from `@ni/nimble-components`

## Installation

```bash
npm install @ni/nimble-angular
```

## Setup

### 1. Import NimbleModule in app.module.ts (or standalone components)

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { 
    NimbleThemeProviderModule,
    NimbleButtonModule,
    NimbleTextFieldModule,
    // Import other modules as needed
} from '@ni/nimble-angular';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule, // Required for [(ngModel)]
        NimbleThemeProviderModule,
        NimbleButtonModule,
        NimbleTextFieldModule,
        // ... other Nimble modules
    ],
    // ...
})
export class AppModule { }
```

### 2. Add Theme Provider to app.component.html

```html
<nimble-theme-provider theme="light">
    <router-outlet></router-outlet>
</nimble-theme-provider>
```

## Component Modules

Each Nimble component has a corresponding Angular module. Import the modules you need:

```typescript
// Buttons
import { NimbleButtonModule } from '@ni/nimble-angular/button';
import { NimbleAnchorButtonModule } from '@ni/nimble-angular/anchor-button';
import { NimbleMenuButtonModule } from '@ni/nimble-angular/menu-button';
import { NimbleToggleButtonModule } from '@ni/nimble-angular/toggle-button';

// Form Controls
import { NimbleTextFieldModule } from '@ni/nimble-angular/text-field';
import { NimbleTextAreaModule } from '@ni/nimble-angular/text-area';
import { NimbleNumberFieldModule } from '@ni/nimble-angular/number-field';
import { NimbleCheckboxModule } from '@ni/nimble-angular/checkbox';
import { NimbleSwitchModule } from '@ni/nimble-angular/switch';
import { NimbleRadioGroupModule, NimbleRadioModule } from '@ni/nimble-angular/radio-group';
import { NimbleSelectModule } from '@ni/nimble-angular/select';
import { NimbleComboboxModule } from '@ni/nimble-angular/combobox';

// Data Display
import { NimbleTableModule } from '@ni/nimble-angular/table';
import { NimbleCardModule } from '@ni/nimble-angular/card';
import { NimbleCardButtonModule } from '@ni/nimble-angular/card-button';

// Navigation
import { NimbleBreadcrumbModule } from '@ni/nimble-angular/breadcrumb';
import { NimbleTabsModule } from '@ni/nimble-angular/tabs';
import { NimbleAnchorTabsModule } from '@ni/nimble-angular/anchor-tabs';
import { NimbleTreeViewModule } from '@ni/nimble-angular/tree-view';
import { NimbleMenuModule } from '@ni/nimble-angular/menu';

// Feedback
import { NimbleBannerModule } from '@ni/nimble-angular/banner';
import { NimbleDialogModule } from '@ni/nimble-angular/dialog';
import { NimbleDrawerModule } from '@ni/nimble-angular/drawer';
import { NimbleSpinnerModule } from '@ni/nimble-angular/spinner';
import { NimbleTooltipModule } from '@ni/nimble-angular/tooltip';

// Layout
import { NimbleToolbarModule } from '@ni/nimble-angular/toolbar';

// Theme
import { NimbleThemeProviderModule } from '@ni/nimble-angular/theme-provider';
```

## Usage Patterns

### Two-Way Binding with NgModel

Most form controls support `[(ngModel)]` for two-way data binding:

```typescript
// Component
export class MyComponent {
    textValue: string = '';
    numberValue: number | null = null;
    isChecked: boolean = false;
    selectedValue: string = '';
}
```

```html
<!-- Template -->
<nimble-text-field [(ngModel)]="textValue" placeholder="Enter text"></nimble-text-field>
<nimble-number-field [(ngModel)]="numberValue" [min]="0" [max]="100"></nimble-number-field>
<nimble-checkbox [(ngModel)]="isChecked">Accept terms</nimble-checkbox>
<nimble-select [(ngModel)]="selectedValue">
    <nimble-list-option value="1">Option 1</nimble-list-option>
    <nimble-list-option value="2">Option 2</nimble-list-option>
</nimble-select>
```

### Property Binding

Use Angular property binding for attributes:

```html
<nimble-button 
    [appearance]="buttonAppearance"
    [disabled]="isDisabled"
    [contentHidden]="iconOnly">
    Button Text
</nimble-button>

<nimble-text-field
    [value]="textValue"
    [errorText]="validationError"
    [errorVisible]="hasError"
    [required]="true">
</nimble-text-field>
```

### Event Binding

Use Angular event binding for component events:

```html
<nimble-button (click)="handleClick()">Click Me</nimble-button>

<nimble-text-field (input)="handleInput($event)" (change)="handleChange($event)"></nimble-text-field>

<nimble-select (change)="handleSelectionChange($event)">
    <!-- options -->
</nimble-select>

<nimble-dialog #dialog (close)="handleDialogClose($event)">
    <!-- dialog content -->
</nimble-dialog>
```

### Template References

Use template references to call component methods:

```typescript
// Component
export class MyComponent {
    @ViewChild('myDialog', { read: NimbleDialogDirective }) dialog!: NimbleDialogDirective;
    
    openDialog(): void {
        this.dialog.show();
    }
    
    closeDialog(): void {
        this.dialog.close('reason');
    }
}
```

```html
<!-- Template -->
<nimble-dialog #myDialog>
    <span slot="title">Dialog Title</span>
    Dialog content
</nimble-dialog>

<nimble-button (click)="openDialog()">Open Dialog</nimble-button>
```

## Common Patterns

### Form with Validation

```typescript
// Component
export class FormComponent {
    name: string = '';
    email: string = '';
    age: number | null = null;
    
    nameError: string = '';
    emailError: string = '';
    
    get nameHasError(): boolean {
        return this.nameError !== '';
    }
    
    get emailHasError(): boolean {
        return this.emailError !== '';
    }
    
    validateName(): void {
        this.nameError = this.name.trim() === '' ? 'Name is required' : '';
    }
    
    validateEmail(): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.emailError = !emailRegex.test(this.email) ? 'Invalid email format' : '';
    }
    
    submit(): void {
        this.validateName();
        this.validateEmail();
        
        if (!this.nameHasError && !this.emailHasError) {
            // Submit form
        }
    }
}
```

```html
<!-- Template -->
<form (ngSubmit)="submit()">
    <nimble-text-field
        [(ngModel)]="name"
        name="name"
        [required]="true"
        [errorText]="nameError"
        [errorVisible]="nameHasError"
        (blur)="validateName()"
        placeholder="Enter your name">
    </nimble-text-field>
    
    <nimble-text-field
        [(ngModel)]="email"
        name="email"
        type="email"
        [required]="true"
        [errorText]="emailError"
        [errorVisible]="emailHasError"
        (blur)="validateEmail()"
        placeholder="Enter your email">
    </nimble-text-field>
    
    <nimble-number-field
        [(ngModel)]="age"
        name="age"
        [min]="0"
        [max]="120"
        placeholder="Enter your age">
    </nimble-number-field>
    
    <nimble-button type="submit" appearance-variant="primary">Submit</nimble-button>
</form>
```

### Table with Data

```typescript
// Component
export class TableComponent implements OnInit {
    @ViewChild('table', { read: NimbleTableDirective }) table!: NimbleTableDirective<Person>;
    
    people: Person[] = [];
    
    ngOnInit(): void {
        this.loadData();
    }
    
    loadData(): void {
        this.people = [
            { id: '1', firstName: 'John', lastName: 'Doe', age: 30 },
            { id: '2', firstName: 'Jane', lastName: 'Smith', age: 25 },
            { id: '3', firstName: 'Bob', lastName: 'Johnson', age: 35 }
        ];
        this.table.setData(this.people);
    }
    
    handleSelectionChange(): void {
        const selectedIds = this.table.getSelectedRecordIds();
        console.log('Selected IDs:', selectedIds);
    }
}

interface Person {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
}
```

```html
<!-- Template -->
<nimble-table
    #table
    idFieldName="id"
    selectionMode="multi"
    (selectionChange)="handleSelectionChange()">
    
    <nimble-table-column-text
        column-id="first"
        field-name="firstName"
        [sortable]="true"
        [groupable]="true">
        First Name
    </nimble-table-column-text>
    
    <nimble-table-column-text
        column-id="last"
        field-name="lastName"
        [sortable]="true"
        [groupable]="true">
        Last Name
    </nimble-table-column-text>
    
    <nimble-table-column-number-text
        column-id="age"
        field-name="age"
        [sortable]="true">
        Age
    </nimble-table-column-number-text>
</nimble-table>
```

### Dialog Usage

```typescript
// Component
export class DialogComponent {
    @ViewChild('confirmDialog', { read: NimbleDialogDirective }) dialog!: NimbleDialogDirective;
    
    showConfirmation(): void {
        this.dialog.show();
    }
    
    handleConfirm(): void {
        this.dialog.close('confirmed');
        // Perform action
    }
    
    handleCancel(): void {
        this.dialog.close('cancelled');
    }
    
    handleDialogClose(event: Event): void {
        const reason = (event as CustomEvent).detail;
        console.log('Dialog closed with reason:', reason);
    }
}
```

```html
<!-- Template -->
<nimble-button (click)="showConfirmation()" appearance-variant="primary">
    Delete Item
</nimble-button>

<nimble-dialog #confirmDialog (close)="handleDialogClose($event)">
    <span slot="title">Confirm Deletion</span>
    Are you sure you want to delete this item?
    <div slot="footer">
        <nimble-button appearance="ghost" (click)="handleCancel()">Cancel</nimble-button>
        <nimble-button appearance-variant="primary" (click)="handleConfirm()">Delete</nimble-button>
    </div>
</nimble-dialog>
```

### Menu Button

```html
<nimble-menu-button appearance-variant="primary">
    Actions
    <nimble-menu slot="menu">
        <nimble-menu-item (click)="edit()">Edit</nimble-menu-item>
        <nimble-menu-item (click)="delete()">Delete</nimble-menu-item>
        <nimble-menu-item (click)="share()">Share</nimble-menu-item>
    </nimble-menu>
</nimble-menu-button>
```

## TypeScript Enums

Nimble Angular provides TypeScript enums for all enumerated values:

```typescript
import { ButtonAppearance, ButtonAppearanceVariant } from '@ni/nimble-angular/button';
import { TextFieldAppearance } from '@ni/nimble-angular/text-field';
import { BannerSeverity } from '@ni/nimble-angular/banner';
import { Theme } from '@ni/nimble-angular/theme-provider';

// In component
export class MyComponent {
    buttonAppearance = ButtonAppearance.outline;
    buttonVariant = ButtonAppearanceVariant.primary;
    textFieldAppearance = TextFieldAppearance.underline;
    bannerSeverity = BannerSeverity.information;
    theme = Theme.light;
}
```

```html
<!-- In template -->
<nimble-button 
    [appearance]="buttonAppearance"
    [appearanceVariant]="buttonVariant">
    Button
</nimble-button>
```

## Reactive Forms Support

Nimble components work with Angular Reactive Forms:

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class ReactiveFormComponent {
    form: FormGroup;
    
    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            age: [null, [Validators.min(0), Validators.max(120)]],
            agree: [false, Validators.requiredTrue]
        });
    }
    
    submit(): void {
        if (this.form.valid) {
            console.log(this.form.value);
        }
    }
}
```

```html
<form [formGroup]="form" (ngSubmit)="submit()">
    <nimble-text-field
        formControlName="name"
        [required]="true"
        [errorText]="form.controls['name'].errors?.['required'] ? 'Name is required' : ''"
        [errorVisible]="form.controls['name'].invalid && form.controls['name'].touched">
    </nimble-text-field>
    
    <nimble-text-field
        formControlName="email"
        type="email"
        [required]="true"
        [errorText]="form.controls['email'].errors?.['email'] ? 'Invalid email' : ''"
        [errorVisible]="form.controls['email'].invalid && form.controls['email'].touched">
    </nimble-text-field>
    
    <nimble-number-field
        formControlName="age"
        [min]="0"
        [max]="120">
    </nimble-number-field>
    
    <nimble-checkbox formControlName="agree">
        I agree to the terms
    </nimble-checkbox>
    
    <nimble-button type="submit" [disabled]="form.invalid" appearance-variant="primary">
        Submit
    </nimble-button>
</form>
```

## Icons

Import icon modules:

```typescript
import { NimbleIconCheckModule } from '@ni/nimble-angular/icon-check';
import { NimbleIconXmarkModule } from '@ni/nimble-angular/icon-xmark';
```

Use in templates:

```html
<nimble-button>
    <nimble-icon-check slot="start"></nimble-icon-check>
    Confirm
</nimble-button>
```

## Best Practices

1. **Import FormsModule** to use `[(ngModel)]`
2. **Import ReactiveFormsModule** to use reactive forms
3. **Use ViewChild with directive classes** (e.g., `NimbleDialogDirective`) to access component methods
4. **Use TypeScript enums** for type safety with enumerated values
5. **Validate forms** and use `errorText` and `errorVisible` for feedback
6. **Always wrap app in theme provider** in app.component.html
7. **Import specific modules** rather than a single barrel module for better tree-shaking

## Additional Resources

- Nimble Angular Storybook: https://ni.github.io/nimble/storybook
- Angular Integration Examples: https://ni.github.io/nimble/storybook/example-client-app
- GitHub Repository: https://github.com/ni/nimble
