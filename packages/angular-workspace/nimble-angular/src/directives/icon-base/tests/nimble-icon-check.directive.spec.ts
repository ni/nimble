import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconSeverity } from '../../../public-api';
import { IconCheck, NimbleIconCheckDirective } from '../../icons/check/nimble-icon-check.directive';
import { NimbleIconCheckModule } from '../../icons/check/nimble-icon-check.module';

// As the icons are generated and have identical apis, testing every icon seemed unnecessary.
// Chose one icon to test directive bindings to represent them all.
describe('Nimble icon check', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NimbleIconCheckModule]
        });
    });

    it('custom element is defined', () => {
        expect(customElements.get('nimble-icon-check')).not.toBeUndefined();
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-icon-check #icon></nimble-icon-check>
            `
        })
        class TestHostComponent {
            @ViewChild('icon', { read: NimbleIconCheckDirective }) public directive: NimbleIconCheckDirective;
            @ViewChild('icon', { read: ElementRef }) public elementRef: ElementRef<IconCheck>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleIconCheckDirective;
        let nativeElement: IconCheck;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleIconCheckModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for severity', () => {
            expect(directive.severity).toBe(IconSeverity.default);
            expect(nativeElement.severity).toBe(IconSeverity.default);
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-icon-check #icon
                    severity="error"
                >
                </nimble-icon-check>`
        })
        class TestHostComponent {
            @ViewChild('icon', { read: NimbleIconCheckDirective }) public directive: NimbleIconCheckDirective;
            @ViewChild('icon', { read: ElementRef }) public elementRef: ElementRef<IconCheck>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleIconCheckDirective;
        let nativeElement: IconCheck;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleIconCheckModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for severity', () => {
            expect(directive.severity).toBe(IconSeverity.error);
            expect(nativeElement.severity).toBe(IconSeverity.error);
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-icon-check #icon
                    [severity]="severity"
                >
                </nimble-icon-check>
            `
        })
        class TestHostComponent {
            @ViewChild('icon', { read: NimbleIconCheckDirective }) public directive: NimbleIconCheckDirective;
            @ViewChild('icon', { read: ElementRef }) public elementRef: ElementRef<IconCheck>;
            public severity: IconSeverity;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleIconCheckDirective;
        let nativeElement: IconCheck;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleIconCheckModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for severity', () => {
            expect(directive.severity).toBe(IconSeverity.default);
            expect(nativeElement.severity).toBe(IconSeverity.default);

            fixture.componentInstance.severity = IconSeverity.error;
            fixture.detectChanges();

            expect(directive.severity).toBe(IconSeverity.error);
            expect(nativeElement.severity).toBe(IconSeverity.error);
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-icon-check #icon
                    [attr.severity]="severity"
                >
                </nimble-icon-check>
            `
        })
        class TestHostComponent {
            @ViewChild('icon', { read: NimbleIconCheckDirective }) public directive: NimbleIconCheckDirective;
            @ViewChild('icon', { read: ElementRef }) public elementRef: ElementRef<IconCheck>;
            public severity: IconSeverity;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleIconCheckDirective;
        let nativeElement: IconCheck;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleIconCheckModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for severity', () => {
            expect(directive.severity).toBe(IconSeverity.default);
            expect(nativeElement.severity).toBe(IconSeverity.default);

            fixture.componentInstance.severity = IconSeverity.error;
            fixture.detectChanges();

            expect(directive.severity).toBe(IconSeverity.error);
            expect(nativeElement.severity).toBe(IconSeverity.error);
        });
    });
});
