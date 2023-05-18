import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonAppearance } from '../../../public-api';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { NimbleToggleButtonDirective, ToggleButton } from '../nimble-toggle-button.directive';
import { NimbleToggleButtonModule } from '../nimble-toggle-button.module';

describe('Nimble toggle button', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleToggleButtonModule]
            });
        });

        it('defines custom element', () => {
            expect(customElements.get('nimble-toggle-button')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-toggle-button #toggleButton></nimble-toggle-button>
            `
        })
        class TestHostComponent {
            @ViewChild('toggleButton', { read: NimbleToggleButtonDirective }) public directive: NimbleToggleButtonDirective;
            @ViewChild('toggleButton', { read: ElementRef }) public elementRef: ElementRef<ToggleButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleToggleButtonDirective;
        let nativeElement: ToggleButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleToggleButtonModule]
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
            expect(directive.appearance).toBe(ButtonAppearance.outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.outline);
        });

        it('has expected defaults for contentHidden', () => {
            expect(directive.contentHidden).toBeFalse();
            expect(nativeElement.contentHidden).toBeFalse();
        });

        it('has expected defaults for checked', () => {
            expect(directive.checked).toBeFalse();
            expect(nativeElement.checked).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-toggle-button #toggleButton
                    disabled
                    appearance="${ButtonAppearance.ghost}"
                    content-hidden
                    checked>
                </nimble-toggle-button>`
        })
        class TestHostComponent {
            @ViewChild('toggleButton', { read: NimbleToggleButtonDirective }) public directive: NimbleToggleButtonDirective;
            @ViewChild('toggleButton', { read: ElementRef }) public elementRef: ElementRef<ToggleButton>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleToggleButtonDirective;
        let nativeElement: ToggleButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleToggleButtonModule]
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
            expect(directive.appearance).toBe(ButtonAppearance.ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.ghost);
        });

        it('will use template string values for contentHidden', () => {
            expect(directive.contentHidden).toBeTrue();
            expect(nativeElement.contentHidden).toBeTrue();
        });

        it('will use template string values for checked', () => {
            expect(directive.checked).toBeTrue();
            expect(nativeElement.checked).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-toggle-button #toggleButton
                    [disabled]="disabled"
                    [appearance]="appearance"
                    [content-hidden]="contentHidden"
                    [checked]="checked">
                </nimble-toggle-button>
            `
        })
        class TestHostComponent {
            @ViewChild('toggleButton', { read: NimbleToggleButtonDirective }) public directive: NimbleToggleButtonDirective;
            @ViewChild('toggleButton', { read: ElementRef }) public elementRef: ElementRef<ToggleButton>;
            public disabled = false;
            public appearance: ButtonAppearance = ButtonAppearance.outline;
            public contentHidden = false;
            public checked = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleToggleButtonDirective;
        let nativeElement: ToggleButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleToggleButtonModule]
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
            expect(directive.appearance).toBe(ButtonAppearance.outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.outline);

            fixture.componentInstance.appearance = ButtonAppearance.ghost;
            fixture.detectChanges();

            expect(directive.appearance).toBe(ButtonAppearance.ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.ghost);
        });

        it('can be configured with property binding for contentHidden', () => {
            expect(directive.contentHidden).toBeFalse();
            expect(nativeElement.contentHidden).toBeFalse();

            fixture.componentInstance.contentHidden = true;
            fixture.detectChanges();

            expect(directive.contentHidden).toBeTrue();
            expect(nativeElement.contentHidden).toBeTrue();
        });

        it('can be configured with property binding for checked', () => {
            expect(directive.checked).toBeFalse();
            expect(nativeElement.checked).toBeFalse();

            fixture.componentInstance.checked = true;
            fixture.detectChanges();

            expect(directive.checked).toBeTrue();
            expect(nativeElement.checked).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-toggle-button #toggleButton
                    [attr.disabled]="disabled"
                    [attr.appearance]="appearance"
                    [attr.content-hidden]="contentHidden"
                    [attr.checked]="checked">
                </nimble-toggle-button>
            `
        })
        class TestHostComponent {
            @ViewChild('toggleButton', { read: NimbleToggleButtonDirective }) public directive: NimbleToggleButtonDirective;
            @ViewChild('toggleButton', { read: ElementRef }) public elementRef: ElementRef<ToggleButton>;
            public disabled: BooleanValueOrAttribute = null;
            public appearance: ButtonAppearance = ButtonAppearance.outline;
            public contentHidden: BooleanValueOrAttribute = null;
            public checked: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleToggleButtonDirective;
        let nativeElement: ToggleButton;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleToggleButtonModule]
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
            expect(directive.appearance).toBe(ButtonAppearance.outline);
            expect(nativeElement.appearance).toBe(ButtonAppearance.outline);

            fixture.componentInstance.appearance = ButtonAppearance.ghost;
            fixture.detectChanges();

            expect(directive.appearance).toBe(ButtonAppearance.ghost);
            expect(nativeElement.appearance).toBe(ButtonAppearance.ghost);
        });

        it('can be configured with attribute binding for contentHidden', () => {
            expect(directive.contentHidden).toBeFalse();
            expect(nativeElement.contentHidden).toBeFalse();

            fixture.componentInstance.contentHidden = '';
            fixture.detectChanges();

            expect(directive.contentHidden).toBeTrue();
            expect(nativeElement.contentHidden).toBeTrue();
        });

        it('can be configured with attribute binding for checked', () => {
            expect(directive.checked).toBeFalse();
            expect(nativeElement.checked).toBeFalse();

            fixture.componentInstance.checked = '';
            fixture.detectChanges();

            expect(directive.checked).toBeTrue();
            expect(nativeElement.checked).toBeTrue();
        });
    });
});
