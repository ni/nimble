import { Component, ElementRef, ViewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { NumberTextPipe } from '../number-text.pipe';
import { NumberTextFormat } from '../../table-column/number-text/nimble-table-column-number-text.directive';
import { byteUnitScale } from '../public-api';

describe('NumberTextPipe', () => {
    const testCases = [
        {
            name: 'default formatting is as expected',
            locale: 'en',
            value: 100,
            expected: '100',
            options: undefined
        },
        {
            name: 'honors the unitScale value',
            locale: 'en',
            value: 3000,
            expected: '3 kB',
            options: {
                unitScale: byteUnitScale,
            }
        },
        {
            name: 'honors the locale value',
            locale: 'de',
            value: 300.123,
            expected: '300,123',
            options: undefined
        },
        {
            name: 'honors the decimalDigits value',
            locale: 'en',
            value: 100,
            expected: '100.0',
            options: {
                numberTextFormat: NumberTextFormat.decimal,
                decimalDigits: 1
            }
        },
        {
            name: 'honors the decimalMaximumDigits value',
            locale: 'en',
            value: 100.1234,
            expected: '100.1',
            options: {
                numberTextFormat: NumberTextFormat.decimal,
                decimalMaximumDigits: 1
            }
        }
    ] as const;

    parameterizeSpec(testCases, (spec, name, value) => {
        spec(name, () => {
            const pipe = new NumberTextPipe(value.locale);
            expect(pipe.transform(value.value, value.options)).toEqual(value.expected);
        });
    });

    it('honors change to numberTextFormat argument in subsequent call to transform()', () => {
        const pipe = new NumberTextPipe('en');
        expect(pipe.transform(100)).toEqual('100');
        expect(pipe.transform(100, { numberTextFormat: NumberTextFormat.decimal })).toEqual('100.00');
    });

    it('honors change to decimalDigits argument in subsequent call to transform()', () => {
        const pipe = new NumberTextPipe('en');
        expect(pipe.transform(100, {
            numberTextFormat: NumberTextFormat.decimal
        })).toEqual('100.00');
        expect(pipe.transform(100, {
            numberTextFormat: NumberTextFormat.decimal,
            decimalDigits: 4
        })).toEqual('100.0000');
    });

    it('honors change to decimalMaximumDigits argument in subsequent call to transform()', () => {
        const pipe = new NumberTextPipe('en');
        expect(pipe.transform(100.12345, {
            numberTextFormat: NumberTextFormat.decimal
        })).toEqual('100.12');
        expect(pipe.transform(100.12345, {
            numberTextFormat: NumberTextFormat.decimal,
            decimalMaximumDigits: 3
        })).toEqual('100.123');
    });

    it('honors change to unitScale argument in subsequent call to transform()', () => {
        const pipe = new NumberTextPipe('en');
        expect(pipe.transform(100)).toEqual('100');
        expect(pipe.transform(100, { unitScale: byteUnitScale })).toEqual('100 bytes');
    });

    it('honors changes to multiple arguments in subsequent call to transform()', () => {
        const pipe = new NumberTextPipe('en');
        expect(pipe.transform(100.12345)).toEqual('100.123');
        expect(pipe.transform(100.12345, {
            numberTextFormat: NumberTextFormat.decimal,
            decimalMaximumDigits: 1,
            unitScale: byteUnitScale
        })).toEqual('100.1 bytes');
    });

    it('reuses format object when same arguments are passed to transform()', () => {
        const pipe = new NumberTextPipe('en');
        const args = {
            numberTextFormat: NumberTextFormat.decimal,
            maximumDecimalDigits: 3,
            unitScale: byteUnitScale
        };
        pipe.transform(1, args);
        const initialFormatter = pipe.numberTextUnitFormat;
        pipe.transform(1, args);
        expect(pipe.numberTextUnitFormat).toBe(initialFormatter);
    });

    describe('in component template', () => {
        @Component({
            template: `
            <div #div>{{ value | numberText:{ numberTextFormat: 'decimal', decimalDigits: 3 } }}</div>
            `
        })
        class TestHostComponent {
            @ViewChild('div') public divRef: ElementRef<HTMLDivElement>;
            public value = 0;
        }
        let fixture: ComponentFixture<TestHostComponent>;
        let div: HTMLDivElement;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestHostComponent],
                imports: [NumberTextPipe]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            div = fixture.componentInstance.divRef.nativeElement;
        });

        it('accepts parameters via object literal', () => {
            expect(div.innerText).toEqual('0.000');
        });
    });
});
