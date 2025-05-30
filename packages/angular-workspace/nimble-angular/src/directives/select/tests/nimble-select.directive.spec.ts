import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { DropdownAppearance } from '../../../public-api';
import { FilterMode, NimbleSelectDirective, type Select } from '../nimble-select.directive';
import { NimbleSelectModule } from '../nimble-select.module';

describe('Nimble select', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleSelectModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-select')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-select #select></nimble-select>
            `
        })
        class TestHostComponent {
            @ViewChild('select', { read: NimbleSelectDirective }) public directive: NimbleSelectDirective;
            @ViewChild('select', { read: ElementRef }) public elementRef: ElementRef<Select>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSelectDirective;
        let nativeElement: Select;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();
        });

        it('has expected defaults for appearance', () => {
            expect(directive.appearance).toBe(DropdownAppearance.underline);
            expect(nativeElement.appearance).toBe(DropdownAppearance.underline);
        });

        it('has expected defaults for filterMode', () => {
            expect(directive.filterMode).toBe(FilterMode.none);
            expect(nativeElement.filterMode).toBe(FilterMode.none);
        });

        it('has expected defaults for clearable', () => {
            expect(directive.clearable).toBe(false);
            expect(nativeElement.clearable).toBe(false);
        });

        it('has expected defaults for errorText', () => {
            expect(directive.errorText).toBeUndefined();
            expect(nativeElement.errorText).toBeUndefined();
        });

        it('can use the directive to set errorText', () => {
            directive.errorText = 'new value';
            expect(nativeElement.errorText).toBe('new value');
        });

        it('has expected defaults for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();
        });

        it('can use the directive to set errorVisible', () => {
            directive.errorVisible = true;
            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });

        it('has expected defaults for loadingVisible', () => {
            expect(directive.loadingVisible).toBeFalse();
            expect(nativeElement.loadingVisible).toBeFalse();
        });

        it('has expected defaults for requiredVisible', () => {
            expect(directive.requiredVisible).toBeFalse();
            expect(nativeElement.requiredVisible).toBeFalse();
        });

        it('can use the directive to set requiredVisible', () => {
            directive.requiredVisible = true;
            expect(directive.requiredVisible).toBeTrue();
            expect(nativeElement.requiredVisible).toBeTrue();
        });

        it('has expected defaults for appearanceReadOnly', () => {
            expect(directive.appearanceReadOnly).toBeFalse();
            expect(nativeElement.appearanceReadOnly).toBeFalse();
        });

        it('can use the directive to set appearanceReadOnly', () => {
            directive.appearanceReadOnly = true;
            expect(directive.appearanceReadOnly).toBeTrue();
            expect(nativeElement.appearanceReadOnly).toBeTrue();
        });

        it('has expected defaults for fullBleed', () => {
            expect(directive.fullBleed).toBeFalse();
            expect(nativeElement.fullBleed).toBeFalse();
        });

        it('can use the directive to set fullBleed', () => {
            directive.fullBleed = true;
            expect(directive.fullBleed).toBeTrue();
            expect(nativeElement.fullBleed).toBeTrue();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-select #select
                    disabled
                    appearance="${DropdownAppearance.block}"
                    filter-mode="${FilterMode.standard}"
                    clearable
                    error-text="error text"
                    error-visible
                    loading-visible
                    required-visible
                    appearance-readonly
                    full-bleed
                >
                </nimble-select>
            `
        })
        class TestHostComponent {
            @ViewChild('select', { read: NimbleSelectDirective }) public directive: NimbleSelectDirective;
            @ViewChild('select', { read: ElementRef }) public elementRef: ElementRef<Select>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSelectDirective;
        let nativeElement: Select;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for disabled', () => {
            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('will use template string values for appearance', () => {
            expect(directive.appearance).toBe(DropdownAppearance.block);
            expect(nativeElement.appearance).toBe(DropdownAppearance.block);
        });

        it('will use template string values for filterMode', () => {
            expect(directive.filterMode).toBe(FilterMode.standard);
            expect(nativeElement.filterMode).toBe(FilterMode.standard);
        });

        it('will use template string values for clearable', () => {
            expect(directive.clearable).toBeTrue();
            expect(nativeElement.clearable).toBeTrue();
        });

        it('will use template string values for errorText', () => {
            expect(directive.errorText).toBe('error text');
            expect(nativeElement.errorText).toBe('error text');
        });

        it('will use template string values for errorVisible', () => {
            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });

        it('will use template string values for loadingVisible', () => {
            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });

        it('will use template string values for requiredVisible', () => {
            expect(directive.requiredVisible).toBeTrue();
            expect(nativeElement.requiredVisible).toBeTrue();
        });

        it('will use template string values for appearanceReadOnly', () => {
            expect(directive.appearanceReadOnly).toBeTrue();
            expect(nativeElement.appearanceReadOnly).toBeTrue();
        });

        it('will use template string values for fullBleed', () => {
            expect(directive.fullBleed).toBeTrue();
            expect(nativeElement.fullBleed).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-select #select
                    [disabled] = "disabled"
                    [appearance]="appearance"
                    [filter-mode]="filterMode"
                    [clearable]="clearable"
                    [error-text]="errorText"
                    [error-visible]="errorVisible"
                    [loading-visible]="loadingVisible"
                    [required-visible]="requiredVisible"
                    [appearance-readonly]="appearanceReadOnly"
                    [full-bleed]="fullBleed"
                >
                </nimble-select>
            `
        })
        class TestHostComponent {
            @ViewChild('select', { read: NimbleSelectDirective }) public directive: NimbleSelectDirective;
            @ViewChild('select', { read: ElementRef }) public elementRef: ElementRef<Select>;
            public disabled = false;
            public appearance: DropdownAppearance = DropdownAppearance.block;
            public filterMode: FilterMode = FilterMode.standard;
            public clearable = false;
            public errorText = 'initial value';
            public errorVisible = false;
            public loadingVisible = false;
            public requiredVisible = false;
            public appearanceReadOnly = false;
            public fullBleed = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSelectDirective;
        let nativeElement: Select;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = true;
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with property binding for appearance', () => {
            expect(directive.appearance).toBe(DropdownAppearance.block);
            expect(nativeElement.appearance).toBe(DropdownAppearance.block);

            fixture.componentInstance.appearance = DropdownAppearance.outline;
            fixture.detectChanges();

            expect(directive.appearance).toBe(DropdownAppearance.outline);
            expect(nativeElement.appearance).toBe(DropdownAppearance.outline);
        });

        it('can be configured with property binding for filterMode', () => {
            expect(directive.filterMode).toBe(FilterMode.standard);
            expect(nativeElement.filterMode).toBe(FilterMode.standard);

            fixture.componentInstance.filterMode = FilterMode.none;
            fixture.detectChanges();

            expect(directive.filterMode).toBe(FilterMode.none);
            expect(nativeElement.filterMode).toBe(FilterMode.none);
        });

        it('can be configured with property binding for clearable', () => {
            expect(directive.clearable).toBeFalse();
            expect(nativeElement.clearable).toBeFalse();

            fixture.componentInstance.clearable = true;
            fixture.detectChanges();

            expect(directive.clearable).toBeTrue();
            expect(nativeElement.clearable).toBeTrue();
        });

        it('can be configured with property binding for errorText', () => {
            expect(directive.errorText).toBe('initial value');
            expect(nativeElement.errorText).toBe('initial value');

            fixture.componentInstance.errorText = 'new value';
            fixture.detectChanges();

            expect(directive.errorText).toBe('new value');
            expect(nativeElement.errorText).toBe('new value');
        });

        it('can be configured with property binding for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();

            fixture.componentInstance.errorVisible = true;
            fixture.detectChanges();

            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });

        it('can be configured with property binding for loadingVisible', () => {
            expect(directive.loadingVisible).toBeFalse();
            expect(nativeElement.loadingVisible).toBeFalse();

            fixture.componentInstance.loadingVisible = true;
            fixture.detectChanges();

            expect(directive.loadingVisible).toBeTrue();
            expect(nativeElement.loadingVisible).toBeTrue();
        });

        it('can be configured with property binding for requiredVisible', () => {
            expect(directive.requiredVisible).toBeFalse();
            expect(nativeElement.requiredVisible).toBeFalse();

            fixture.componentInstance.requiredVisible = true;
            fixture.detectChanges();

            expect(directive.requiredVisible).toBeTrue();
            expect(nativeElement.requiredVisible).toBeTrue();
        });

        it('can be configured with property binding for appearanceReadOnly', () => {
            expect(directive.appearanceReadOnly).toBeFalse();
            expect(nativeElement.appearanceReadOnly).toBeFalse();

            fixture.componentInstance.appearanceReadOnly = true;
            fixture.detectChanges();

            expect(directive.appearanceReadOnly).toBeTrue();
            expect(nativeElement.appearanceReadOnly).toBeTrue();
        });

        it('can be configured with property binding for fullBleed', () => {
            expect(directive.fullBleed).toBeFalse();
            expect(nativeElement.fullBleed).toBeFalse();

            fixture.componentInstance.fullBleed = true;
            fixture.detectChanges();

            expect(directive.fullBleed).toBeTrue();
            expect(nativeElement.fullBleed).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-select #select
                    [attr.disabled]="disabled"
                    [attr.appearance]="appearance"
                    [attr.filter-mode]="filterMode"
                    [attr.clearable]="clearable"
                    [attr.error-text]="errorText"
                    [attr.error-visible]="errorVisible"
                    [attr.loading-visible]="loadingVisible"
                    [attr.required-visible]="requiredVisible"
                    [attr.appearance-readonly]="appearanceReadOnly"
                    [attr.full-bleed]="fullBleed"
                >
                </nimble-select>
            `
        })
        class TestHostComponent {
            @ViewChild('select', { read: NimbleSelectDirective }) public directive: NimbleSelectDirective;
            @ViewChild('select', { read: ElementRef }) public elementRef: ElementRef<Select>;
            public disabled: BooleanValueOrAttribute = null;
            public appearance: DropdownAppearance = DropdownAppearance.block;
            public filterMode: FilterMode;
            public clearable: BooleanValueOrAttribute = null;
            public errorText = 'initial value';
            public errorVisible: BooleanValueOrAttribute = null;
            public loadingVisible: BooleanValueOrAttribute = null;
            public requiredVisible: BooleanValueOrAttribute = null;
            public appearanceReadOnly: BooleanValueOrAttribute = null;
            public fullBleed: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleSelectDirective;
        let nativeElement: Select;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleSelectModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for disabled', () => {
            expect(directive.disabled).toBeFalse();
            expect(nativeElement.disabled).toBeFalse();

            fixture.componentInstance.disabled = '';
            fixture.detectChanges();

            expect(directive.disabled).toBeTrue();
            expect(nativeElement.disabled).toBeTrue();
        });

        it('can be configured with attribute binding for appearance', () => {
            expect(directive.appearance).toBe(DropdownAppearance.block);
            expect(nativeElement.appearance).toBe(DropdownAppearance.block);

            fixture.componentInstance.appearance = DropdownAppearance.outline;
            fixture.detectChanges();

            expect(directive.appearance).toBe(DropdownAppearance.outline);
            expect(nativeElement.appearance).toBe(DropdownAppearance.outline);
        });

        it('can be configured with attribute binding for filterMode', () => {
            expect(directive.filterMode).toBe(FilterMode.none);
            expect(nativeElement.filterMode).toBe(FilterMode.none);

            fixture.componentInstance.filterMode = FilterMode.standard;
            fixture.detectChanges();

            expect(directive.filterMode).toBe(FilterMode.standard);
            expect(nativeElement.filterMode).toBe(FilterMode.standard);
        });

        it('can be configured with attribute binding for clearable', () => {
            expect(directive.clearable).toBeFalse();
            expect(nativeElement.clearable).toBeFalse();

            fixture.componentInstance.clearable = '';
            fixture.detectChanges();

            expect(directive.clearable).toBeTrue();
            expect(nativeElement.clearable).toBeTrue();
        });

        it('can be configured with attribute binding for errorText', () => {
            expect(directive.errorText).toBe('initial value');
            expect(nativeElement.errorText).toBe('initial value');

            fixture.componentInstance.errorText = 'new value';
            fixture.detectChanges();

            expect(directive.errorText).toBe('new value');
            expect(nativeElement.errorText).toBe('new value');
        });

        it('can be configured with attribute binding for errorVisible', () => {
            expect(directive.errorVisible).toBeFalse();
            expect(nativeElement.errorVisible).toBeFalse();

            fixture.componentInstance.errorVisible = '';
            fixture.detectChanges();

            expect(directive.errorVisible).toBeTrue();
            expect(nativeElement.errorVisible).toBeTrue();
        });

        it('can be configured with attribute binding for loadingVisible', () => {
            expect(directive.loadingVisible).toBeFalse();
            expect(nativeElement.loadingVisible).toBeFalse();

            fixture.componentInstance.loadingVisible = '';
            fixture.detectChanges();

            expect(directive.loadingVisible).toBeTrue();
            expect(nativeElement.loadingVisible).toBeTrue();
        });

        it('can be configured with attribute binding for requiredVisible', () => {
            expect(directive.requiredVisible).toBeFalse();
            expect(nativeElement.requiredVisible).toBeFalse();

            fixture.componentInstance.requiredVisible = '';
            fixture.detectChanges();

            expect(directive.requiredVisible).toBeTrue();
            expect(nativeElement.requiredVisible).toBeTrue();
        });

        it('can be configured with attribute binding for appearanceReadOnly', () => {
            expect(directive.appearanceReadOnly).toBeFalse();
            expect(nativeElement.appearanceReadOnly).toBeFalse();

            fixture.componentInstance.appearanceReadOnly = '';
            fixture.detectChanges();

            expect(directive.appearanceReadOnly).toBeTrue();
            expect(nativeElement.appearanceReadOnly).toBeTrue();
        });

        it('can be configured with attribute binding for fullBleed', () => {
            expect(directive.fullBleed).toBeFalse();
            expect(nativeElement.fullBleed).toBeFalse();

            fixture.componentInstance.fullBleed = '';
            fixture.detectChanges();

            expect(directive.fullBleed).toBeTrue();
            expect(nativeElement.fullBleed).toBeTrue();
        });
    });
});