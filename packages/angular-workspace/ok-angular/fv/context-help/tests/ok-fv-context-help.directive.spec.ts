import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type FvContextHelp, OkFvContextHelpDirective } from '../ok-fv-context-help.directive';
import { OkFvContextHelpModule } from '../ok-fv-context-help.module';

describe('Ok fv context help', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvContextHelpModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-context-help')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <ok-fv-context-help #contextHelp></ok-fv-context-help>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('contextHelp', { read: OkFvContextHelpDirective }) public directive: OkFvContextHelpDirective;
            @ViewChild('contextHelp', { read: ElementRef }) public elementRef: ElementRef<FvContextHelp>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvContextHelpDirective;
        let nativeElement: FvContextHelp;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvContextHelpModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for text', () => {
            expect(directive.text).toBe('');
            expect(nativeElement.text).toBe('');
        });

        it('has expected defaults for triggerLabel', () => {
            expect(directive.triggerLabel).toBe('Show help');
            expect(nativeElement.triggerLabel).toBe('Show help');
        });

        it('has expected defaults for iconVisible', () => {
            expect(directive.iconVisible).toBe(false);
            expect(nativeElement.iconVisible).toBe(false);
        });

        it('has expected defaults for severity', () => {
            expect(directive.severity).toBeUndefined();
            expect(nativeElement.severity).toBeUndefined();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <ok-fv-context-help #contextHelp
                    text="Use the code shown on the device label."
                    trigger-label="Show support code help"
                    severity="error"
                    icon-visible>
                </ok-fv-context-help>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('contextHelp', { read: OkFvContextHelpDirective }) public directive: OkFvContextHelpDirective;
            @ViewChild('contextHelp', { read: ElementRef }) public elementRef: ElementRef<FvContextHelp>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvContextHelpDirective;
        let nativeElement: FvContextHelp;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvContextHelpModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for text', () => {
            expect(directive.text).toBe('Use the code shown on the device label.');
            expect(nativeElement.text).toBe('Use the code shown on the device label.');
        });

        it('will use template string values for triggerLabel', () => {
            expect(directive.triggerLabel).toBe('Show support code help');
            expect(nativeElement.triggerLabel).toBe('Show support code help');
        });

        it('will use template string values for severity', () => {
            expect(directive.severity).toBe('error');
            expect(nativeElement.severity).toBe('error');
        });

        it('will use template string values for iconVisible', () => {
            expect(directive.iconVisible).toBeTrue();
            expect(nativeElement.iconVisible).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <ok-fv-context-help #contextHelp
                    [text]="text"
                    [triggerLabel]="triggerLabel"
                    [severity]="severity"
                    [iconVisible]="iconVisible">
                </ok-fv-context-help>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('contextHelp', { read: OkFvContextHelpDirective }) public directive: OkFvContextHelpDirective;
            @ViewChild('contextHelp', { read: ElementRef }) public elementRef: ElementRef<FvContextHelp>;
            public text = 'Use the code shown on the device label.';
            public triggerLabel = 'Show support code help';
            public severity: 'information' | 'error' | undefined = 'information';
            public iconVisible = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvContextHelpDirective;
        let nativeElement: FvContextHelp;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvContextHelpModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for text', () => {
            expect(directive.text).toBe('Use the code shown on the device label.');
            expect(nativeElement.text).toBe('Use the code shown on the device label.');

            fixture.componentInstance.text = 'Reference the inline help when the label is not visible.';
            fixture.detectChanges();

            expect(directive.text).toBe('Reference the inline help when the label is not visible.');
            expect(nativeElement.text).toBe('Reference the inline help when the label is not visible.');
        });

        it('can be configured with property binding for triggerLabel', () => {
            expect(directive.triggerLabel).toBe('Show support code help');
            expect(nativeElement.triggerLabel).toBe('Show support code help');

            fixture.componentInstance.triggerLabel = 'Show operator guidance';
            fixture.detectChanges();

            expect(directive.triggerLabel).toBe('Show operator guidance');
            expect(nativeElement.triggerLabel).toBe('Show operator guidance');
        });

        it('can be configured with property binding for severity', () => {
            expect(directive.severity).toBe('information');
            expect(nativeElement.severity).toBe('information');

            fixture.componentInstance.severity = 'error';
            fixture.detectChanges();

            expect(directive.severity).toBe('error');
            expect(nativeElement.severity).toBe('error');
        });

        it('can be configured with property binding for iconVisible', () => {
            expect(directive.iconVisible).toBeFalse();
            expect(nativeElement.iconVisible).toBeFalse();

            fixture.componentInstance.iconVisible = true;
            fixture.detectChanges();

            expect(directive.iconVisible).toBeTrue();
            expect(nativeElement.iconVisible).toBeTrue();
        });
    });
});
