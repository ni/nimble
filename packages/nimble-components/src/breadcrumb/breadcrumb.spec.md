# Nimble Breadcrumb

## Overview

A breadcrumb component is used as a navigational aid, allowing users to maintain awareness of their locations within a program, app, or a website.

### Background

[FAST Component Demo - Breadcrumb](https://explore.fast.design/components/fast-breadcrumb)

[F1792531: [Design System] Components for sl-breadcrumb-bar](https://dev.azure.com/ni/DevCentral/_workitems/edit/1792531)  
Current SystemLink breadcrumb:  
![SystemLink Current Breadcrumb](https://user-images.githubusercontent.com/20709258/152267289-a419b7c1-fd21-401e-a1e8-3ce4433fe189.PNG) <!--(./spec-images/SLBreadcrumbCurrent.PNG)-->  
Future planned SystemLink breadcrumb ([see discussion here](https://teams.microsoft.com/l/message/19:8e5f3e80de8146d5aaecdc2112e89191@thread.skype/1642192016552?tenantId=87ba1f9a-44cd-43a6-b008-6fdb45a5204e&groupId=41626d4a-3f1f-49e2-abdc-f590be4a329d&parentMessageId=1642192016552&teamName=ASW%20SystemLink&channelName=UX&createdTime=1642192016552)):  
The future/planned behavior of the SystemLink breadcrumb (where it's moved into the header, and won't include tab names) doesn't add any new requirements to this control.  
![SystemLink Future Breadcrumb](https://user-images.githubusercontent.com/20709258/152267292-830a884d-8777-4850-a4e9-f6d27dbb8758.png) <!--(./spec-images/SLBreadcrumbFuture.PNG)-->


## Design

### API

Example Usage:
```html
<nimble-breadcrumb>
    <nimble-breadcrumb-item href="#">Breadcrumb item 1</nimble-breadcrumb-item>
    <nimble-breadcrumb-item href="#">Breadcrumb item 2</nimble-breadcrumb-item>
    <nimble-breadcrumb-item>Breadcrumb item 3</nimble-breadcrumb-item>
</nimble-breadcrumb>
```
Note: href is optional, and the breadcrumb can be used without links entirely.

FAST API Documentation/ Specs
- [breadcrumb and breadcrumb-item](https://github.com/microsoft/fast/blob/2cbba7d9ed4900ef2c69d0a9721cc98d742a583d/packages/web-components/fast-foundation/src/breadcrumb/breadcrumb.spec.md)
- [anchor](https://github.com/microsoft/fast/blob/2cbba7d9ed4900ef2c69d0a9721cc98d742a583d/packages/web-components/fast-foundation/src/anchor/README.md) (FAST breadcrumb-item extends this) - API based on built-in [&lt;a&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) element

Component Name: `nimble-breadcrumb`
- Properties/Attributes: Unchanged
- Methods: Unchanged
- Events: Unchanged
- CSS Classes and Custom Properties that affect the component: Unchanged
- Slots: Unchanged

Component Name: `nimble-breadcrumb-item`
- FAST's default separator (between breadcrumb items) is `/`, however for Nimble, the default separator will be `>` (specifically the Nimble `controlsArrowExpanderRight16X16` icon)
- Properties/Attributes: Unchanged
    - Note: Most expected usages will only use `href`
- Methods: Unchanged
- Events: Unchanged
- CSS Classes and Custom Properties that affect the component: TBD
    - Properties/tokens for hyperlink font color + active/hover colors
    - Any properties/tokens needed to support the "button-style" link rendering
- Slots: Default for the "separator" slot is `>` as noted above; otherwise unchanged

### Angular integration 

**NimbleBreadcrumbDirective**: Directive for selector `nimble-breadcrumb`.  
No attribute/property bindings.

**NimbleBreadcrumbItemDirective**: Directive for selector `nimble-breadcrumb-item`.  
Attribute bindings for all `<a>` properties inherited from fast-breadcrumb-item: `download`, `href`, `hreflang`, `ping`, `referrerpolicy`, `rel`, `target`, `type`.

**[routerLink] and [routerLinkActive] Support**

When used in an Angular app, frequently the `[routerLink]` directive will be used on the `nimble-breadcrumb-item`, instead of directly setting `href`. An example:
```html
<nimble-breadcrumb-item routerLink="/customapp" [queryParams]="{debug: true}" [state]="{tracingId: 123}">Custom App Page</nimble-breadcrumb-item>
```  
As shown above, clients using [routerLink] can also set queryParams dynamically, pass state when the router navigates, etc.  
[[routerLinkActive]](https://github.com/angular/angular/blob/0a2191f8e7e232087aab0a7a9eb9ee6871580267/packages/router/src/directives/router_link_active.ts) can also be used to add CSS classes on a link that points to the current page/ route.  
One use case for the Nimble breadcrumb is the [SystemLink sl-breadcrumb-bar, which already uses [routerLink]](https://ni.visualstudio.com/DevCentral/_git/Skyline?path=/Web/Workspaces/SystemLinkShared/projects/systemlink-lib-angular/src/sl-breadcrumb-bar/sl-breadcrumb-bar.component.html&version=GBmaster&line=4&lineEnd=5&lineStartColumn=1&lineEndColumn=1&lineStyle=plain&_a=contents).

Angular has 2 directives handling [routerLink]:
 - [RouterLink](https://github.com/angular/angular/blob/0a2191f8e7e232087aab0a7a9eb9ee6871580267/packages/router/src/directives/router_link.ts#L119): Selector `:not(a):not(area)[routerLink]`. Does a router navigation on left-click; handles Ctrl-Click the same way; does not compute an href (as it doesn't target `<a>` elements)
 - [RouterLinkWithHref](https://github.com/angular/angular/blob/0a2191f8e7e232087aab0a7a9eb9ee6871580267/packages/router/src/directives/router_link.ts#L257): Selector `a[routerLink],area[routerLink]`: Computes an href for the anchor element it targets; left-click does a router navigation; Ctrl-click and middle-mouse-button click defer to the browser (to open a new tab/window)

We want the behavior of RouterLinkWithHref, so we can subclass it and update the selector (to `nimble-breadcrumb-item[routerLink]`). However there'll still be a RouterLink directive active doing the wrong action too. In current Angular versions there's not a good way to disable RouterLink navigation ([see the comment on this Angular commit](https://github.com/angular/angular/commit/ccb09b4558a3864fb5b2fe2214d08f1c1fe2758f)), however we can prevent the RouterLink onClick from being called (with a click listener on a child element, or with a listener with useCapture=true).

For an example/ prototype implementation [see the directives here](https://github.com/ni/nimble/tree/nimble-breadcrumb-prototype/angular-workspace/projects/ni/nimble-angular/src/directives/breadcrumb-item). (This prototype has the correct behavior for left-click, Ctrl-click, and middle-mouse click of breadcrumb item links, and href gets set correctly.)

### Additional requirements

- User interaction: *Do the FAST component's behaviors match the visual design spec? When they differ, which approach is preferable and why?*
    - FAST breadcrumb separator is not part of the hyperlink/anchor - see open issues
- Styling: *Does FAST provide APIs to achieve the styling in the visual design spec?*
    - FAST provides sufficient hooks (CSS Shadow Parts) for us to style all parts of a breadcrumb
    - `breadcrumb-item` uses `anchor`'s template when the 'href' property is set, we should be able to do the same thing. We'll use similar (or shared) styles for the breadcrumb-item and the anchor. See [nimble issue 324](https://github.com/ni/nimble/issues/324) which captures the nimble-anchor work.
    - The separator is a Shadow Part, which allow us (or Nimble clients) to offset the separator's position vertically, which may be needed to align icon-based separators with the breadcrumb item text.
- Testing
    - FAST's breadcrumb/breadcrumb-item component tests look reasonable + sufficient
    - Angular directive tests need to cover our support for the [routerLink] / [routerLinkActive] directives
- Documentation: Mostly standard Storybook / demo in example client app; should probably showcase a non-default font, font size, and separator 
- Globalization:
    - FAST breadcrumb handles reversing items in RTL mode
    - Since we plan to use an icon for the separator, we can add styles to mirror/rotate it in RTL mode (using FAST's `DirectionalStyleSheetBehavior`)
- Tooling: N/A
- Security: No additional concerns/ requirements. Clients can use all the normal anchor properties if desired (i.e. `rel`).
- Performance: No concerns

- *Accessibility: keyboard navigation/focus, form input, use with assistive technology, etc*

## Open Issues

- Need to finalize styling and colors for Nimble anchors/hyperlinks, which this control will also use. See [nimble issue 324](https://github.com/ni/nimble/issues/324) 
- Current breadcrumb in SystemLink includes the breadcrumb separator `>` as part of the hyperlink (so it's clickable as part of the link). Do we need to support that?  
     ![SystemLink Current Breadcrumb](https://user-images.githubusercontent.com/20709258/152267291-2ca8c247-b236-4d61-8312-489cf0aaf6d2.PNG) <!--(./spec-images/SLBreadcrumbCurrentHover.PNG)-->  
    - TODO: check with Leslie + Brandon
    - If we need to, we'll have to customize the FAST Breadcrumb Item's template
- Does NimbleBreadcrumbItemDirective need the attribute bindings besides `href`, `hreflang`, `rel`, and `target`?
