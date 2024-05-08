import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NimbleUnitByteModule } from '../nimble-unit-byte.module';
import { NimbleUnitByteDirective, UnitByte } from '../nimble-unit-byte.directive';

describe('Nimble byte unit', () => {
    describe('module', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NimbleUnitByteModule]
            });
        });

        it('custom element is defined', () => {
            expect(customElements.get('nimble-unit-byte')).not.toBeUndefined();
        });
    });

    describe('with no values in template', () => {
        @Component({
            template: `
                <nimble-unit-byte #unit></nimble-unit-byte>
            `
        })
        class TestHostComponent {
            @ViewChild('unit', { read: NimbleUnitByteDirective }) public directive: NimbleUnitByteDirective;
            @ViewChild('unit', { read: ElementRef }) public elementRef: ElementRef<UnitByte>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleUnitByteDirective;
        let nativeElement: UnitByte;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleUnitByteModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('has expected default for binary', () => {
            expect(directive.binary).toBeFalse();
            expect(nativeElement.binary).toBeFalse();
        });
    });

    describe('with template values', () => {
        @Component({
            template: `
                <nimble-unit-byte #unit binary></nimble-unit-byte>
            `
        })
        class TestHostComponent {
            @ViewChild('unit', { read: NimbleUnitByteDirective }) public directive: NimbleUnitByteDirective;
            @ViewChild('unit', { read: ElementRef }) public elementRef: ElementRef<UnitByte>;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleUnitByteDirective;
        let nativeElement: UnitByte;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleUnitByteModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('will use template value for binary', () => {
            expect(directive.binary).toBeTrue();
            expect(nativeElement.binary).toBeTrue();
        });
    });

    describe('with property bound values', () => {
        @Component({
            template: `
                <nimble-unit-byte #unit [binary]="binary"></nimble-unit-byte>
            `
        })
        class TestHostComponent {
            @ViewChild('unit', { read: NimbleUnitByteDirective }) public directive: NimbleUnitByteDirective;
            @ViewChild('unit', { read: ElementRef }) public elementRef: ElementRef<UnitByte>;
            public binary = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleUnitByteDirective;
        let nativeElement: UnitByte;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleUnitByteModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with property binding for binary', () => {
            expect(directive.binary).toBeFalse();
            expect(nativeElement.binary).toBeFalse();

            fixture.componentInstance.binary = true;
            fixture.detectChanges();

            expect(directive.binary).toBeTrue();
            expect(nativeElement.binary).toBeTrue();
        });
    });

    describe('with attribute bound values', () => {
        @Component({
            template: `
                <nimble-unit-byte #unit [attr.binary]="binary"></nimble-unit-byte>
            `
        })
        class TestHostComponent {
            @ViewChild('unit', { read: NimbleUnitByteDirective }) public directive: NimbleUnitByteDirective;
            @ViewChild('unit', { read: ElementRef }) public elementRef: ElementRef<UnitByte>;
            public binary = false;
        }

        let fixture: ComponentFixture<TestHostComponent>;
        let directive: NimbleUnitByteDirective;
        let nativeElement: UnitByte;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NimbleUnitByteModule]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            directive = fixture.componentInstance.directive;
            nativeElement = fixture.componentInstance.elementRef.nativeElement;
        });

        it('can be configured with attribute binding for binary', () => {
            expect(directive.binary).toBeFalse();
            expect(nativeElement.binary).toBeFalse();

            fixture.componentInstance.binary = true;
            fixture.detectChanges();

            expect(directive.binary).toBeTrue();
            expect(nativeElement.binary).toBeTrue();
        });
    });
});