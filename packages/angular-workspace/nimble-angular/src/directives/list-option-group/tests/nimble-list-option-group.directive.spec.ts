import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, ViewChild } from '@angular/core';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { NimbleListOptionGroupModule } from '../nimble-list-option-group.module';
import type { ListOptionGroup } from '../../../public-api';
import { NimbleListOptionGroupDirective } from '../nimble-list-option-group.directive';

describe('Nimble listbox option group', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleListOptionGroupModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-list-option-group')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-list-option-group #listOptionGroup></nimble-list-option-group>
            `
        })
        class TestHostComponent {
            @ViewChild('listOptionGroup', { read: NimbleListOptionGroupDirective }) public directive: NimbleListOptionGroupDirective;
            @ViewChild('listOptionGroup', { read: ElementRef }) public elementRef: ElementRef<ListOptionGroup>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleListOptionGroupDirective;
        let nativeElement: ListOptionGroup;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleListOptionGroupModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected defaults for label', () => {
            expect(directive.label).toBeUndefined();
            expect(nativeElement.label).toBeUndefined();
        });

        it('has expected defaults for hidden', () => {
            expect(directive.hidden).toBeFalse();
            expect(nativeElement.hidden).toBeFalse();
        });
    });

    describe('with template string values', () => {
        @Component({
            template: `
                <nimble-list-option-group #listOptionGroup
                    hidden
                    label="foo"
                ></nimble-list-option-group>
            `
        })
        class TestHostComponent {
            @ViewChild('listOptionGroup', { read: NimbleListOptionGroupDirective }) public directive: NimbleListOptionGroupDirective;
            @ViewChild('listOptionGroup', { read: ElementRef }) public elementRef: ElementRef<ListOptionGroup>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleListOptionGroupDirective;
        let nativeElement: ListOptionGroup;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleListOptionGroupModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template string values for label', () => {
            expect(directive.label).toBe('foo');
            expect(nativeElement.label).toBe('foo');
        });

        it('will use template string values for hidden', () => {
            expect(directive.hidden).toBeTrue();
            expect(nativeElement.hidden).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-list-option-group #listOptionGroup
                    [label]="label"
                    [hidden]="hidden"
                ></nimble-list-option-group>
            `
        })
        class TestHostComponent {
            @ViewChild('listOptionGroup', { read: NimbleListOptionGroupDirective }) public directive: NimbleListOptionGroupDirective;
            @ViewChild('listOptionGroup', { read: ElementRef }) public elementRef: ElementRef<ListOptionGroup>;

            public label = '';
            public hidden = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleListOptionGroupDirective;
        let nativeElement: ListOptionGroup;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleListOptionGroupModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for label', () => {
            expect(directive.label).toBe('');
            expect(nativeElement.label).toBe('');

            fixture.componentInstance.label = 'foo';
            fixture.detectChanges();

            expect(directive.label).toBe('foo');
            expect(nativeElement.label).toBe('foo');
        });

        it('can be configured with property binding for hidden', () => {
            expect(directive.hidden).toBeFalse();
            expect(nativeElement.hidden).toBeFalse();

            fixture.componentInstance.hidden = true;
            fixture.detectChanges();

            expect(directive.hidden).toBeTrue();
            expect(nativeElement.hidden).toBeTrue();
        });
    });

    describe('with property attribute values', () => {
        @Component({
            template: `
                <nimble-list-option-group #listOptionGroup
                    [attr.label]="label"
                    [attr.hidden]="hidden">
                </nimble-list-option-group>
            `
        })
        class TestHostComponent {
            @ViewChild('listOptionGroup', { read: NimbleListOptionGroupDirective }) public directive: NimbleListOptionGroupDirective;
            @ViewChild('listOptionGroup', { read: ElementRef }) public elementRef: ElementRef<ListOptionGroup>;

            public label = 'foo';
            public hidden: BooleanValueOrAttribute = null;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleListOptionGroupDirective;
        let nativeElement: ListOptionGroup;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleListOptionGroupModule]
            });
            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for label', () => {
            expect(directive.label).toBe('foo');
            expect(nativeElement.label).toBe('foo');

            fixture.componentInstance.label = 'bar';
            fixture.detectChanges();

            expect(directive.label).toBe('bar');
            expect(nativeElement.label).toBe('bar');
        });

        it('can be configured with attribute binding for hidden', () => {
            expect(directive.hidden).toBeFalse();
            expect(nativeElement.hidden).toBeFalse();

            fixture.componentInstance.hidden = '';
            fixture.detectChanges();

            expect(directive.hidden).toBeTrue();
            expect(nativeElement.hidden).toBeTrue();
        });
    });
});
