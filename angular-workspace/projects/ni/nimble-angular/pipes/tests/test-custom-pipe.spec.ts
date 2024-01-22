import { Component, ElementRef, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

describe('Custom pipe instantiation', () => {
    @Pipe({
        name: 'pipeId',
        standalone: true
    })
    class InstanceIdPipe implements PipeTransform {
        private static instanceCount = 0;
        private readonly instanceNumber;

        public constructor() {
            InstanceIdPipe.instanceCount += 1;
            this.instanceNumber = InstanceIdPipe.instanceCount;
        }

        public transform(): number {
            return this.instanceNumber;
        }
    }

    @Component({
        template: `
        <div #div1>{{ value | pipeId }}</div>
        <div #div2>{{ value | pipeId }}</div>
        `
    })
    class TestHostComponent {
        @ViewChild('div1') public div1Ref: ElementRef<HTMLDivElement>;
        @ViewChild('div2') public div2Ref: ElementRef<HTMLDivElement>;
        public value = 0;
    }
    let fixture: ComponentFixture<TestHostComponent>;
    let div1: HTMLDivElement;
    let div2: HTMLDivElement;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [InstanceIdPipe]
        });

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        div1 = fixture.componentInstance.div1Ref.nativeElement;
        div2 = fixture.componentInstance.div2Ref.nativeElement;
    });

    it('creates separate pipe instances for each use in component template', () => {
        expect(div1.innerText).not.toEqual(div2.innerText);
    });

    it('does not create new pipe instances when template is updated', () => {
        const originalDiv1Value = div1.innerText;
        const originalDiv2Value = div1.innerText;

        fixture.componentInstance.value = 1;
        fixture.detectChanges();

        expect(div1.innerText).toEqual(originalDiv1Value);
        expect(div2.innerText).toEqual(originalDiv2Value);
    });
});
