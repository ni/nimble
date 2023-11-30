import {
    DesignSystem,
    MenuItem as FoundationMenuItem,
    MenuItemOptions
} from '@microsoft/fast-foundation';
import { arrowExpanderRight16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { menuItemTemplate as template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-menu-item': MenuItem;
    }
}

interface Point {
    x: number;
    y: number;
}

/**
 * A nimble-styled menu-item
 */
export class MenuItem extends FoundationMenuItem {
    // This is only for debugging/development. Should be removed eventually.
    public polygon?: HTMLElement;
    private safetyTrianglePoint: Point | null = null;
    public constructor() {
        super();
        this.handleMouseOver = this.modifiedHandleMouseOver;
        this.handleMouseOut = this.modifiedHandleMouseOut;
        this.addEventListener('mousemove', this.handleMouseMove);
    }

    private readonly handleMouseMove = (event: MouseEvent): boolean => {
        if (
            this.disabled
            || !this.hasSubmenu
            || this.expanded
            || this.withinSafetyTriangle(event.x, event.y)
        ) {
            return false;
        }

        this.expanded = true;
        this.safetyTrianglePoint = { x: event.x, y: event.y };
        this.classList.add('hovered');
        document.addEventListener('mousemove', this.documentMouseMoveHandler);

        return false;
    };

    private readonly documentMouseMoveHandler = (e: MouseEvent): void => {
        const rect = this.getBoundingClientRect();
        if (this.submenu) {
            const subMenuRect = this.submenu?.getBoundingClientRect();
            // This assumes the submenu opens to the right. Needs to be generalized.
            this.polygon?.setAttribute(
                'points',
                `${this.safetyTrianglePoint!.x - rect.left},${
                    this.safetyTrianglePoint!.y - rect.top
                } ${subMenuRect.left - rect.left},${
                    subMenuRect.top - rect.top
                } ${subMenuRect.left - rect.left},${
                    subMenuRect.bottom - rect.top
                }`
            );
            // if cursor is within expanded item or safety triangle, update safety triangle and return
            if (
                this.isInsideRect(e.x, e.y, this.getBoundingClientRect())
                || this.withinSafetyTriangle(e.x, e.y)
            ) {
                // Subtracting 5 so that the cursor is slightly inside the safety triangle
                // rather than right at the vertex. This avoids some sensitivity.
                this.safetyTrianglePoint = { x: e.x - 5, y: e.y };
                return;
            }
            if (this.isInsideRect(e.x, e.y, subMenuRect)) {
                document.removeEventListener(
                    'mousemove',
                    this.documentMouseMoveHandler
                );
                return;
            }
        }
        // clear expanded item hovered class
        this.classList.remove('hovered');
        // set expanded=false on expanded item (will trigger close of menu and change of expanded item)
        this.expanded = false;
        document.removeEventListener(
            'mousemove',
            this.documentMouseMoveHandler
        );
    };

    private readonly modifiedHandleMouseOver = (_e: MouseEvent): boolean => false;

    private readonly modifiedHandleMouseOut = (e: MouseEvent): boolean => {
        if (
            !this.expanded
            || this.contains(document.activeElement)
            || this.withinSafetyTriangle(e.x, e.y)
        ) {
            return false;
        }

        this.expanded = false;

        return false;
    };

    private withinSafetyTriangle(x: number, y: number): boolean {
        if (!this.submenu || !this.safetyTrianglePoint) {
            return false;
        }
        const subMenuRect = this.submenu.getBoundingClientRect();
        if (
            !subMenuRect.top
            && !subMenuRect.bottom
            && !subMenuRect.left
            && !subMenuRect.right
        ) {
            return false;
        }
        // This assumes the submenu opens to the right. Needs to be generalized.
        return this.pointInTriangle(
            { x, y },
            this.safetyTrianglePoint,
            { x: subMenuRect.left, y: subMenuRect.top },
            { x: subMenuRect.left, y: subMenuRect.bottom }
        );
    }

    private isInsideRect(x: number, y: number, rect: DOMRect): boolean {
        return (
            x > rect.left && x < rect.right && y > rect.top && y < rect.bottom
        );
    }

    private sign(p1: Point, p2: Point, p3: Point): number {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }

    // Taken from https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
    private pointInTriangle(
        pt: Point,
        v1: Point,
        v2: Point,
        v3: Point
    ): boolean {
        const d1 = this.sign(pt, v1, v2);
        const d2 = this.sign(pt, v2, v3);
        const d3 = this.sign(pt, v3, v1);

        const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
        const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

        return !(hasNeg && hasPos);
    }
}

/**
 * A function that returns a nimble-menu-item registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#menuItemTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-menu-item\>
 *
 */
const nimbleMenuItem = MenuItem.compose<MenuItemOptions>({
    baseName: 'menu-item',
    baseClass: FoundationMenuItem,
    template,
    styles,
    expandCollapseGlyph: arrowExpanderRight16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuItem());
export const menuItemTag = DesignSystem.tagFor(MenuItem);
