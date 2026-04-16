import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { processUpdates } from '@ni/nimble-angular';
import { NimbleAnchorStepModule } from '../nimble-anchor-step.module';

describe('Nimble anchor step RouterLinkDirective', () => {
    @Component({
        template: `
            <nimble-anchor-step routerLink="page1">
            </nimble-anchor-step>
            <router-outlet></router-outlet>
         `,
        standalone: false
    })
    class TestHostComponent {
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [
                NimbleAnchorStepModule,
                CommonModule,
            ],
        });
    });

    afterEach(() => {
        processUpdates();
    });

    it('throws an error when used, pointing consumers to nimbleRouterLink', () => {
        expect(() => {
            TestBed.createComponent(TestHostComponent);
        }).toThrowError(/nimbleRouterLink/g);
    });
});
