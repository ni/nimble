import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { processUpdates } from '../../../testing/async-helpers';
import { NimbleAnchorButtonModule } from '../nimble-anchor-button.module';

describe('Nimble anchor button RouterLinkDirective', () => {
    @Component({
        template: `
            <nimble-anchor-button routerLink="page1">
                Anchor Text
            </nimble-anchor-button>
            <router-outlet></router-outlet>
         `
    })
    class TestHostComponent {
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [NimbleAnchorButtonModule,
                CommonModule,
                RouterTestingModule.withRoutes(
                    [{ path: '', component: TestHostComponent, pathMatch: 'full' }
                    ], { useHash: true }
                )
            ]
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
