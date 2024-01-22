import { Component, ElementRef, ViewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormatNumberDecimalPipe, byteUnitScale } from '../format-number-decimal.pipe';

describe('FormatNumberDecimalPipe', () => {
    const testCases = [
        {
            name: 'default formatting is as expected',
            options: {},
            value: 100,
            expected: '100.00'
        },
        {
            name: 'honors the decimalDigits value',
            options: {
                decimalDigits: 1
            },
            value: 100,
            expected: '100.0'
        },
        {
            name: 'honors the maximumDecimalDigits value',
            options: {
                maximumDecimalDigits: 1
            },
            value: 100.1234,
            expected: '100.1'
        },
        {
            name: 'honors the unitScale value',
            options: {
                unitScale: byteUnitScale
            },
            value: 3000,
            expected: '3.00 kB'
        },
        {
            name: 'honors the locale value',
            options: {
                locale: 'de',
                unitScale: byteUnitScale
            },
            value: 300,
            expected: '300,00 Byte'
        },
    ];

    testCases.forEach(test => {
        it(test.name, () => {
            const pipe = new FormatNumberDecimalPipe(test.options.locale ?? 'en');
            expect(pipe.transform(test.value, {
                decimalDigits: test.options.decimalDigits,
                maximumDecimalDigits: test.options.maximumDecimalDigits,
                unitScale: test.options.unitScale
            })).toEqual(test.expected);
        });
    });

    it('throws an error if both decimalDigits and maximumDecimalDigits are provided', () => {
        const pipe = new FormatNumberDecimalPipe('en');
        expect(() => {
            pipe.transform(1, {
                decimalDigits: 1,
                maximumDecimalDigits: 1
            });
        }).toThrowError(/decimalDigits and maximumDecimalDigits/g);
    });

    it('handles change to decimalDigits argument in subsequent call to transform()', () => {
        const pipe = new FormatNumberDecimalPipe('en');
        expect(pipe.transform(100)).toEqual('100.00');
        expect(pipe.transform(100, { decimalDigits: 4 })).toEqual('100.0000');
    });

    it('handles change to maximumDecimalDigits argument in subsequent call to transform()', () => {
        const pipe = new FormatNumberDecimalPipe('en');
        expect(pipe.transform(100.12345)).toEqual('100.12');
        expect(pipe.transform(100.12345, { maximumDecimalDigits: 3 })).toEqual('100.123');
    });

    it('handles change to unitScale argument in subsequent call to transform()', () => {
        const pipe = new FormatNumberDecimalPipe('en');
        expect(pipe.transform(100)).toEqual('100.00');
        expect(pipe.transform(100, { unitScale: byteUnitScale })).toEqual('100.00 bytes');
    });

    it('handles changes to multiple arguments in subsequent call to transform()', () => {
        const pipe = new FormatNumberDecimalPipe('en');
        expect(pipe.transform(100.12345)).toEqual('100.12');
        expect(pipe.transform(100.12345, {
            maximumDecimalDigits: 3,
            unitScale: byteUnitScale
        })).toEqual('100.123 bytes');
    });

    it('reuses format object when same arguments are passed to transform()', () => {
        const pipe = new FormatNumberDecimalPipe('en');
        const args = {
            maximumDecimalDigits: 3,
            unitScale: byteUnitScale
        };
        pipe.transform(1, args);
        const initialFormatter = pipe.decimalUnitFormat;
        pipe.transform(1, args);
        expect(pipe.decimalUnitFormat).toBe(initialFormatter);
    });

    describe('in component template', () => {
        @Component({
            template: `
            <div #div>{{ value | formatNumberDecimal:{ decimalDigits: 5 } }}</div>
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
                imports: [FormatNumberDecimalPipe]
            });

            fixture = TestBed.createComponent(TestHostComponent);
            fixture.detectChanges();
            div = fixture.componentInstance.divRef.nativeElement;
        });

        it('accepts proper parameters', () => {
            expect(div.innerText).toEqual('0.00000');
        });
    });
});
