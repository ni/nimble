import { Component, ElementRef, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { type FvSplitter, OkFvSplitterDirective } from '../ok-fv-splitter.directive';
import { OkFvSplitterModule } from '../ok-fv-splitter.module';

describe('Ok Fv Splitter', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OkFvSplitterModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('ok-fv-splitter')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <ok-fv-splitter #splitter></ok-fv-splitter>
            `,
            standalone: false
        })
        class TestHostComponent {
            @ViewChild('splitter', { read: OkFvSplitterDirective }) public directive: OkFvSplitterDirective;
            @ViewChild('splitter', { read: ElementRef }) public elementRef: ElementRef<FvSplitter>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: OkFvSplitterDirective;
        let nativeElement: FvSplitter;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [OkFvSplitterModule],
                providers: [provideZoneChangeDetection()]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults', () => {
            expect(directive.ariaLabel).toBe('Resize panes');
            expect(directive.ariaLabelledby).toBeUndefined();
            expect(directive.ariaControls).toBeUndefined();
            expect(directive.position).toBe(60);
            expect(directive.min).toBe(0);
            expect(directive.max).toBe(100);
            expect(directive.step).toBe(1);
            expect(nativeElement.position).toBe(60);
        });
    });

    describe('with template and property-bound values', () => {
        @Component({
            template: `
                <ok-fv-splitter #splitter
                    aria-label="Resize details pane"
                    aria-labelledby="splitter-label"
                    aria-controls="primary-pane"
                    position="45.5"
                    min="10"
                    max="90"
                    step="2.5">
                </ok-fv-splitter>
            `,
            standalone: false
        })
        class TemplateValueHostComponent {
            @ViewChild('splitter', { read: OkFvSplitterDirective }) public directive: OkFvSplitterDirective;
            @ViewChild('splitter', { read: ElementRef }) public elementRef: ElementRef<FvSplitter>;
        }

        let fixture: ComponentFixture<TemplateValueHostComponent>;
        let directive: OkFvSplitterDirective;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TemplateValueHostComponent],
                imports: [OkFvSplitterModule],
                providers: [provideZoneChangeDetection()]
            });
            fixture = TestBed.createComponent(TemplateValueHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
        });

        it('converts template attribute values to splitter properties', () => {
            expect(directive.ariaLabel).toBe('Resize details pane');
            expect(directive.ariaLabelledby).toBe('splitter-label');
            expect(directive.ariaControls).toBe('primary-pane');
            expect(directive.position).toBe(45.5);
            expect(directive.min).toBe(10);
            expect(directive.max).toBe(90);
            expect(directive.step).toBe(2.5);
        });
    });

    describe('with property-bound values', () => {
        @Component({
            template: `
                <ok-fv-splitter #splitter
                    [ariaLabel]="ariaLabel"
                    [ariaLabelledby]="ariaLabelledby"
                    [ariaControls]="ariaControls"
                    [position]="position"
                    [min]="min"
                    [max]="max"
                    [step]="step">
                </ok-fv-splitter>
            `,
            standalone: false
        })
        class PropertyValueHostComponent {
            @ViewChild('splitter', { read: OkFvSplitterDirective }) public directive: OkFvSplitterDirective;
            @ViewChild('splitter', { read: ElementRef }) public elementRef: ElementRef<FvSplitter>;
            public ariaLabel = 'Resize details pane';
            public ariaLabelledby = 'splitter-label';
            public ariaControls = 'primary-pane';
            public position = 45.5;
            public min = 10;
            public max = 90;
            public step = 2.5;
        }

        let fixture: ComponentFixture<PropertyValueHostComponent>;
        let directive: OkFvSplitterDirective;
        let nativeElement: FvSplitter;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [PropertyValueHostComponent],
                imports: [OkFvSplitterModule],
                providers: [provideZoneChangeDetection()]
            });
            fixture = TestBed.createComponent(PropertyValueHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('uses initial property values', () => {
            expect(directive.position).toBe(45.5);
            expect(directive.min).toBe(10);
            expect(directive.max).toBe(90);
            expect(directive.step).toBe(2.5);
        });

        it('updates when property values change', () => {
            fixture.componentInstance.position = 70;
            fixture.componentInstance.min = 20;
            fixture.componentInstance.max = 80;
            fixture.componentInstance.step = 5;
            fixture.detectChanges();

            expect(directive.position).toBe(70);
            expect(directive.min).toBe(20);
            expect(directive.max).toBe(80);
            expect(directive.step).toBe(5);
        });

        it('forwards input and change events', () => {
            const inputSpy = jasmine.createSpy();
            const changeSpy = jasmine.createSpy();
            directive.inputEvent.subscribe(inputSpy);
            directive.changeEvent.subscribe(changeSpy);
            const inputEvent = new Event('input');
            const changeEvent = new Event('change');
            Object.defineProperty(inputEvent, 'target', { value: nativeElement });
            Object.defineProperty(changeEvent, 'target', { value: nativeElement });

            directive.onInput(inputEvent);
            directive.onChange(changeEvent);

            expect(inputSpy).toHaveBeenCalledOnceWith(inputEvent);
            expect(changeSpy).toHaveBeenCalledOnceWith(changeEvent);
        });
    });
});