import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog, NimbleDialogDirective } from '../nimble-dialog.directive';
import { NimbleDialogModule } from '../nimble-dialog.module';

describe('Nimble dialog', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleDialogModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-dialog')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-dialog #dialog></nimble-dialog>
            `
        })
        class TestHostComponent {
            @ViewChild('dialog', { read: NimbleDialogDirective }) public directive: NimbleDialogDirective;
            @ViewChild('dialog', { read: ElementRef }) public elementRef: ElementRef<Dialog>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleDialogDirective;
        let nativeElement: Dialog;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleDialogModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for preventDismiss', () => {
            expect(directive.preventDismiss).toBeFalse();
            expect(nativeElement.preventDismiss).toBeFalse();
        });

        it('has expected defaults for headerHidden', () => {
            expect(directive.headerHidden).toBeFalse();
            expect(nativeElement.headerHidden).toBeFalse();
        });

        it('has expected defaults for footerHidden', () => {
            expect(directive.footerHidden).toBeFalse();
            expect(nativeElement.footerHidden).toBeFalse();
        });

        it('has expected defaults for open', () => {
            expect(directive.open).toBeFalse();
            expect(nativeElement.open).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-dialog #dialog
                    prevent-dismiss
                    header-hidden
                    footer-hidden>
                </nimble-dialog>`
        })
        class TestHostComponent {
            @ViewChild('dialog', { read: NimbleDialogDirective }) public directive: NimbleDialogDirective;
            @ViewChild('dialog', { read: ElementRef }) public elementRef: ElementRef<Dialog>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleDialogDirective;
        let nativeElement: Dialog;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleDialogModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for preventDismiss', () => {
            expect(directive.preventDismiss).toBeTrue();
            expect(nativeElement.preventDismiss).toBeTrue();
        });

        it('will use template string values for headerHidden', () => {
            expect(directive.headerHidden).toBeTrue();
            expect(nativeElement.headerHidden).toBeTrue();
        });

        it('will use template string values for footerHidden', () => {
            expect(directive.footerHidden).toBeTrue();
            expect(nativeElement.footerHidden).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-dialog #dialog
                    [preventDismiss]="preventDismiss"
                    [headerHidden]="headerHidden"
                    [footerHidden]="footerHidden">
                </nimble-dialog>`
        })
        class TestHostComponent {
            @ViewChild('dialog', { read: NimbleDialogDirective }) public directive: NimbleDialogDirective;
            @ViewChild('dialog', { read: ElementRef }) public elementRef: ElementRef<Dialog>;
            public preventDismiss = false;
            public headerHidden = false;
            public footerHidden = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleDialogDirective;
        let nativeElement: Dialog;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleDialogModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for preventDismiss', () => {
            expect(directive.preventDismiss).toBeFalse();
            expect(nativeElement.preventDismiss).toBeFalse();

            fixture.componentInstance.preventDismiss = true;
            fixture.detectChanges();

            expect(directive.preventDismiss).toBeTrue();
            expect(nativeElement.preventDismiss).toBeTrue();
        });

        it('can be configured with property binding for headerHidden', () => {
            expect(directive.headerHidden).toBeFalse();
            expect(nativeElement.headerHidden).toBeFalse();

            fixture.componentInstance.headerHidden = true;
            fixture.detectChanges();

            expect(directive.headerHidden).toBeTrue();
            expect(nativeElement.headerHidden).toBeTrue();
        });

        it('can be configured with property binding for footerHidden', () => {
            expect(directive.footerHidden).toBeFalse();
            expect(nativeElement.footerHidden).toBeFalse();

            fixture.componentInstance.footerHidden = true;
            fixture.detectChanges();

            expect(directive.footerHidden).toBeTrue();
            expect(nativeElement.footerHidden).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-dialog #dialog
                    [attr.prevent-dismiss]="preventDismiss"
                    [attr.header-hidden]="headerHidden"
                    [attr.footer-hidden]="footerHidden">
                </nimble-dialog>`
        })
        class TestHostComponent {
            @ViewChild('dialog', { read: NimbleDialogDirective }) public directive: NimbleDialogDirective;
            @ViewChild('dialog', { read: ElementRef }) public elementRef: ElementRef<Dialog>;
            public preventDismiss = false;
            public headerHidden = false;
            public footerHidden = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleDialogDirective;
        let nativeElement: Dialog;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleDialogModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for preventDismiss', () => {
            expect(directive.preventDismiss).toBeFalse();
            expect(nativeElement.preventDismiss).toBeFalse();

            fixture.componentInstance.preventDismiss = true;
            fixture.detectChanges();

            expect(directive.preventDismiss).toBeTrue();
            expect(nativeElement.preventDismiss).toBeTrue();
        });

        it('can be configured with attribute binding for headerHidden', () => {
            expect(directive.headerHidden).toBeFalse();
            expect(nativeElement.headerHidden).toBeFalse();

            fixture.componentInstance.headerHidden = true;
            fixture.detectChanges();

            expect(directive.headerHidden).toBeTrue();
            expect(nativeElement.headerHidden).toBeTrue();
        });

        it('can be configured with attribute binding for footerHidden', () => {
            expect(directive.footerHidden).toBeFalse();
            expect(nativeElement.footerHidden).toBeFalse();

            fixture.componentInstance.footerHidden = true;
            fixture.detectChanges();

            expect(directive.footerHidden).toBeTrue();
            expect(nativeElement.footerHidden).toBeTrue();
        });
    });
});
